# Évaluation des facteurs relatifs à la vie privée — communication de renseignements personnels hors du Québec

**Entreprise** : Vie Solution Web (viesolutionweb.ca)
**Responsable de la protection des renseignements personnels** : Camille Yvan `[à confirmer : titre exact et désignation publiée sur le site]`
**Rédigé le** : 24 octobre 2026, à partir de ce qui est réellement en place dans le site et le CRM (code et réglages vérifiés).
**Fondement** : Loi sur la protection des renseignements personnels dans le secteur privé (Québec), art. 17 (communication à l'extérieur du Québec) et art. 3.3 (évaluation pour un projet de système d'information).

> Brouillon préparé avec l'aide de Claude (Anthropic). Ce n'est pas un avis juridique : en cas de doute, faites-le relire par un professionnel. Les points marqués `[à confirmer]` doivent être vérifiés par Camille avant la signature.

---

## 1. Ce que l'évaluation couvre

Le site viesolutionweb.ca et son CRM recueillent des renseignements personnels de **prospects, de clients et de participants aux ateliers** :
- **demandes** : formulaires de contact et de devis, demandes de rendez-vous, candidatures de stage ;
- **avis et témoignages** ;
- **inscriptions aux ateliers** ;
- **courriels** reçus et envoyés.

Certains fournisseurs qui traitent ces renseignements sont situés **hors du Québec**. Cette évaluation porte sur chacun d'eux.

Renseignements concernés : nom, adresse courriel, numéro de téléphone, nom de l'entreprise ou métier, contenu des messages, date et heure d'un rendez-vous, consentements (date et texte).

**Aucun renseignement sensible n'est demandé** : ni santé, ni finances, ni numéro d'identité. Les formulaires et la bulle de clavardage demandent de ne pas en écrire.

## 2. Les fournisseurs

