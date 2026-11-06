# Deployment Guide (Vercel)

The site is a static Vite build, so any static host works. Vercel is used because it deploys every
merge to `main` automatically and gives each pull request its own preview link.

## 1. Connect the repository (one time, about a minute)

1. Open **https://vercel.com/new** and sign in with GitHub.
2. Under **Import Git Repository**, click **Import** next to **MuzraFatima/portfolio**.
   If it is not listed, click **Adjust GitHub App Permissions** and allow access to the `portfolio` repository.
3. Vercel reads `vercel.json`, so leave the detected settings as they are:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Production Branch: `main` (Settings → Git, after import)
4. Click **Deploy**. When it finishes, the public URL looks like `https://portfolio-xxxx.vercel.app`.

From then on: **every merge into `main` updates the live site**, and every pull request gets a preview URL in its checks.

## 2. Turn on the contact form

1. Go to **https://web3forms.com**, enter `muzrafatima@gmail.com` and click **Create Access Key**. The key arrives by email.
2. In Vercel: **Project → Settings → Environment Variables → Add**
   - Key: `VITE_WEB3FORMS_KEY`
   - Value: the access key
   - Environments: Production and Preview
3. **Deployments → ⋯ on the latest → Redeploy.** The form now delivers messages to your inbox.

Until this is done the form explains that it is not connected and offers the email address instead.

## 3. Optional: custom domain

**Project → Settings → Domains → Add**, enter the domain and follow Vercel's DNS instructions.

## 4. After each deployment, check

- The page opens with the About panel and astronaut.
- Every top-menu region opens, and each of the six planets opens its panel.
- GitHub, LinkedIn, repository and the JOCKY live-demo links open.
- On a phone: the menu works, panels scroll, and Settings → Text-only view shows everything.
- Browser console shows no errors.

## Production configuration

| Item                                                      | Where                                                                     |
| --------------------------------------------------------- | ------------------------------------------------------------------------- |
| Build settings, SPA rewrite, caching and security headers | `vercel.json`                                                             |
| Environment variables                                     | Vercel project settings (template in `.env.example`; never commit `.env`) |
| CI (format, lint, typecheck, unit tests, build)           | `.github/workflows/ci.yml` — must pass before merging                     |
