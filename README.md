# LBA Factory, site vitrine

Page d'accueil one-page (FR, EN et AR à venir), issue de la maquette Claude Design.
Astro 7 en sortie statique ; seule la route `/api/contact` tourne côté serveur (fonction Vercel).

## Démarrer

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # vérification des types (astro check) puis build
```

Node 22 ou plus.

## Structure

- `src/pages/index.astro` : la page (balisage repris de la maquette).
- `src/styles/global.css` : jetons de couleur, typographie, mises en page, responsive.
- `src/scripts/main.js` : état de l'interface (sliders, menu, langues, formulaire) et motion (GSAP, ScrollTrigger, SplitText, Lenis).
- `src/pages/api/contact.ts` : réception du formulaire, contrôles, envoi via l'API Brevo.
- `public/media/` : photos (WebP 1600 et 800 px), vidéo du logo, grain, logo.

## Déploiement sur Vercel

1. Vercel > Add New > Project > importer ce dépôt GitHub. Le framework Astro est détecté, rien à régler.
2. Settings > Environment Variables : `BREVO_API_KEY`, `CONTACT_TO`, `CONTACT_FROM` (voir `.env.example`).
3. Chaque push crée une adresse d'aperçu ; la branche `main` part en production.
4. Domaine : Settings > Domains, puis l'enregistrement DNS indiqué par Vercel.

Formule Hobby : usage personnel et non commercial uniquement ; pour le site de l'agence, prévoir la formule Pro (à vérifier).
Hébergement souverain (OVHcloud) à étudier pour la production : seul `/api/contact` est à porter (script PHP ou fonction équivalente).

## Formulaire

- Champ piège `site_web` et limite de 5 envois par 10 minutes et par adresse IP.
- Fonctionne aussi sans JavaScript (redirection vers `/?envoi=ok#contact`).
- Expéditeur sur un domaine vérifié dans Brevo (SPF, DKIM, DMARC) pour éviter les spams.
- Notice d'information sous le formulaire et mention CNDP (loi 09-08) à reprendre du site actuel, à valider avec le référent données.

## Avant la mise en ligne publique

- Remplacer les « à fournir » : année, adresse, e-mail, téléphone, mention CNDP, visuels des références.
- Photos provisoires à remplacer par celles de l'équipe (droits d'usage).
- Versions EN et AR (`/en`, `/ar`, `dir="rtl"`), balises `hreflang`, mentions légales.
- `public/robots.txt` bloque l'indexation : à ouvrir au lancement, et renseigner `site` dans `astro.config.mjs`.
