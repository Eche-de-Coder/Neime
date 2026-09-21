// api/track.js
export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    res.status(400).send('Missing track code');
    return;
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

  const query = `${SUPABASE_URL}/rest/v1/songs?share_code=eq.${code}&select=title,artist_name,feature,price,cover_url`;

  const sbRes = await fetch(query, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });

  const data = await sbRes.json();
  const song = data?.[0];

  if (!song) {
    res.status(404).send('Track not found');
    return;
  }

  const artistLine = song.feature ? `${song.artist_name} ft. ${song.feature}` : song.artist_name;
  const title = `${song.title} — ${artistLine} | Neime`;
  const description = `Listen to "${song.title}" by ${artistLine} on Neime. ₦${Number(song.price).toLocaleString()}.`;
  const image = song.cover_url || `https://${req.headers.host}/images/default-cover.png`;
  const pageUrl = `https://${req.headers.host}/${code}`;
  const redirectUrl = `/share/?code=${code}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escHtml(title)}</title>

  <!-- Open Graph (Facebook, WhatsApp, LinkedIn) -->
  <meta property="og:type" content="music.song" />
  <meta property="og:title" content="${escHtml(title)}" />
  <meta property="og:description" content="${escHtml(description)}" />
  <meta property="og:image" content="${escHtml(image)}" />
  <meta property="og:url" content="${escHtml(pageUrl)}" />
  <meta property="og:site_name" content="Neime" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escHtml(title)}" />
  <meta name="twitter:description" content="${escHtml(description)}" />
  <meta name="twitter:image" content="${escHtml(image)}" />

  <!-- Redirect real visitors (not crawlers) to the actual interactive page -->
  <meta http-equiv="refresh" content="0; url=${redirectUrl}" />
  <script>window.location.replace('${redirectUrl}');</script>
</head>
<body>
  <p>Redirecting to <a href="${redirectUrl}">${escHtml(song.title)}</a>…</p>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
}

function escHtml(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