| Fournisseur | Rôle | Où sont les données | Renseignements transmis | Conservés combien de temps |
|---|---|---|---|---|
| **Supabase** (base de données du site et du CRM) | Stockage de toutes les données du CRM | **Canada, région ca-central-1 (Montréal)**, vérifié le 2026-10-24 dans les réglages du projet Supabase : reste au Québec | Tous ceux de la section 1 | Aucune suppression automatique pour l'instant : jusqu'à suppression dans l'admin `[à décider : durée de conservation, par ex. 24 mois après le dernier contact]`. (Les « 6 mois / 24 mois » du code concernent seulement le droit d'envoyer des courriels commerciaux, loi anti-pourriel.) |
| **Vercel** (hébergement du site) | Exécute le site et ses formulaires | États-Unis `[à confirmer : région des fonctions dans Vercel]` | Ils transitent pendant le traitement d'une page ou d'un formulaire. Pas de stockage par le site ; les journaux techniques Vercel peuvent contenir l'adresse IP. | Journaux Vercel : selon le forfait `[à confirmer]` |
| **Resend** (envoi des courriels) | Accusés de réception, relances, confirmations et rappels d'ateliers, boîte de réception | États-Unis `[à confirmer]` | Adresse courriel, nom (prénom dans le texte), contenu du courriel | Selon Resend `[à confirmer]` |
| **Google** (Google Agenda et Google Meet) | Rendez-vous réservés sur /rdv, avec lien Meet et invitation | États-Unis et autres pays (infrastructure mondiale de Google) | Adresse courriel du visiteur, date et heure du rendez-vous. Le texte de l'invitation est fixe : le nom, le téléphone et le sujet restent dans le CRM. | Dans l'agenda de Camille, jusqu'à ce qu'elle supprime l'événement |
| **Anthropic** (assistant IA de la bulle de clavardage) | Produire les réponses de la bulle | États-Unis | Les messages que le visiteur écrit dans la bulle | Le site n'enregistre pas la conversation ; Anthropic selon ses conditions `[à confirmer : durée de conservation chez Anthropic]` |
| **Cloudflare** (domaine et renvoi des courriels) | Nom de domaine ; renvoi de info@ `[à confirmer : renvoi actif ou non]` | Réseau mondial | Courriels reçus à info@ (s'ils sont renvoyés) | Transit seulement |

## 3. Pour chaque communication : pourquoi, et est-ce raisonnable ?

- **Finalité** : chaque fournisseur ne reçoit que ce qu'il faut pour rendre le service demandé par la personne : répondre à sa demande, lui envoyer un courriel, créer son rendez-vous, répondre dans la bulle.
- **Minimisation** :
  - Les statistiques de visite ne gardent ni IP, ni cookie, ni navigateur complet ; seuls les compteurs anti-abus gardent une empreinte salée de l'adresse IP, effacée après environ 24 h.
  - L'invitation Google a un texte fixe.
  - La bulle n'enregistre pas la conversation.
  - Le lieu privé des ateliers (adresse ou lien) n'est envoyé qu'aux inscrits.
- **Sensibilité** : faible. Il s'agit de coordonnées professionnelles et de messages commerciaux ; aucun renseignement sensible n'est demandé.

## 4. Mesures de protection en place (vérifiées dans le code)

- **Chiffrement en transit** : HTTPS partout.
- **Accès à la base** : sécurité au niveau des lignes (RLS) activée sur toutes les tables du CRM ; les demandes, fiches, courriels, avis, inscriptions et visites ne sont lisibles que par le serveur, avec une clé secrète. Exceptions héritées, inutilisées par le site : `vsw_availability_windows` (lecture publique), `vsw_faq_suggestions` et `vsw_comments` (envoi public, lecture des commentaires approuvés) `[à décider : retirer ces accès]`.
- **Admin** : code d'accès + double vérification (application d'authentification), session de 8 h, essais limités.
- **Secrets chiffrés** : le secret de la double vérification et l'accès à Google Agenda sont chiffrés (AES-256-GCM) dans la base.
- **Limites contre les abus** sur les formulaires publics : piège à robots, nombre d'envois par adresse et par jour.
- **Consentements** gardés avec leur date et leur texte : avis, inscriptions, case « prochains ateliers ».
- **Désabonnement** dans chaque courriel de relance (loi anti-pourriel).
- **Retrait sur demande** : la personne écrit à info@viesolutionweb.ca. Un avis se supprime dans l'admin (« Supprimer définitivement ») ; une inscription peut être annulée, et l'événement Google se supprime dans l'agenda. **Il n'existe pas encore de bouton pour supprimer une demande (fiche du CRM)** `[à faire : bouton « Supprimer définitivement » sur la fiche]`.

**Mesures contractuelles** : les conditions et ententes de traitement des données (« DPA ») de chaque fournisseur `[à confirmer : Camille télécharge et range l'entente de Vercel, Resend, Google Workspace ou compte Google, Anthropic]`.

## 5. Régime juridique du pays de destination

Les États-Unis n'offrent pas une protection équivalente à la loi québécoise : les autorités peuvent, dans certains cas, demander l'accès aux données. Le risque est jugé **faible et acceptable** pour les raisons suivantes :
- les renseignements sont peu sensibles ;
- les fournisseurs sont de grandes entreprises dotées d'engagements contractuels de sécurité ;
- la base principale reste au Canada ;
- seules les données nécessaires au service partent.

## 6. Conclusion

La communication hors du Québec peut se poursuivre : les renseignements bénéficient d'une **protection adéquate**, compte tenu de leur faible sensibilité, des finalités limitées et des mesures en place.

**Actions à faire** :
1. Confirmer les points `[à confirmer]` du tableau : région Vercel, Resend, durées de conservation, renvoi de info@ ; **décider d'une durée de conservation** des demandes et des inscriptions (le CRM n'en applique aucune aujourd'hui).
2. Ranger les ententes de traitement (DPA) des fournisseurs avec ce document.
3. Garder la politique de confidentialité à jour. Elle nomme déjà Anthropic et Google ; ajouter Resend et Vercel `[à décider]`.
4. Refaire cette évaluation à chaque nouveau fournisseur, par exemple un paiement en ligne pour les ateliers.

---

**Signature du responsable** : ______________________   **Date** : ____________
