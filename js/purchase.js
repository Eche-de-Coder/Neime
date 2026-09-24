(function() {
  const modalHTML = `
    <div class="hidden fixed inset-0 z-[70] flex items-center justify-center p-4" id="buy-modal">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" id="buy-modal-backdrop"></div>
      <div class="relative w-full max-w-sm bg-surface-container-low border border-white/10 rounded-xl p-6 shadow-2xl text-center">
        <img class="w-24 h-24 rounded-lg object-cover mx-auto mb-4" id="buy-modal-cover" src="" />
        <h3 class="font-headline-md text-headline-md text-on-surface mb-1" id="buy-modal-title">Song Title</h3>
        <p class="font-body-md text-body-md text-on-surface-variant mb-6" id="buy-modal-artist">Artist</p>
        <p class="font-price-display text-price-display text-primary mb-6" id="buy-modal-price">₦0</p>
        <button class="w-full bg-primary-container text-white font-headline-md text-headline-md !text-[16px] py-3 rounded-full hover:opacity-90 active:scale-95 transition-all mb-3" id="buy-modal-pay-btn" type="button">
          Pay with Paystack
        </button>
        <button class="w-full text-on-surface-variant font-body-md text-body-md py-2" id="buy-modal-cancel-btn" type="button">
          Cancel
        </button>
      </div>
    </div>
  `;
  
  let songBeingBought = null;
  
  document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('buy-modal')) {
      document.body.insertAdjacentHTML('beforeend', modalHTML);
      setupModalControls();
    }
  });
  
  function setupModalControls() {
    document.getElementById('buy-modal-cancel-btn').addEventListener('click', closeBuyModal);
    document.getElementById('buy-modal-backdrop').addEventListener('click', closeBuyModal);
    document.getElementById('buy-modal-pay-btn').addEventListener('click', payForSong);
  }
  
  function closeBuyModal() {
    document.getElementById('buy-modal').classList.add('hidden');
  }
  
  function openBuyModal(song) {
    songBeingBought = song;
    document.getElementById('buy-modal-cover').src = song.cover_url || '';
    document.getElementById('buy-modal-title').textContent = song.title;
    document.getElementById('buy-modal-artist').textContent = song.artist_name;
    document.getElementById('buy-modal-price').textContent = `₦${song.price}`;
    document.getElementById('buy-modal').classList.remove('hidden');
  }
  
  async function extractErrorMessage(error, data) {
    let message = data?.error || error?.message || 'Unknown error';
    if (error?.context) {
      try {
        const text = await error.context.text();
        if (text) {
          try {
            const body = JSON.parse(text);
            if (body?.error) message = body.error;
          } catch (_) {
            message = text;
          }
        }
      } catch (_) {}
    }
    return message;
  }
  
  async function hasPurchased(userId, songId) {
    const { data } = await window.sb
      .from('purchases').select('id').eq('buyer_id', userId).eq('song_id', songId).maybeSingle();
    return !!data;
  }
  
  async function handlePlayClick(song) {
    const { data: { session } } = await window.sb.auth.getSession();
    if (!session) {
      window.location.href = `login.html?redirect=${encodeURIComponent(window.location.href)}`;
      return;
    }
    if (session.user.id === song.artist_id) {
      window.playSong(song);
      return;
    }
    const owned = await hasPurchased(session.user.id, song.id);
    owned ? window.playSong(song) : openBuyModal(song);
  }
  
  async function payForSong() {
    const { data: { session } } = await window.sb.auth.getSession();
    if (!session) {
      window.location.href = `login.html?redirect=${encodeURIComponent(window.location.href)}`;
      return;
    }
    
    const song = songBeingBought;
    const handler = PaystackPop.setup({
      key: window.PAYSTACK_PUBLIC_KEY,
      email: session.user.email,
      amount: Math.round(song.price * 100),
      currency: 'NGN',
      ref: `neime_${song.id}_${Date.now()}`,
      callback: (response) => verifyAndUnlock(response.reference, song, session.user.id),
      onClose: () => {}
    });
    handler.openIframe();
  }
  
  async function verifyAndUnlock(reference, song, buyerId) {
    const { data, error } = await window.sb.functions.invoke('verify-paystack', {
      body: { reference, song_id: song.id, buyer_id: buyerId }
    });
    
    if (error || !data?.success) {
      const message = await extractErrorMessage(error, data);
      alert('Payment verification failed: ' + message);
      return;
    }
    
    closeBuyModal();
    window.playSong(song);
  }
  
  window.Purchase = { handlePlayClick, hasPurchased, openBuyModal };
})();
