import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
const root = process.cwd();
const run = (command, args, cwd = root) =>
  execFileSync(command, args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
  });
console.log(run("npm", ["run", "build:lib"]));
mkdirSync("artifacts", { recursive: true });
const [pack] = JSON.parse(
  run("npm", [
    "pack",
    "--ignore-scripts",
    "--json",
    "--pack-destination",
    "artifacts",
  ]),
);
if (
  pack.files.some((file) =>
    /^(src|node_modules|storybook-static|dist)\//.test(file.path),
  )
)
  throw new Error("Fichiers de développement inclus dans le package");
const archive = resolve("artifacts", pack.filename),
  consumer = mkdtempSync(join(tmpdir(), "atelier-consumer-"));
writeFileSync(
  join(consumer, "package.json"),
  JSON.stringify({ private: true, type: "module" }),
);
console.log(
  run(
    "npm",
    [
      "install",
      "--ignore-scripts",
      "--no-audit",
      "--no-fund",
      archive,
      "@types/react@19",
      "@types/react-dom@19",
    ],
    consumer,
  ),
);
writeFileSync(
  join(consumer, "example.tsx"),
  `import {createRef} from 'react';
import {AtelierProvider,DsButton,SectionCard,StatusBadge,createAtelierTheme,tokens,type DsButtonProps,type SectionCardProps,type StatusBadgeProps,type AtelierProviderProps} from '@atelier-ui/react';
const button:DsButtonProps={children:'Créer',ref:createRef<HTMLButtonElement>()};
const card:SectionCardProps={title:'Projet',children:'Contenu',sx:[theme=>({color:theme.palette.text.primary})]};
const status:StatusBadgeProps={status:'active'};
const provider:AtelierProviderProps={mode:'dark',children:<DsButton {...button}/>};
export const screen=<AtelierProvider {...provider}><SectionCard {...card}><StatusBadge {...status}/></SectionCard></AtelierProvider>;
createAtelierTheme('dark');console.log(tokens.colors.primary);`,
);
console.log(
  run(
    process.execPath,
    [
      resolve("node_modules/typescript/bin/tsc"),
      "--noEmit",
      "--strict",
      "--skipLibCheck",
      "--jsx",
      "react-jsx",
      "--module",
      "ESNext",
      "--moduleResolution",
      "bundler",
      "--lib",
      "ES2022,DOM",
      "example.tsx",
    ],
    consumer,
  ),
);
console.log(
  run(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      `import {createRequire} from 'node:module';import{createElement}from'react';import{renderToString}from'react-dom/server';import*as esm from'@atelier-ui/react';const cjs=createRequire(import.meta.url)('@atelier-ui/react');for(const ui of[esm,cjs])for(const mode of['light','dark']){const html=renderToString(createElement(ui.AtelierProvider,{mode},createElement(ui.SectionCard,{title:'Projet'},createElement(ui.DsButton,null,'Créer'),...['active','pending','inactive'].map(status=>createElement(ui.StatusBadge,{status,key:status})))));if(!html.includes('Créer')||!html.includes('En attente')||!html.includes('Inactif'))throw new Error('Rendu incomplet');}console.log('ESM/CJS, types et rendu serveur clair/sombre : OK');`,
    ],
    consumer,
  ),
);
console.log(`Package vérifié : ${archive}`);
