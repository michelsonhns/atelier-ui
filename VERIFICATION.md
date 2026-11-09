# Vérifications — 9 novembre 2026

Cette version a été reconstruite à partir de la conversation après la perte des fichiers de l’environnement initial. Elle constitue un nouvel historique Git ; elle ne prétend pas restaurer le commit perdu à l’identique.

- TypeScript : compilation réussie de la bibliothèque, de la galerie, des stories, des tests et de leurs configurations.
- Vite : build de production avec le chemin `/atelier-ui/` réussi.
- Storybook : build statique réussi, 31 stories documentées.
- Chromium / Playwright : **66 tests réussis**, incluant les stories dans les deux thèmes et les parcours de galerie sur ordinateur/mobile.
- Axe : aucune violation détectée dans les états audités pour les règles WCAG 2 A/AA et 2.1 AA testées. Les audits ne constituent pas une certification complète.
- Clavier : activation Entrée/Espace, tabulation excluant les boutons désactivés, sélections, formulaires invalides, lien d’évitement, onglets, confinement et restitution du focus des dialogues.
- Thème : les tests vérifient le mode chargé et sa persistance après rechargement.
- Package : archive installée dans un projet temporaire indépendant ; imports ESM/CJS, types publics et rendu serveur React 19 dans les deux thèmes vérifiés.

Les commandes reproductibles figurent dans README.md. La publication continue reconstruit les sites et relance les tests avant le déploiement.
