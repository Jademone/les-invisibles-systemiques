# Guide de déploiement : GitHub Pages

Ton site est sur GitHub Pages. Un push sur `main` et c'est en ligne en 1 à 2 minutes.

## Les 3 chemins selon ton confort

### CHEMIN A : Interface web GitHub (zéro commande)

Le plus safe, tu fais tout dans le navigateur.

1. **Dézippe** `site-lesinvisibles-v2.zip` sur ton bureau. Tu obtiens un dossier `site/`.
2. Va sur ton repo GitHub (probablement `github.com/tonpseudo/lesinvisiblessystemiques.fr` ou un nom similaire).
3. **Crée une branche de test** pour ne pas casser la prod :
   - Clique sur le sélecteur de branche (là où c'est écrit `main`)
   - Tape `refonte-avril-2026`
   - Clique sur "Create branch: refonte-avril-2026 from main"
4. Sur cette branche, **supprime les anciens fichiers HTML** un par un (index.html, a-propos.html, etc.) : clique sur le fichier → icône poubelle → commit.
5. **Uploade les nouveaux fichiers** :
   - "Add file" → "Upload files"
   - Glisse tout le contenu du dossier `site/` dézippé (y compris le sous-dossier `articles/`)
   - Commit avec un message clair : `Refonte design : favicons, hero, responsive, fix nav`
6. **Vérifie la preview** en allant voir l'historique de déploiement :
   - Onglet "Actions" du repo : tu verras le workflow GitHub Pages tourner
   - Une fois vert, la branche est déployée... mais seulement si tu as configuré un déploiement par branche. Sinon, passe directement à l'étape 7.
7. **Merge sur main** quand tu es prête :
   - Onglet "Pull requests" → "New pull request"
   - Base : `main`, compare : `refonte-avril-2026`
   - "Create pull request" → "Merge"
8. GitHub Pages redéploie automatiquement. Compte 1 à 2 minutes.

### CHEMIN B : GitHub Desktop

Si tu as l'appli GitHub Desktop installée.

1. Ouvre GitHub Desktop, sélectionne ton repo
2. Branch → New branch → `refonte-avril-2026`
3. Ouvre le dossier local du repo dans le Finder/Explorateur
4. **Supprime les anciens fichiers HTML** à remplacer (sauf `.git`, `.github/`, `README.md`, `CNAME`, `.gitignore`)
5. Copie-colle le contenu de `site/` dézippé dans le dossier du repo
6. Dans GitHub Desktop, commit avec un message clair, puis "Push origin"
7. Ouvre le repo sur github.com, crée la PR, merge sur main

### CHEMIN C : terminal

```bash
cd ~/chemin/vers/ton/repo
git checkout main
git pull
git checkout -b refonte-avril-2026

# Optionnel : nettoyer les anciens HTML avant de copier (à adapter selon ton repo)
# rm index.html a-propos.html contact.html ...

# Copie les fichiers depuis le zip dézippé
cp -r /chemin/vers/site/* .

git add .
git commit -m "Refonte design : favicons, hero, responsive, fix nav"
git push origin refonte-avril-2026
```

Puis PR + merge sur GitHub.

## Structure à respecter

À la racine du repo :

```
/
├── CNAME                   ← NE PAS TOUCHER (mapping vers ton domaine)
├── .github/                ← NE PAS TOUCHER (workflows GitHub)
├── .gitignore              ← NE PAS TOUCHER
├── README.md               ← garder le tien
├── index.html              ← page d'accueil refaite
├── a-propos.html
├── contact.html
├── mentions-legales.html   ← MÀJ : Netlify → GitHub Pages
├── confidentialite.html    ← MÀJ : Netlify → GitHub Pages
├── sitemap.xml
├── llms.txt
├── favicon.ico             ← NOUVEAU, critique pour Google
├── favicon.svg
├── favicon-16x16.png       ← NOUVEAUX
├── favicon-32x32.png
├── favicon-48x48.png
├── favicon-180x180.png
├── favicon-192x192.png
├── favicon-512x512.png
├── apple-touch-icon.png
├── site.webmanifest        ← NOUVEAU (PWA)
└── articles/
    ├── index.html          ← renommé depuis articles-index.html
    ├── outre-mer-revele-de-nous.html
    ├── femmes-dirigent-soins-pas-hopitaux.html
    ├── rgpd-ehpad-encore-a-naitre.html
    ├── confiance-systeme-remplace-comprehension.html
    ├── deserts-medicaux-metropole-outre-mer.html
    ├── chatgpt-deja-dans-vos-equipes.html
    ├── invisibles-font-tourner-etablissements.html
    └── patient-sort-ehpad-systeme-ne-suit-pas.html
```

## Fichiers GitHub à NE PAS écraser

- `CNAME` : ce fichier d'UNE SEULE LIGNE contient ton domaine (`lesinvisiblessystemiques.fr` ou `www.lesinvisiblessystemiques.fr`). Sans lui, ton domaine custom ne pointe plus vers le site.
- `.github/` : dossier des workflows (actions GitHub, déploiements)
- `.nojekyll` (s'il existe) : désactive Jekyll, à garder
- `.gitignore`, `README.md`, `LICENSE`

## Articles manquants

Tes 5 autres articles (`decrets-infirmiers-2001-2025`, `danger-machine-soi-meme`, `pourquoi-gps-ment`, `pourquoi-ce-blog-existe`, `piloter-esante-recrute-expert-mauvais-sujet`) ne m'ont pas été fournis. Ils sont probablement affectés par le même bug `</nav>` manquant. Envoie-les moi et je te les corrige en 2 minutes avec le même script.

## Après le merge sur main : vérifier que ça déploie

1. Onglet **Actions** du repo : tu verras un workflow "pages build and deployment" tourner
2. Une fois vert, va sur ton site en navigation privée (pour contourner le cache)
3. Si rien ne change : vérifie dans Settings → Pages que la branche source est bien `main` et que le dossier est `/ (root)`

## Forcer Google à re-crawler le favicon

1. Connecte-toi à **Google Search Console** : https://search.google.com/search-console
2. Outil d'inspection d'URL → saisis `https://www.lesinvisiblessystemiques.fr/`
3. "Demander une indexation"
4. Répète pour `https://www.lesinvisiblessystemiques.fr/sitemap.xml`
5. Le favicon met 2 à 7 jours à apparaître dans les résultats Google. Patience.

## Tester en local avant de pusher

Tu peux ouvrir `index.html` directement dans Chrome (drag & drop) pour voir le rendu. Ou mieux, avec Python :

```bash
cd /chemin/vers/site
python3 -m http.server 8000
# puis ouvre http://localhost:8000 dans ton navigateur
```

Tu testes tout, tu vérifies la navigation entre pages, le responsive (F12 → icône mobile), puis tu pushes.
