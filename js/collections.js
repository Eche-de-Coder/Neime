(function() {
  const modalHTML = `
    <div class="hidden fixed inset-0 z-[65] flex items-center justify-center p-4" id="col-modal">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" id="col-modal-backdrop"></div>
      <div class="relative w-full max-w-md bg-surface-container-low border border-white/10 rounded-xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3 min-w-0">
            <img class="w-14 h-14 rounded-lg object-cover shrink-0" id="col-modal-cover" src="" />
            <div class="min-w-0">
              <h3 class="font-headline-md text-headline-md text-on-surface truncate" id="col-modal-title">Title</h3>
              <p class="font-label-sm text-label-sm text-on-surface-variant uppercase" id="col-modal-type">Album</p>
            </div>
          </div>
          <button class="text-on-surface-variant hover:text-on-surface transition-colors shrink-0" id="col-modal-close" type="button">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <button class="w-full bg-primary-container text-white font-headline-md text-headline-md !text-[15px] py-3 rounded-full hover:opacity-90 active:scale-95 transition-all mb-4 disabled:opacity-60" id="col-buy-btn" type="button">
          <span id="col-buy-label">Buy Album</span>
        </button>

        <div class="flex flex-col gap-1" id="col-song-list"></div>
      </div>
    </div>
  `;
  
  document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('col-modal')) {
      document.body.insertAdjacentHTML('beforeend', modalHTML);
      setupModalControls();
    }
  });
  
  let activeCollection = null;
  let activeCollectionSongs = [];
  let activeOwnedIds = new Set();
  
  function setupModalControls() {
    document.getElementById('col-modal-close').addEventListener('click', closeModal);
    document.getElementById('col-modal-backdrop').addEventListener('click', closeModal);
    document.getElementById('col-buy-btn').addEventListener('click', buyCollection);
  }
  
  function closeModal() {
    document.getElementById('col-modal').classList.add('hidden');
  }
  
  function cardHTML(col) {
    const count = col.songs?.[0]?.count || 0;
    const limit = col.type === 'album' ? 20 : 10;
    return `
      <div class="glass-panel rounded-xl p-3 flex flex-col gap-2 cursor-pointer group hover:bg-surface-container-high/40 transition-colors" data-collection-id="${col.id}">
        <div class="relative aspect-square rounded-lg overflow-hidden bg-surface-container-high">
          <img alt="${col.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src="${col.cover_url || ''}" />
          <span class="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 text-[10px] font-label-sm uppercase tracking-wider text-white">${col.type}</span>
        </div>
        <div class="min-w-0">
          <h4 class="font-body-lg text-body-lg text-on-surface truncate">${col.title}</h4>
          <p class="font-label-sm text-label-sm text-on-surface-variant">${count}/${limit} tracks</p>
        </div>
      </div>
    `;
  }
  
  async function fetchCollections({ artistId, searchQuery, purchasedOnly } = {}) {
    let query = window.sb.from('collections').select('*, songs(count)');
    if (artistId) query = query.eq('artist_id', artistId);
    if (searchQuery) query = query.ilike('title', `%${searchQuery}%`);
    
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) { console.warn(error.message); return []; }
    let collections = data || [];
    
    if (purchasedOnly) {
      const { data: { session } } = await window.sb.auth.getSession();
      if (!session) return [];
      const { data: ownedRows } = await window.sb.rpc('get_my_fully_owned_collections');
      const ownedIds = new Set((ownedRows || []).map(r => r.collection_id));
      collections = collections.filter(c => ownedIds.has(c.id));
    }
    
    return collections;
  }
  
  async function renderInto(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return [];
    
    const collections = await fetchCollections(options);
    container.innerHTML = collections.map(cardHTML).join('');
    
    container.querySelectorAll('[data-collection-id]').forEach(card => {
      card.addEventListener('click', () => openModal(card.dataset.collectionId));
    });
    
    return collections;
  }
  
  async function openModal(collectionId) {
    const { data: collection } = await window.sb.from('collections').select('*').eq('id', collectionId).single();
    if (!collection) return;
    
    const { data: songs } = await window.sb.from('songs').select('*').eq('collection_id', collectionId).order('created_at', { ascending: true });
    activeCollection = collection;
    activeCollectionSongs = songs || [];
    
    document.getElementById('col-modal-cover').src = collection.cover_url || '';
    document.getElementById('col-modal-title').textContent = collection.title;
    document.getElementById('col-modal-type').textContent = collection.type;
    
    const { data: { session } } = await window.sb.auth.getSession();
    activeOwnedIds = new Set();
    if (session) {
      const { data: owned } = await window.sb.from('purchases').select('song_id').eq('buyer_id', session.user.id).in('song_id', activeCollectionSongs.map(s => s.id));
      activeOwnedIds = new Set((owned || []).map(o => o.song_id));
    }
    
    renderSongList();
    updateBuyButton();
    
    document.getElementById('col-modal').classList.remove('hidden');
  }
  
  function renderSongList() {
    const list = document.getElementById('col-song-list');
    list.innerHTML = activeCollectionSongs.map(song => {
      const owned = activeOwnedIds.has(song.id);
      return `
        <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-container-high/50 transition-colors cursor-pointer col-song-row" data-song-id="${song.id}">
          <span class="material-symbols-outlined text-primary text-[20px]">${owned ? 'play_circle' : 'lock'}</span>
          <div class="flex-1 min-w-0">
            <p class="font-body-md text-body-md text-on-surface truncate">${song.title}${song.feature ? ` ft. ${song.feature}` : ''}</p>
          </div>
          <span class="font-label-sm text-label-sm text-on-surface-variant">${owned ? 'Owned' : `₦${song.price}`}</span>
        </div>
      `;
    }).join('');
    
    list.querySelectorAll('.col-song-row').forEach(row => {
      row.addEventListener('click', () => {
        const song = activeCollectionSongs.find(s => s.id === row.dataset.songId);
        if (activeOwnedIds.has(song.id)) {
          window.playSong(song, activeCollectionSongs);
        }
      });
    });
  }
  
  function updateBuyButton() {
    const btn = document.getElementById('col-buy-btn');
    const label = document.getElementById('col-buy-label');
    const unowned = activeCollectionSongs.filter(s => !activeOwnedIds.has(s.id));
    
    if (unowned.length === 0) {
      btn.classList.add('hidden');
      return;
    }
    btn.classList.remove('hidden');
    btn.disabled = false;
    const total = unowned.reduce((sum, s) => sum + Number(s.price), 0);
    label.textContent = `Buy ${unowned.length === activeCollectionSongs.length ? activeCollection.type : 'Remaining Tracks'} — ₦${total}`;
  }
  
  async function buyCollection() {
    const { data: { session } } = await window.sb.auth.getSession();
    if (!session) {
      window.location.href = `../login?redirect=${encodeURIComponent(window.location.href)}`;
      return;
    }
    
    const unowned = activeCollectionSongs.filter(s => !activeOwnedIds.has(s.id));
    if (!unowned.length) return;
    
    const total = unowned.reduce((sum, s) => sum + Number(s.price), 0);
    const btn = document.getElementById('col-buy-btn');
    btn.disabled = true;
    
    const handler = PaystackPop.setup({
      key: window.PAYSTACK_PUBLIC_KEY,
      email: session.user.email,
      amount: Math.round(total * 100),
      currency: 'NGN',
      ref: `neime_album_${activeCollection.id}_${Date.now()}`,
      callback: async (response) => {
        const { data, error } = await window.sb.functions.invoke('verify-paystack', {
          body: { reference: response.reference, album_id: activeCollection.id, buyer_id: session.user.id }
        });
        btn.disabled = false;
        if (error || !data?.success) {
          alert('Payment verification failed: ' + (error?.message || data?.error || 'Unknown error'));
          return;
        }
        openModal(activeCollection.id);
      },
      onClose: () => { btn.disabled = false; }
    });
    handler.openIframe();
  }
  
  window.Collections = { renderInto };
})();
