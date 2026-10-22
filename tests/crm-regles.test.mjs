// Tests des règles du suivi des demandes (src/lib/crm/regles.ts, src/lib/crm/jeton.ts).
// Lancement : npm test (node --test, types TypeScript retirés par Node).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ajouterMois,
  estDemandeDuSite,
  estDemandeProspect,
  recoitAccuseReception,
  alerteNouvelleDemande,
  peutEnvoyerCommercial,
  raisonDeRetenue,
  avecDesabonnementAdresse,
  echeance,
  contactDepuis,
  plusRecente,
  statutApresContact,
  remplir,
  prenomDe,
  texteEnHtml,
  piedLcap,
  pretAEnvoyer,
  masquerCourriel,
  estStatut,
} from '../src/lib/crm/regles.ts';
import {
  secretDesabonnement,
  jetonDesabonnement,
  jetonValide,
  lienDesabonnement,
  entetesDesabonnement,
  memeSecret,
} from '../src/lib/crm/jeton.ts';

const maintenant = new Date('2026-10-21T15:00:00Z');
const ilYa = (heures) => new Date(maintenant.getTime() - heures * 3600 * 1000).toISOString();

test('ajouterMois ne déborde pas sur le mois suivant', () => {
  assert.equal(ajouterMois('2026-08-31T12:00:00Z', 6).toISOString(), '2027-02-28T12:00:00.000Z');
  assert.equal(ajouterMois('2026-01-15T00:00:00Z', -6).toISOString(), '2025-07-15T00:00:00.000Z');
});

test('consentement tacite : 6 mois pour une demande, 2 ans pour un client, jamais après désabonnement', () => {
  assert.equal(peutEnvoyerCommercial({ status: 'Nouveau', created_at: '2026-05-01T00:00:00Z' }, maintenant), true);
  assert.equal(peutEnvoyerCommercial({ status: 'Nouveau', created_at: '2026-04-21T15:00:00Z' }, maintenant), false, '6 mois pile = expiré');
  assert.equal(
    peutEnvoyerCommercial({ status: 'Client', created_at: '2024-01-01T00:00:00Z', status_changed_at: '2025-06-01T00:00:00Z' }, maintenant),
    true,
  );
  assert.equal(
    peutEnvoyerCommercial({ status: 'Nouveau', created_at: ilYa(1), email_opt_out_at: ilYa(0.5) }, maintenant),
    false,
  );
});

test('raisonDeRetenue : sans courriel, désabonné, consentement expiré, sinon null', () => {
  assert.equal(raisonDeRetenue({ created_at: ilYa(48) }, maintenant), 'sans courriel');
  assert.equal(raisonDeRetenue({ email: 'a@b.ca', created_at: ilYa(48), email_opt_out_at: ilYa(1) }, maintenant), 'désabonné');
  assert.equal(raisonDeRetenue({ email: 'a@b.ca', created_at: '2025-01-01T00:00:00Z' }, maintenant), 'consentement expiré (LCAP)');
  assert.equal(raisonDeRetenue({ email: 'a@b.ca', created_at: ilYa(48) }, maintenant), null);
});

test('le désabonnement vise l\'adresse : une autre fiche de la même adresse en hérite (casse ignorée)', () => {
  const liste = new Map([['marie@exemple.ca', '2026-10-01T00:00:00Z']]);
  assert.equal(avecDesabonnementAdresse({ email: ' Marie@Exemple.CA ' }, liste).email_opt_out_at, '2026-10-01T00:00:00Z');
  assert.equal(avecDesabonnementAdresse({ email: 'autre@exemple.ca' }, liste).email_opt_out_at, undefined);
});

test('echeance : attendre avant le délai, ok dans la fenêtre de rattrapage, en retard au-delà', () => {
  assert.equal(echeance(ilYa(47), 48, maintenant), 'attendre');
  assert.equal(echeance(ilYa(48), 48, maintenant), 'ok');
  assert.equal(echeance(ilYa(48 + 72), 48, maintenant), 'ok');
  assert.equal(echeance(ilYa(48 + 73), 48, maintenant), 'en retard');
  assert.equal(echeance(null, 48, maintenant), 'attendre');
});

test('contactDepuis : seul un contact postérieur à l\'ancre arrête les relances', () => {
  assert.equal(contactDepuis(ilYa(10), ilYa(48)), true);
  assert.equal(contactDepuis(ilYa(50), ilYa(48)), false);
  assert.equal(contactDepuis(null, ilYa(48)), false);
  assert.equal(contactDepuis(ilYa(48), ilYa(48)), false);
});

test('plusRecente', () => {
  assert.equal(plusRecente(null, ilYa(5), ilYa(2), undefined), ilYa(2));
  assert.equal(plusRecente(null, undefined), null);
});

