# Atelier UI

Design system React + TypeScript + MUI, avec galerie responsive et documentation Storybook en français. Ce dépôt contient la reconstruction du projet à partir de la conversation de conception, réalisée le 9 novembre 2026 après la réinitialisation de l’environnement initial.

- **Galerie** : https://michelsonhns.github.io/atelier-ui/
- **Storybook** : https://michelsonhns.github.io/atelier-ui/storybook/

## Installer sur votre ordinateur

Node.js ≥ 20.19 et npm sont nécessaires.

```sh
git clone https://github.com/michelsonhns/atelier-ui.git
cd atelier-ui
npm ci
npm run dev
```

La galerie démarre sur http://localhost:5173. `npm run storybook` ouvre la documentation sur http://localhost:6006. En développement, lancer les deux serveurs séparément et consulter la documentation directement sur le port 6006. Le lien Storybook intégré à la galerie fonctionne sur le site publié.

## Bibliothèque réutilisable

```sh
npm run pack:local
```

Dans le projet consommateur :

```sh
npm install /chemin/atelier-ui-react-1.0.0.tgz
```

L’archive se trouve dans `artifacts/`. Elle contient les modules ESM/CommonJS, les déclarations TypeScript et ce README. React, React DOM, MUI et Emotion sont des peer dependencies et ne sont pas intégrés au bundle. npm récent les installe si nécessaire ; les versions d’un projet existant doivent être compatibles.

```tsx
import {
  AtelierProvider,
  DsButton,
  SectionCard,
  StatusBadge,
} from "@atelier-ui/react";

export function App() {
  return (
    <AtelierProvider mode="light">
      <SectionCard
        title="Mon projet"
        description="Un espace pour votre équipe."
      >
        <StatusBadge status="active" />
        <DsButton onClick={() => console.log("Créer")}>Créer</DsButton>
      </SectionCard>
    </AtelierProvider>
  );
}
```

Exports : `AtelierProvider`, `DsButton`, `SectionCard`, `StatusBadge`, `createAtelierTheme`, `tokens` et leurs types de propriétés. Le provider inclut `CssBaseline` et ne lit aucun stockage navigateur. Le mode est contrôlé par l’application hôte. `DsButton` transmet sa ref au bouton HTML. `SectionCard` crée une section nommée par son titre h2 ; placer les cartes sous un titre h1. Sa propriété `sx` accepte un objet, une fonction ou un tableau.

Le package est `private: true` : il est installable par archive, sa publication sur un registre est bloquée. Une publication npm nécessite de choisir votre scope, une licence et une politique de versions. Aucun package npm n’est publié par le workflow Pages.

## Documentation et accessibilité

Les 31 stories couvrent les composants publics, les tokens, les thèmes et les compositions MUI : champs normaux, en erreur, désactivés et en lecture seule ; sélections ; alertes ; progression ; dialogues ; onglets. Les contrôles modifient les propriétés, la barre d’outils commute le thème, Accessibility lance axe et Interactions présente les scénarios clavier.

- Tab/Maj+Tab parcourent les contrôles ; Entrée/Espace activent les actions et sélections. Les boutons désactivés sont exclus de la tabulation.
- Le focus possède un contour visible. Un lien d’évitement mène au contenu de la galerie.
- Les champs ont des libellés et messages associés. Un formulaire invalide place le focus sur le premier champ incorrect.
- Les dialogues piègent le focus, se ferment avec Échap et restituent le focus au déclencheur.
- Les onglets utilisent les flèches puis Entrée/Espace, avec des panneaux nommés.
- Les statuts expriment leur sens avec un texte en plus de la couleur. L’application gère l’annonce de leurs changements asynchrones si nécessaire.
- Les animations respectent la préférence de réduction du mouvement.

Axe vérifie les règles WCAG 2 A/AA et 2.1 AA disponibles. Ces audits automatisés ne constituent pas une certification complète ; une revue avec les technologies d’assistance et le contenu réel reste nécessaire.

## Vérifier le projet

```sh
npm run typecheck
npm run build
npm run build-storybook
npx playwright install chromium
npm run test:a11y
npm run check:package
```

Les tests servent les builds sur les ports 6006 et 5174, qui doivent être libres. Ils exécutent les 31 stories dans les deux thèmes, leurs fonctions `play`, les audits axe et quatre parcours supplémentaires de galerie sur ordinateur/mobile. Les rapports axe sont joints aux résultats Playwright ; `npx playwright show-report` ouvre le rapport. Les traces sont conservées en cas d’échec.

Pour vérifier le chemin de GitHub Pages : `npm run build -- --base=/atelier-ui/`, puis `GALLERY_BASE_PATH=/atelier-ui/ npm run test:a11y` (syntaxe Bash).

`check:package` crée l’archive, l’installe dans un projet temporaire indépendant puis vérifie ses types, les imports ESM/CJS et le rendu serveur React 19 dans les deux thèmes. Cette commande utilise le réseau pour installer les peer dependencies.

## Publication GitHub Pages

Dans Settings > Pages, choisir **GitHub Actions** comme source. Le workflow `.github/workflows/pages.yml` s’exécute à chaque push sur `main` ou manuellement depuis Actions. Il vérifie TypeScript, construit la galerie avec le chemin de base de Pages, construit Storybook, exécute les audits puis publie Storybook dans `storybook/` avec la galerie. Un échec de vérification empêche le déploiement.

## Organisation et conventions

- `src/design-system/` : bibliothèque et thème ; seule entrée du package.
- `src/stories/`, `.storybook/` : documentation et interactions.
- `src/main.tsx`, `src/style.css` : galerie locale, sans backend ni authentification.
- `tests/` : audits et clavier ; `scripts/check-package.mjs` : intégration indépendante.
- `lib/` : bibliothèque ; `dist/` : galerie ; `storybook-static/` : documentation statique.

Utiliser les couleurs sémantiques du thème (`primary.main`, `text.secondary`, `divider`). L’unité MUI vaut 8 px : `p: 2` = 16 px, `p: 0.5` = 4 px. `tokens.spacing` répertorie des pixels. Les tokens de couleur représentent la palette de base claire ; les couleurs de statut du thème s’adaptent au mode sombre.
