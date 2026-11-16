# Lectern MVP (static site, demo mode)

Files: index, pricing, contact, signup, login, checkout, dashboard, speakers, add-speaker, calendar, speaker (.html) + styles.css + app.js.

Deploy: put all files at the root of a GitHub repo -> Cloudflare Pages -> Connect to Git (no build command, output dir blank).

Settings: top of app.js (CONFIG): brand, contactEmail, formEndpoint (Formspree URL), stripeLink (payment link with 7-day trial).

Demo mode: data lives in each browser's localStorage, so speaker links only work in the browser that created them.
Going live = replace LS.get/LS.set with Supabase calls and add a Cloudflare Worker cron for emails.