test('statutApresContact : Nouveau et À relancer passent à Contacté ; RDV, Qualifié, Client ne reculent pas', () => {
  assert.equal(statutApresContact('Nouveau', 'appel'), 'Contacté');
  assert.equal(statutApresContact('À relancer', 'courriel'), 'Contacté');
  assert.equal(statutApresContact('RDV', 'appel'), null);
  assert.equal(statutApresContact('Qualifié', 'courriel'), null);
  assert.equal(statutApresContact('Contacté', 'rdv'), 'RDV');
  assert.equal(statutApresContact('Client', 'rdv'), null);
  assert.equal(estStatut('À relancer'), true);
  assert.equal(estStatut('Inscrit'), false);
});

test('remplir et prenomDe : aucune accolade ne reste dans un courriel', () => {
  assert.equal(remplir('Bonjour {{prenom}}, {{ inconnu }}!', { prenom: 'Marie' }), 'Bonjour Marie, !');
  assert.equal(prenomDe('  Marie-Ève Tremblay '), 'Marie-Ève');
  assert.equal(prenomDe(null), '');
});

test('texteEnHtml échappe le HTML et rend les liens https cliquables', () => {
  const html = texteEnHtml('Bonjour <b>Marie</b>\n\nVoir https://viesolutionweb.ca/rdv');
  assert.match(html, /&lt;b&gt;Marie&lt;\/b&gt;/);
  assert.match(html, /<a href="https:\/\/viesolutionweb\.ca\/rdv"/);
  assert.equal((html.match(/<p /g) || []).length, 2);
});

test('piedLcap porte le nom, l\'adresse postale, le site et le lien de désabonnement', () => {
  const pied = piedLcap({ nom: 'Vie Solution Web', adressePostale: 'C.P. 123, Québec (Québec)', site: 'https://viesolutionweb.ca' }, 'https://viesolutionweb.ca/api/desabonnement?l=1&t=x');
  for (const morceau of ['Vie Solution Web', 'C.P. 123, Québec (Québec)', 'viesolutionweb.ca', '/api/desabonnement?l=1&t=x']) {
    assert.ok(pied.texte.includes(morceau), `texte : ${morceau}`);
  }
  assert.match(pied.html, /Ne plus recevoir de relances/);
  assert.match(pied.html, /l=1&amp;t=x/);
});

test('pretAEnvoyer : rien ne part sans Resend, expéditeur, adresse postale, secret et site https', () => {
  const ok = { resend: true, expediteur: true, adressePostale: 'C.P. 123', secretDesabonnement: true, site: 'https://viesolutionweb.ca' };
  assert.equal(pretAEnvoyer(ok), null);
  assert.match(pretAEnvoyer({ ...ok, resend: false }), /RESEND_API_KEY/);
  assert.match(pretAEnvoyer({ ...ok, expediteur: false }), /EMAIL_FROM/);
  assert.match(pretAEnvoyer({ ...ok, adressePostale: '  ' }), /adresse postale/);
  assert.match(pretAEnvoyer({ ...ok, secretDesabonnement: false }), /SECRET/);
  assert.match(pretAEnvoyer({ ...ok, site: 'http://localhost:3000' }), /https/);
});

test('masquerCourriel', () => {
  assert.equal(masquerCourriel('marie.tremblay@gmail.com'), 'm•••@gmail.com');
  assert.equal(masquerCourriel(''), '');
});

test('jeton de désabonnement : valide pour la bonne adresse seulement, insensible à la casse', () => {
  const cle = 'une-cle-de-test-assez-longue';
  const jeton = jetonDesabonnement('lead-1', 'Marie@Exemple.ca', cle);
  assert.ok(jeton.length > 20);
  assert.equal(jetonValide('lead-1', 'marie@exemple.ca', jeton, cle), true);
  assert.equal(jetonValide('lead-1', 'autre@exemple.ca', jeton, cle), false);
  assert.equal(jetonValide('lead-2', 'marie@exemple.ca', jeton, cle), false);
  assert.equal(jetonValide('lead-1', 'marie@exemple.ca', jeton, 'une-autre-cle-assez-longue'), false);
  assert.equal(jetonValide('lead-1', 'marie@exemple.ca', '', cle), false);
  assert.equal(jetonDesabonnement('lead-1', 'marie@exemple.ca', ''), '');
});

test('secret : UNSUBSCRIBE_SECRET d\'abord, CRON_SECRET ensuite, jamais un secret de moins de 16 caractères', () => {
  assert.equal(secretDesabonnement({ UNSUBSCRIBE_SECRET: 'a'.repeat(16), CRON_SECRET: 'b'.repeat(16) }), 'a'.repeat(16));
  assert.equal(secretDesabonnement({ UNSUBSCRIBE_SECRET: 'court', CRON_SECRET: 'b'.repeat(16) }), 'b'.repeat(16));
  assert.equal(secretDesabonnement({ CRON_SECRET: 'court' }), '');
});

