import { phrase } from '@/lib/i18n-regles';

/*
 * Les deux boutons d'action du site, écrits une seule fois (décision de Camille, 2026-10-22,
 * inspirée de tooly.ca : un seul texte pour la même action). Avant : 12 libellés différents
 * menaient tous à /rdv. La phrase au-dessus d'un bouton peut changer selon le sujet ; le bouton,
 * jamais. Les liens d'information (« En savoir plus », « Par où commencer ? ») ne sont pas concernés.
 */
export const APPEL = {
  libelle: phrase("Réserver mon appel gratuit"),
  /* Barre du haut seulement (refonte du 2026-10-23, choix de Camille). */
  court: phrase("Appel de découverte gratuit"),
  href: '/rdv',
} as const;

/* Pour la personne qui n'est pas prête à choisir une heure. Seulement sur Prix (/devis) depuis la
   refonte du 2026-10-23 (un seul bouton ailleurs ; la page Contact est déjà le formulaire écrit). */
export const ECRIT = {
  libelle: phrase("Décrire ma situation par écrit"),
  href: '/devis#situation',
} as const;
