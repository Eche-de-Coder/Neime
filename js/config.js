window.configReady = (async () => {
  const res = await fetch('../api/public-config');
  if (!res.ok) {
    console.error('Failed to load app configuration');
    return;
  }
  const config = await res.json();

  window.FLW_PUBLIC_KEY = config.flutterwavePublicKey;
  window.VERIFICATION_PRICE_NGN = config.verificationPriceNgn;
  window.sb = supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);
})();
