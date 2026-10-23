// Tests des courriels reçus (src/lib/crm/entrant.ts) et de l'habillage (gabarit-courriel.ts). npm test.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import {
  TOLERANCE_S,
  cleConversation,
  lireExpediteur,
  pourNotreDomaine,
  signatureValide,
  texteDepuisHtml,
  texteRecu,
} from '../src/lib/crm/entrant.ts';
import { AVEC_BOUTON, SIGNATURE, habiller, sansSignature } from '../src/lib/crm/gabarit-courriel.ts';
import { raisonPied, piedLcap } from '../src/lib/crm/regles.ts';

const CLE = Buffer.from('cle-de-test-32-octets-0123456789');
const SECRET = `whsec_${CLE.toString('base64')}`;
const signer = (id, ts, corps) => createHmac('sha256', CLE).update(`${id}.${ts}.${corps}`).digest('base64');

test('signature Resend (Svix) : acceptée seulement si exacte et récente', () => {
  const corps = '{"type":"email.received","data":{"email_id":"abc"}}';
  const ts = 1792740000;
  const bonne = signer('msg_1', ts, corps);
  const ok = (signature, extra = {}) =>
    signatureValide(SECRET, { id: 'msg_1', timestamp: String(ts), signature, ...extra }, corps, extra.maintenant ?? ts + 10);
  assert.equal(ok(`v1,${bonne}`), true);
  assert.equal(ok(`v1,AAAA v1,${bonne}`), true, 'plusieurs signatures');
  assert.equal(ok(`v2,${bonne}`), false, 'version inconnue');
  assert.equal(ok(`v1,${signer('msg_2', ts, corps)}`), false, 'autre identifiant');
  assert.equal(signatureValide(SECRET, { id: 'msg_1', timestamp: String(ts), signature: `v1,${bonne}` }, corps + ' ', ts), false, 'corps modifié');
  assert.equal(signatureValide(SECRET, { id: 'msg_1', timestamp: String(ts), signature: `v1,${bonne}` }, corps, ts + TOLERANCE_S + 1), false, 'trop vieux');
  assert.equal(signatureValide('', { id: 'msg_1', timestamp: String(ts), signature: `v1,${bonne}` }, corps, ts), false, 'sans secret');
  assert.equal(signatureValide(SECRET, { id: null, timestamp: String(ts), signature: `v1,${bonne}` }, corps, ts), false, 'sans en-tête');
  assert.equal(signatureValide(`whsec_${Buffer.from('autre-cle').toString('base64')}`, { id: 'msg_1', timestamp: String(ts), signature: `v1,${bonne}` }, corps, ts), false, 'mauvais secret');
});

test('expéditeur : nom et adresse, rien de douteux', () => {
  assert.deepEqual(lireExpediteur('Marie Exemple <Marie@Exemple.CA>'), { nom: 'Marie Exemple', adresse: 'marie@exemple.ca' });
  assert.deepEqual(lireExpediteur('"Paul, Zoho" <paul@ex.ca>'), { nom: 'Paul, Zoho', adresse: 'paul@ex.ca' });
  assert.deepEqual(lireExpediteur('paul@ex.ca'), { nom: '', adresse: 'paul@ex.ca' });
  for (const v of ['', 'Marie', '<pas-un-courriel>', '*@ex.ca', 'a%b@ex.ca', null, 42]) assert.equal(lireExpediteur(v), null, String(v));
});

