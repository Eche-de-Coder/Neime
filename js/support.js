(function() {
  const ARTIST_SHARE_PERCENT = 85;
  
  const modalHTML = `
    <div aria-labelledby="modal-headline" aria-modal="true" class="hidden fixed inset-0 z-[75] flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto" id="support-artist-modal" role="dialog">
      <div class="relative w-full max-w-lg bg-surface-container-low border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col gap-6 text-on-surface my-auto">
        <div class="flex items-start justify-between gap-4 border-b border-white/5 pb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-primary-container/20 border border-primary/30 flex items-center justify-center text-primary flex-shrink-0 shadow-[0_0_14px_rgba(255,92,0,0.25)]">
              <span class="material-symbols-outlined text-2xl" style="font-variation-settings: 'FILL' 1;">volunteer_activism</span>
            </div>
            <div>
              <h3 class="font-headline-md text-xl md:text-2xl font-bold text-white tracking-tight" id="support-modal-artist-name">Support Artist</h3>
              <p class="font-body-md text-xs sm:text-sm text-on-surface-variant mt-0.5">Directly back the artist with a tip</p>
            </div>
          </div>
          <button aria-label="Close dialog" class="text-on-surface-variant hover:text-white hover:bg-surface-container-high transition-colors p-2 rounded-full flex items-center justify-center" id="support-modal-close" type="button">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div class="flex flex-col gap-3">
          <label class="font-headline-md text-xs uppercase tracking-wider font-semibold text-on-surface-variant">Select Amount</label>
          <div class="grid grid-cols-3 gap-2.5" id="support-preset-grid">
            <button class="support-preset py-2 px-3 rounded-xl border border-white/10 bg-surface-container hover:border-primary/40 text-on-surface font-price-display text-sm font-bold transition-all text-center" data-amount="500" type="button">₦500</button>
            <button class="support-preset py-2 px-3 rounded-xl border border-white/10 bg-surface-container hover:border-primary/40 text-on-surface font-price-display text-sm font-bold transition-all text-center" data-amount="1000" type="button">₦1,000</button>
            <button class="support-preset py-2 px-3 rounded-xl border border-white/10 bg-surface-container hover:border-primary/40 text-on-surface font-price-display text-sm font-bold transition-all text-center" data-amount="2500" type="button">₦2,500</button>
            <button class="support-preset py-2 px-3 rounded-xl border border-white/10 bg-surface-container hover:border-primary/40 text-on-surface font-price-display text-sm font-bold transition-all text-center" data-amount="5000" type="button">₦5,000</button>
            <button class="support-preset py-2 px-3 rounded-xl border border-white/10 bg-surface-container hover:border-primary/40 text-on-surface font-price-display text-sm font-bold transition-all text-center" data-amount="10000" type="button">₦10,000</button>
            <button class="support-preset py-2 px-3 rounded-xl border border-white/10 bg-surface-container hover:border-primary/40 text-on-surface font-price-display text-sm font-bold transition-all text-center" data-amount="25000" type="button">₦25,000</button>
          </div>
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="font-headline-md text-xs uppercase tracking-wider font-semibold text-on-surface-variant" for="custom-support-amt">Or Custom Amount</label>
          <div class="relative flex items-center">
            <span class="absolute left-3.5 text-base font-bold text-primary font-price-display pointer-events-none">₦</span>
            <input class="w-full bg-surface-container-lowest border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm font-price-display text-white focus:outline-none focus:ring-0 focus:border-primary placeholder:text-on-surface-variant/50" id="custom-support-amt" min="100" placeholder="2,500" type="number" />
          </div>
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="font-headline-md text-xs uppercase tracking-wider font-semibold text-on-surface-variant flex items-center justify-between" for="support-note">
            <span>Leave a note for the artist</span>
            <span class="text-[11px] font-label-sm text-on-surface-variant/60">Optional</span>
          </label>
          <textarea class="w-full bg-surface-container-lowest border border-white/10 rounded-xl p-3 text-xs sm:text-sm font-body-md text-white focus:outline-none focus:ring-0 focus:border-primary placeholder:text-on-surface-variant/50 resize-none" id="support-note" maxlength="280" rows="2"></textarea>
        </div>

        <div class="flex flex-col gap-2 bg-surface-container-lowest/80 p-3.5 rounded-xl border border-white/5">
          <div class="flex items-center justify-between text-[11px] font-label-sm text-on-surface-variant">
            <span>Creator Payout: <strong class="text-emerald-400 font-semibold" id="support-payout-label">${ARTIST_SHARE_PERCENT}%</strong></span>
            <span class="flex items-center gap-1"><span class="material-symbols-outlined text-xs text-primary">verified_user</span> Secure checkout via Flutterwave</span>
          </div>
        </div>

        <div class="hidden rounded-lg px-4 py-3 font-body-md text-sm" id="support-status-banner" role="alert"></div>

        <div class="flex items-center gap-3 pt-1">
          <button class="w-1/3 py-3 px-4 rounded-full border border-white/10 bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-white font-headline-md font-semibold text-xs sm:text-sm transition-all text-center" id="support-cancel-btn" type="button">Cancel</button>
          <button class="flex-1 py-3 px-5 rounded-full bg-primary-container hover:bg-orange-500 text-on-primary-container font-headline-md font-bold text-xs sm:text-sm shadow-[0_0_24px_rgba(255,92,0,0.5)] flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60" id="support-send-btn" type="button">
            <span id="support-send-label">Send ₦0 Support</span>
            <span class="material-symbols-outlined text-base">favorite</span>
          </button>
        </div>
      </div>
    </div>
  `;
  
  let activeArtistId = null;
  let activeArtistName = '';
  let selectedAmount = 2500;
  
  document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('support-artist-modal')) {
      document.body.insertAdjacentHTML('beforeend', modalHTML);
      setupControls();
    }
  });
  
  function setupControls() {
    document.getElementById('support-modal-close').addEventListener('click', closeModal);
    document.getElementById('support-cancel-btn').addEventListener('click', closeModal);
    
    document.querySelectorAll('.support-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedAmount = parseInt(btn.dataset.amount, 10);
        document.getElementById('custom-support-amt').value = '';
        highlightPreset(btn);
        updateSendLabel();
      });
    });
    
    document.getElementById('custom-support-amt').addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      selectedAmount = val > 0 ? val : 0;
      highlightPreset(null);
      updateSendLabel();
    });
    
    document.getElementById('support-send-btn').addEventListener('click', sendSupport);
  }
  
  function highlightPreset(activeBtn) {
    document.querySelectorAll('.support-preset').forEach(b => {
      const isActive = b === activeBtn;
      b.classList.toggle('border-2', isActive);
      b.classList.toggle('border-primary-container', isActive);
      b.classList.toggle('bg-primary-container/10', isActive);
      b.classList.toggle('text-primary', isActive);
      b.classList.toggle('shadow-[0_0_12px_rgba(255,92,0,0.3)]', isActive);
      b.classList.toggle('border', !isActive);
      b.classList.toggle('border-white/10', !isActive);
      b.classList.toggle('bg-surface-container', !isActive);
      b.classList.toggle('text-on-surface', !isActive);
    });
  }
  
  function updateSendLabel() {
    document.getElementById('support-send-label').textContent = `Send ₦${(selectedAmount || 0).toLocaleString()} Support`;
  }
  
  function closeModal() {
    document.getElementById('support-artist-modal').classList.add('hidden');
    document.getElementById('support-status-banner').classList.add('hidden');
  }
  
  function showStatus(message, isError) {
    const banner = document.getElementById('support-status-banner');
    banner.textContent = message;
    banner.classList.remove('hidden', 'bg-error-container', 'text-on-error-container', 'bg-secondary-container/20', 'text-secondary');
    banner.classList.add(isError ? 'bg-error-container' : 'bg-secondary-container/20', isError ? 'text-on-error-container' : 'text-secondary');
  }
  
  async function sendSupport() {
    if (!selectedAmount || selectedAmount < 100) {
      showStatus('Enter an amount of at least ₦100.', true);
      return;
    }
    
    const { data: { session } } = await window.sb.auth.getSession();
    if (!session) {
      window.location.href = `../loginredirect=${encodeURIComponent(window.location.href)}`;
      return;
    }
    
    const btn = document.getElementById('support-send-btn');
    btn.disabled = true;
    const note = document.getElementById('support-note').value.trim();
    const txRef = `neime_tip_${activeArtistId}_${Date.now()}`;
    
    FlutterwaveCheckout({
      public_key: window.FLW_PUBLIC_KEY,
      tx_ref: txRef,
      amount: selectedAmount,
      currency: 'NGN',
      payment_options: 'card,ussd,banktransfer',
      customer: { email: session.user.email },
      customizations: { title: 'Neime', description: `Support for ${activeArtistName}` },
      callback: async (response) => {
        const { data, error } = await window.sb.functions.invoke('verify-tip', {
          body: {
            transaction_id: response.transaction_id,
            tx_ref: txRef,
            artist_id: activeArtistId,
            supporter_id: session.user.id,
            note
          }
        });
        btn.disabled = false;
        if (error || !data?.success) {
          showStatus('Payment verification failed: ' + (error?.message || data?.error || 'Unknown error'), true);
          return;
        }
        showStatus(`Thank you for supporting ${activeArtistName}!`, false);
        setTimeout(closeModal, 1500);
      },
      onclose: () => { btn.disabled = false; }
    });
  }
  
  window.Support = {
    open(artistId, artistName) {
      activeArtistId = artistId;
      activeArtistName = artistName || 'this artist';
      selectedAmount = 2500;
      document.getElementById('support-modal-artist-name').textContent = `Support ${activeArtistName}`;
      document.getElementById('custom-support-amt').value = '';
      document.getElementById('support-note').value = '';
      document.getElementById('support-status-banner').classList.add('hidden');
      updateSendLabel();
      highlightPreset(document.querySelector('.support-preset[data-amount="2500"]'));
      document.getElementById('support-artist-modal').classList.remove('hidden');
    }
  };
})();
