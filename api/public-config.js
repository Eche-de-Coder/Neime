export default function handler(req, res) {
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.status(200).json({
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    flutterwavePublicKey: process.env.FLW_PUBLIC_KEY,
    verificationPriceNgn: Number(process.env.VERIFICATION_PRICE_NGN || 5000)
  });
}