test('texte lisible tiré du HTML', () => {
  assert.equal(texteDepuisHtml('<p>Bonjour&nbsp;Camille,</p><p>Jeudi <b>10 h</b> ?<br>Merci</p><script>alert(1)</script>'), 'Bonjour Camille,\n\nJeudi 10 h ?\nMerci');
  assert.equal(texteDepuisHtml('L&#39;IA &amp; Zoho &#x2014; ok'), "L'IA & Zoho — ok");
  assert.equal(texteDepuisHtml('a<scr<script>ipt>alert(1)</script>b'), 'ascrb', 'balises imbriquées : le script part au complet, aucune balise ne reste');
  assert.ok(!/[<>]/.test(texteDepuisHtml('<<b>i>x</b>>')), 'aucun chevron ne reste');
  assert.equal(texteDepuisHtml('x&#99999999;y&#x110000;z&#0;'), 'xyz', 'code de caractère invalide : ignoré, sans exception');
  assert.equal(texteDepuisHtml('2 &lt; 3'), '2 < 3', 'une entité décodée reste du texte');
  assert.equal(texteRecu('  texte brut  ', '<p>html</p>'), 'texte brut');
  assert.equal(texteRecu('', '<p>html</p>'), 'html');
  assert.equal(texteRecu(null, null), '');
  assert.equal(texteRecu('x'.repeat(30000), '').length, 20000);
});

test('domaine et conversation', () => {
  assert.equal(pourNotreDomaine(['info@viesolutionweb.ca'], 'viesolutionweb.ca'), true);
  assert.equal(pourNotreDomaine(['Camille <INFO@VieSolutionWeb.ca>'], 'viesolutionweb.ca'), true);
  assert.equal(pourNotreDomaine(['info@autre.ca'], 'viesolutionweb.ca'), false);
  assert.equal(pourNotreDomaine('info@viesolutionweb.ca', 'viesolutionweb.ca'), false);
  assert.equal(cleConversation({ lead_id: 'L1', from_email: 'a@ex.ca', to_email: null, direction: 'in' }), 'fiche:L1');
  assert.equal(cleConversation({ lead_id: null, from_email: 'A@Ex.ca', to_email: null, direction: 'in' }), 'adresse:a@ex.ca');
  assert.equal(cleConversation({ lead_id: null, from_email: 'info@viesolutionweb.ca', to_email: 'B@ex.ca', direction: 'out' }), 'adresse:b@ex.ca');
});

test('habillage : signature, bouton selon le gabarit, texte échappé', () => {
  assert.equal(sansSignature('Bonjour,\n\nMerci.\n\nAu plaisir,\nCamille, Vie Solution Web'), 'Bonjour,\n\nMerci.\n\nAu plaisir,');
  assert.equal(sansSignature('Au plaisir,\nCamille — Vie Solution Web'), 'Au plaisir,');
  assert.equal(sansSignature('Merci encore,\nCamille'), 'Merci encore,');
  assert.equal(sansSignature('Camille a dit oui.'), 'Camille a dit oui.', 'pas une signature');
  const html = habiller({ corpsHtml: '<p>Bonjour</p>', piedHtml: '<p>pied</p>', site: 'https://viesolutionweb.ca', bouton: { libelle: 'Réserver un appel', url: 'https://viesolutionweb.ca/rdv' } });
  assert.match(html, /https:\/\/viesolutionweb\.ca\/courriel\/logo\.png/);
  assert.ok(html.includes(SIGNATURE.nom) && html.includes(SIGNATURE.titre) && html.includes('(438) 506-5243'));
  assert.ok(html.includes('href="https://viesolutionweb.ca/rdv"'));
  assert.ok(html.includes('<p>Bonjour</p>') && html.includes('<p>pied</p>'));
  assert.ok(!habiller({ corpsHtml: '', piedHtml: '', site: 'https://viesolutionweb.ca' }).includes('/rdv'), 'sans bouton');
  assert.ok(AVEC_BOUTON.includes('accuse_reception') && AVEC_BOUTON.includes('modele_prospection'));
  assert.ok(!AVEC_BOUTON.includes('modele_confirmer_appel') && !AVEC_BOUTON.includes('modele_soumission'));
});

