(function() {
  const modalHTML = `
  <div class="hidden fixed inset-0 z-[70] flex items-center justify-center p-4" id="buy-modal">
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" id="buy-modal-backdrop"></div>
    <div class="relative w-full max-w-sm bg-surface-container-low border border-white/10 rounded-xl p-6 shadow-2xl text-center">
      <img class="w-24 h-24 rounded-lg object-cover mx-auto mb-4" id="buy-modal-cover" src="" />
      <h3 class="font-headline-md text-headline-md text-on-surface mb-1" id="buy-modal-title">Song Title</h3>
      <p class="font-body-md text-body-md text-on-surface-variant mb-4" id="buy-modal-artist">Artist</p>

      <div class="hidden w-full px-4 py-3 rounded-2xl bg-surface-container-high/60 border border-white/5 mb-4 flex items-center gap-3" id="buy-modal-preview-wrap">
        <button class="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-white shrink-0 shadow-sm active:scale-95 transition-transform hover:brightness-110" id="buy-modal-preview-btn" type="button">
          <span class="material-symbols-outlined text-lg leading-none" id="buy-modal-preview-icon" style="font-variation-settings: 'FILL' 1;">play_arrow</span>
        </button>
        <div class="flex-1 flex items-center gap-1 h-5" id="buy-modal-waveform">
          <span class="w-1 h-2 bg-surface-variant rounded-full"></span>
          <span class="w-1 h-4 bg-surface-variant rounded-full"></span>
          <span class="w-1 h-3 bg-surface-variant rounded-full"></span>
          <span class="w-1 h-5 bg-surface-variant rounded-full"></span>
          <span class="w-1 h-5 bg-surface-variant rounded-full"></span>
          <span class="w-1 h-2.5 bg-surface-variant rounded-full"></span>
          <span class="w-1 h-3.5 bg-surface-variant rounded-full"></span>
          <span class="w-1 h-4 bg-surface-variant rounded-full"></span>
          <span class="w-1 h-2.5 bg-surface-variant rounded-full"></span>
          <span class="w-1 h-3.5 bg-surface-variant rounded-full"></span>
        </div>
        <div class="flex items-center gap-1 font-label-sm text-xs text-on-surface-variant shrink-0">
          <span id="buy-modal-preview-time">0:00</span><span>/</span><span id="buy-modal-preview-total">0:30</span>
        </div>
      </div>

      <p class="font-price-display text-price-display text-primary mb-6" id="buy-modal-price">₦0</p>
      <button class="w-full bg-primary-container text-white font-headline-md text-headline-md !text-[16px] py-3 rounded-full hover:opacity-90 active:scale-95 transition-all mb-3" id="buy-modal-pay-btn" type="button">
        Pay with Flutterwave
      </button>
      <button class="w-full text-on-surface-variant font-body-md text-body-md py-2" id="buy-modal-cancel-btn" type="button">
        Cancel
      </button>
    </div>
  </div>
`;
  
  const previewStyle = `
  @keyframes bar-pulse { 0%, 100% { transform: scaleY(0.4); } 50% { transform: scaleY(1); } }
  .bar-playing { animation: bar-pulse 0.9s ease-in-out infinite; }
  .bar-playing:nth-child(2n) { animation-delay: 0.15s; }
  .bar-playing:nth-child(3n) { animation-delay: 0.3s; }
`;
  
  let songBeingBought = null;
  const previewAudio = new Audio();
  
  function formatTime(s) {
    if (!isFinite(s)) return '0:00';
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('buy-modal')) {
      document.body.insertAdjacentHTML('beforeend', modalHTML);
      setupModalControls();
    }
  });
  document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('buy-modal')) {
      document.head.insertAdjacentHTML('beforeend', `<style>${previewStyle}</style>`);
      document.body.insertAdjacentHTML('beforeend', modalHTML);
      setupModalControls();
    }
  });
  
  function setupModalControls() {
    document.getElementById('buy-modal-cancel-btn').addEventListener('click', closeBuyModal);
    document.getElementById('buy-modal-backdrop').addEventListener('click', closeBuyModal);
    document.getElementById('buy-modal-pay-btn').addEventListener('click', payForSong);
    
    document.getElementById('buy-modal-preview-btn').addEventListener('click', () => {
      previewAudio.paused ? previewAudio.play() : previewAudio.pause();
    });
    previewAudio.addEventListener('play', () => {
      document.getElementById('buy-modal-preview-icon').textContent = 'pause';
      document.querySelectorAll('#buy-modal-waveform span').forEach(bar => {
        bar.classList.add('bar-playing', 'bg-primary-container');
        bar.classList.remove('bg-surface-variant');
      });
    });
    previewAudio.addEventListener('pause', () => {
      document.getElementById('buy-modal-preview-icon').textContent = 'play_arrow';
      document.querySelectorAll('#buy-modal-waveform span').forEach(bar => {
        bar.classList.remove('bar-playing', 'bg-primary-container');
        bar.classList.add('bg-surface-variant');
      });
    });
    previewAudio.addEventListener('timeupdate', () => {
      document.getElementById('buy-modal-preview-time').textContent = formatTime(previewAudio.currentTime);
    });
    previewAudio.addEventListener('loadedmetadata', () => {
      document.getElementById('buy-modal-preview-total').textContent = formatTime(previewAudio.duration);
    });
    previewAudio.addEventListener('ended', () => { previewAudio.currentTime = 0; });
  }
  
  function closeBuyModal() {
    previewAudio.pause();
    document.getElementById('buy-modal').classList.add('hidden');
  }
  
  function openBuyModal(song) {
    songBeingBought = song;
    previewAudio.pause();
    previewAudio.currentTime = 0;
    
    document.getElementById('buy-modal-cover').src = song.cover_url || '';
    document.getElementById('buy-modal-title').textContent = song.title;
    document.getElementById('buy-modal-artist').textContent = song.artist_name;
    document.getElementById('buy-modal-price').textContent = `₦${song.price}`;
    
    const previewWrap = document.getElementById('buy-modal-preview-wrap');
    if (song.preview_url) {
      previewAudio.src = song.preview_url;
      previewWrap.classList.remove('hidden');
    } else {
      previewAudio.removeAttribute('src');
      previewWrap.classList.add('hidden');
    }
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
      window.location.href = `../login?redirect=${encodeURIComponent(window.location.href)}`;
      return;
    }
    if (session.user.id === song.artist_id) {
      window.playSong(song);
      return;
    }
    const owned = await hasPurchased(session.user.id, song.id);
    owned ? window.playSong(song) : openBuyModal(song);
  }
  
  /**async function payForSong() {
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
  **/
  window.Purchase = { handlePlayClick, hasPurchased, openBuyModal };
  
  
  async function payForSong() {
    previewAudio.pause();
    const { data: { session } } = await window.sb.auth.getSession();
    if (!session) {
      window.location.href = `../login?redirect=${encodeURIComponent(window.location.href)}`;
      return;
    }
    
    const song = songBeingBought;
    const txRef = `neime_${song.id}_${Date.now()}`;
    
    FlutterwaveCheckout({
      public_key: window.FLW_PUBLIC_KEY,
      tx_ref: txRef,
      amount: song.price,
      currency: 'NGN',
      payment_options: 'card,ussd,banktransfer',
      customer: { email: session.user.email },
      customizations: { title: 'Neime', description: song.title },
      callback: (response) => verifyAndUnlock(response.transaction_id, txRef, song, session.user.id),
      onclose: () => {}
    });
  }
  
  async function verifyAndUnlock(transactionId, txRef, song, buyerId) {
    const { data, error } = await window.sb.functions.invoke('verify-payment', {
      body: { transaction_id: transactionId, tx_ref: txRef, song_id: song.id, buyer_id: buyerId }
    });
    
    if (error || !data?.success) {
      const message = await extractErrorMessage(error, data);
      alert('Payment verification failed: ' + message);
      return;
    }
    
    closeBuyModal();
    window.playSong(song);
  }
})();
