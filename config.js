// Put your own values here. This is the ONLY file you edit with keys, app.js never needs touching.
window.LECTERN_CONFIG = {
  supabaseUrl: '',   // Supabase > Project Settings > API > Project URL
  supabaseKey: '',   // the publishable (anon) key, never the secret key
  workerUrl: '',     // your Cloudflare Worker URL (later)
  contactEmail: 'hello@yourdomain.com',
  formEndpoint: '',  // optional Formspree URL so Contact/Help messages reach your inbox
  stripeLink: '',    // payment link (later)
  billingPortalUrl: '', // your payment provider's customer portal link, so users can cancel (later)
  enforcePaywall: false // false = trials never expire (testing). true = expired trials must subscribe
};