test('pied légal : raison selon la provenance', () => {
  assert.equal(raisonPied({ source: 'site web — contact' }, 'https://viesolutionweb.ca'), 'vous nous avez écrit depuis viesolutionweb.ca');
  assert.equal(raisonPied({ source: 'admin — Recommandation', consent_at: '2026-10-23T00:00:00Z' }, 'https://viesolutionweb.ca'), 'vous avez accepté de recevoir nos courriels');
  assert.equal(raisonPied({ source: 'admin — Appel reçu', consent_at: null }, 'https://viesolutionweb.ca'), 'vous nous avez contactés');
  const p = piedLcap({ nom: 'Vie Solution Web', adressePostale: '1 rue X', site: 'https://viesolutionweb.ca' }, 'https://viesolutionweb.ca/api/desabonnement?t=1', 'vous nous avez contactés');
  assert.match(p.texte, /parce que vous nous avez contactés\./);
  assert.match(piedLcap({ nom: 'V', adressePostale: 'A', site: 'https://viesolutionweb.ca' }, 'https://x').texte, /écrit depuis viesolutionweb\.ca/);
});

test('courriel reçu : forme simple, réponse dans le même fil', async () => {
  const { lireCourrielRecu, sujetReponse, entetesFil } = await import('../src/lib/crm/entrant.ts');
  const c = lireCourrielRecu({
    from: 'Marie Exemple <marie@exemple.ca>',
    to: ['info@viesolutionweb.ca'],
    cc: 'paul@ex.ca',
    subject: 'Question\r\nBcc: x@y.z',
    html: '<p>Bonjour</p>',
    message_id: '<abc@mail.exemple.ca>',
    attachments: [{ filename: 'plan.pdf', size: 1200 }, null],
  });
  assert.deepEqual(c.expediteur, { nom: 'Marie Exemple', adresse: 'marie@exemple.ca' });
  assert.deepEqual(c.destinataires, ['info@viesolutionweb.ca', 'paul@ex.ca']);
  assert.equal(c.sujet, 'Question Bcc: x@y.z', 'pas de saut de ligne dans un sujet');
  assert.equal(c.texte, 'Bonjour');
  assert.equal(c.messageId, '<abc@mail.exemple.ca>');
  assert.deepEqual(c.pieces, [{ nom: 'plan.pdf', taille: 1200 }]);
  assert.equal(lireCourrielRecu({ from: 'pas-un-courriel' }), null);
  assert.equal(lireCourrielRecu({ from: 'a@ex.ca', message_id: '<a b>' }).messageId, null);
  assert.equal(sujetReponse('Question'), 'Re : Question');
  assert.equal(sujetReponse('RE: Question'), 'RE: Question');
  assert.equal(sujetReponse(''), 'Re : votre message');
  assert.deepEqual(entetesFil('abc@x'), { 'In-Reply-To': '<abc@x>', References: '<abc@x>' });
  assert.deepEqual(entetesFil(null), {});
});

test('boîte : conversations regroupées, à répondre, inconnus', async () => {
  const { regrouperConversations } = await import('../src/lib/crm/entrant.ts');
  const m = (id, o) => ({ id, lead_id: null, direction: 'in', from_email: 'x@ex.ca', to_email: 'info@viesolutionweb.ca', subject: 's', snippet: 'e', received_at: '2026-10-23T10:00:00Z', traite_at: null, ignore_at: null, ...o });
  const c = regrouperConversations(
    [
      m('1', { lead_id: 'L1', from_email: 'marie@ex.ca', received_at: '2026-10-23T09:00:00Z' }),
      m('2', { lead_id: 'L1', direction: 'out', from_email: 'info@viesolutionweb.ca', to_email: 'marie@ex.ca', received_at: '2026-10-23T11:00:00Z', subject: 'Re : s' }),
      m('3', { from_email: 'Paul@Ex.ca', received_at: '2026-10-22T10:00:00Z', ignore_at: '2026-10-22T11:00:00Z' }),
      m('4', { lead_id: 'L2', direction: 'out', to_email: 'louis@ex.ca', received_at: '2026-10-23T12:00:00Z' }),
      m('5', { lead_id: 'L1', from_email: 'marie@ex.ca', received_at: '2026-10-21T09:00:00Z', traite_at: '2026-10-21T10:00:00Z' }),
    ],
    new Map([['L1', 'Marie Exemple']]),
  );
  assert.equal(c.length, 2, 'la fiche sans courriel reçu n’entre pas');
  assert.deepEqual(
    { cle: c[0].cle, nom: c[0].nom, sujet: c[0].sujet, deNous: c[0].deNous, aRepondre: c[0].aRepondre, recus: c[0].recus },
    { cle: 'fiche:L1', nom: 'Marie Exemple', sujet: 'Re : s', deNous: true, aRepondre: true, recus: 2 },
  );
  assert.deepEqual({ cle: c[1].cle, adresse: c[1].adresse, aRepondre: c[1].aRepondre, ignoree: c[1].ignoree, leadId: c[1].leadId }, { cle: 'adresse:paul@ex.ca', adresse: 'paul@ex.ca', aRepondre: false, ignoree: true, leadId: null });
});