test('lien et en-têtes de désabonnement : https seulement', () => {
  const cle = 'une-cle-de-test-assez-longue';
  const lien = lienDesabonnement('https://viesolutionweb.ca', 'lead-1', 'marie@exemple.ca', cle);
  assert.match(lien, /^https:\/\/viesolutionweb\.ca\/api\/desabonnement\?l=lead-1&t=/);
  assert.equal(lienDesabonnement('http://localhost:3000', 'lead-1', 'marie@exemple.ca', cle), '');
  assert.deepEqual(entetesDesabonnement(lien), { 'List-Unsubscribe': `<${lien}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' });
  assert.deepEqual(entetesDesabonnement(''), {});
});

test('memeSecret', () => {
  assert.equal(memeSecret('abc', 'abc'), true);
  assert.equal(memeSecret('abc', 'abd'), false);
  assert.equal(memeSecret('', ''), false);
});

test('accusé de réception : demandes de prospects du site seulement, pas les candidatures de stage', () => {
  assert.equal(estDemandeProspect({ source: 'site web — contact', service_interest: 'zoho' }), true);
  assert.equal(estDemandeProspect({ source: 'site web — rdv', service_interest: 'rdv-decouverte' }), true);
  assert.equal(estDemandeProspect({ source: 'site web — chatbot', service_interest: '' }), true);
  assert.equal(estDemandeProspect({ source: 'site web — contact', service_interest: 'candidature-stage' }), false);
  assert.equal(estDemandeProspect({ source: 'site web — contact', service_interest: ' candidature-stage ' }), false);
  assert.equal(estDemandeProspect({ source: 'admin', service_interest: 'zoho' }), false);
  assert.equal(estDemandeProspect({ source: null, service_interest: null }), false);
  assert.equal(estDemandeDuSite({ source: 'site web — contact', service_interest: 'candidature-stage' }), true);
  assert.equal(estDemandeDuSite({ source: 'import' }), false);
});

test('alerte de nouvelle demande : coordonnées, demande et lien vers /admin', () => {
  const { sujet, texte } = alerteNouvelleDemande(
    { name: 'Marie Tremblay', email: 'marie@exemple.ca', phone: '', company: 'Clinique Tremblay', service_interest: 'rdv-decouverte', need: 'Mes factures', source: 'site web — rdv' },
    'https://viesolutionweb.ca',
  );
  assert.equal(sujet, 'Nouvelle demande : Marie Tremblay');
  assert.match(texte, /Courriel : marie@exemple\.ca/);
  assert.match(texte, /Téléphone : —/);
  assert.match(texte, /Entreprise : Clinique Tremblay/);
  assert.match(texte, /Formulaire : site web — rdv \(rdv-decouverte\)/);
  assert.match(texte, /Demande : Mes factures/);
  assert.match(texte, /https:\/\/viesolutionweb\.ca\/admin/);
  const sans = alerteNouvelleDemande({ name: 'Léo', email: 'l@exemple.ca', source: 'site web — contact' }, 'https://viesolutionweb.ca').texte;
  assert.doesNotMatch(sans, /Entreprise/);
  assert.match(sans, /Demande : —/);
});

test('alerte : le HTML échappe ce que le visiteur a écrit', () => {
  const { texte } = alerteNouvelleDemande({ name: '<b>X</b>', email: 'x@exemple.ca', need: '<script>alert(1)</script>', source: 'site web — contact' }, 'https://viesolutionweb.ca');
  const html = texteEnHtml(texte);
  assert.doesNotMatch(html, /<script>/);
  assert.doesNotMatch(html, /<b>X<\/b>/);
});

test('prénom : seulement un mot fait de lettres, sinon « Bonjour, »', () => {
  assert.equal(prenomDe("D'Arcy Lévesque"), "D'Arcy");
  assert.equal(prenomDe('Jean-François'), 'Jean-François');
  assert.equal(prenomDe('https://faux-site.example/payer Tremblay'), '');
  assert.equal(prenomDe('<b>Marie</b>'), '');
  assert.equal(prenomDe('www.faux.ca'), '');
  assert.equal(prenomDe('x'.repeat(41)), '');
  assert.equal(remplir('Bonjour {{prenom}},\n', { prenom: prenomDe('https://faux.example') }), 'Bonjour,\n');
  assert.equal(remplir('Quelles sont vos disponibilités ?', {}), 'Quelles sont vos disponibilités ?');
});

test('accusé de réception : pas aux demandes de rendez-vous (texte « choisir le moment de notre appel »)', () => {
  assert.equal(recoitAccuseReception({ source: 'site web — contact', service_interest: 'zoho' }), true);
  assert.equal(recoitAccuseReception({ source: 'site web — rdv', service_interest: 'rdv-decouverte' }), false);
  assert.equal(recoitAccuseReception({ source: 'site web — contact', service_interest: 'candidature-stage' }), false);
});

test('alerte : objet sans saut de ligne, 80 caractères de nom au plus ; liens non cliquables', () => {
  const { sujet, texte } = alerteNouvelleDemande({ name: 'Marie\r\nBcc: x@y.z' + 'a'.repeat(200), email: 'm@exemple.ca', need: 'https://faux.example', source: 'site web — contact' }, 'https://viesolutionweb.ca');
  assert.doesNotMatch(sujet, /[\r\n]/);
  assert.ok(sujet.length <= 'Nouvelle demande : '.length + 80);
  assert.doesNotMatch(texteEnHtml(texte, false), /<a /);
  assert.match(texteEnHtml('Voir https://viesolutionweb.ca/rdv'), /<a href=/);
});