test('réponses automatiques et authentification de l’expéditeur', async () => {
  const { lireEntetes, estReponseAutomatique, verdictAuthentification, adresseDeNotreDomaine, lireCourrielRecu } = await import('../src/lib/crm/entrant.ts');
  const e = (o) => lireEntetes(o);
  assert.equal(e([{ name: 'Auto-Submitted', value: 'auto-replied' }]).get('auto-submitted'), 'auto-replied', 'liste [{ name, value }]');
  assert.equal(e({ 'X-Test': ['a', 'b'] }).get('x-test'), 'a ; b', 'objet, valeurs multiples');
  assert.equal(e(null).size, 0);
  assert.equal(estReponseAutomatique(e({ 'Auto-Submitted': 'auto-replied' }), 'Re : votre demande'), true);
  assert.equal(estReponseAutomatique(e({ 'Auto-Submitted': 'no' }), 'Question'), false, 'Auto-Submitted: no = écrit par une personne');
  assert.equal(estReponseAutomatique(e({ Precedence: 'bulk' }), 'Infolettre'), true);
  assert.equal(estReponseAutomatique(e({ 'List-Unsubscribe': '<mailto:x>' }), 'Promo'), true);
  assert.equal(estReponseAutomatique(e({}), 'Réponse automatique : absent'), true);
  assert.equal(estReponseAutomatique(e({}), 'Out of Office: back Monday'), true);
  assert.equal(estReponseAutomatique(e({}), 'Merci ! Jeudi 10 h me convient'), false);
  assert.equal(verdictAuthentification(e({ 'Authentication-Results': 'mx.resend; dkim=pass; spf=pass; dmarc=pass' })), 'ok');
  assert.equal(verdictAuthentification(e({ 'Authentication-Results': 'mx; dkim=none; spf=fail; dmarc=fail' })), 'echec');
  assert.equal(verdictAuthentification(e({ 'Authentication-Results': 'mx; dkim=fail; spf=softfail' })), 'echec');
  assert.equal(verdictAuthentification(e({ 'Authentication-Results': 'mx; spf=neutral' })), 'inconnu');
  assert.equal(verdictAuthentification(e({})), 'inconnu');
  assert.equal(adresseDeNotreDomaine(['Camille <INFO@viesolutionweb.ca>'], 'viesolutionweb.ca'), 'info@viesolutionweb.ca');
  assert.equal(adresseDeNotreDomaine(['x@viesolutionweb.ca.piege.com'], 'viesolutionweb.ca'), null, 'domaine exact');
  assert.equal(lireCourrielRecu({ from: 'a@ex.ca', headers: { 'Auto-Submitted': 'auto-generated' } }).entetes.get('auto-submitted'), 'auto-generated');
  assert.equal(lireCourrielRecu({ from: '"a,b"@ex.ca' }), null, 'adresse que lireCle refuserait');
});

test('la réponse d’un prospect n’est pas un contact humain (elle n’arrête que les relances 1 et 2)', async () => {
  const { TYPES_CONTACT } = await import('../src/lib/crm/regles.ts');
  assert.ok(!TYPES_CONTACT.includes('email_in'));
});
