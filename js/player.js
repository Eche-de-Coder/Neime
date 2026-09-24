(function() {
  const playerHTML = `
    <div class="hidden fixed bottom-20 md:bottom-0 left-0 w-full z-40 bg-[#1e1917]/95 backdrop-blur-xl border-t border-white/10 px-4 py-2 flex items-center gap-3 cursor-pointer" id="np-mini-player">
      <img class="w-10 h-10 rounded object-cover" id="np-mini-cover" src="" />
      <div class="flex-1 min-w-0">
        <p class="text-sm text-white truncate" id="np-mini-title">Title</p>
        <p class="text-xs text-white/60 truncate" id="np-mini-artist">Artist</p>
      </div>
      <button class="w-9 h-9 flex items-center justify-center text-white" id="np-mini-toggle" type="button">
        <svg class="w-6 h-6 fill-current" id="np-mini-icon" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>
      </button>
    </div>

    <div class="hidden fixed inset-0 z-[80] flex justify-center bg-stone-950 text-white font-sans" id="np-player-modal">
      <div class="relative w-full max-w-md min-h-screen flex flex-col overflow-hidden bg-[#140b07]">
        <div class="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <img class="absolute-top[10%] -left[20%] w-[140%] h-[90%] object-cover scale-125 filter opacity-100 brightness-75 contrast-125" id="np-bg-cover" src="" />
          <div class="absolute inset-0 bg-gradient-to-b from-transparent via-[#0B0B0B]/20 via-[#0B0B0B]/85 to-[#0B0B0B]"></div>
          <div class="absolute inset-0 backdrop-blur-[60px]"></div>
        </div>

        <div class="relative z-10 flex flex-col min-h-screen pb-12 overflow-y-auto">
          <header class="pt-8 pb-3 px-6 flex items-center justify-between text-white/90">
            <button class="p-2 -ml-2 rounded-full active:scale-95 transition-transform hover:bg-white/10" id="np-close" type="button">
              <svg class="w-6 h-6 stroke-current" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            <div class="text-center flex flex-col items-center">
              <span class="text-[10px] tracking-wider uppercase font-semibold text-white/60">Now Playing</span>
            </div>
            <span class="w-9 h-9"></span>
          </header>

          <section class="px-7 pt-4 pb-7 flex justify-center items-center">
            <div class="w-full aspect-square max-w-[340px] rounded-xl overflow-hidden shadow-[0_20px_45px_-10px_rgba(0,0,0,0.85)] border border-white/5">
              <img class="w-full h-full object-cover select-none" id="np-cover" src="" />
            </div>
          </section>

          <section class="px-7 flex items-center justify-between mt-2">
            <div class="flex-1 pr-4 truncate">
              <h1 class="text-2xl font-black tracking-tight text-white uppercase truncate" id="np-title">Title</h1>
              <p class="text-sm font-medium text-white/70 mt-0.5 truncate" id="np-artist">Artist</p>
            </div>
            <button class="w-9 h-9 rounded-full border-2 border-white/80 flex items-center justify-center text-white active:scale-90 transition-transform flex-shrink-0 hover:border-white" id="np-like" type="button">
              <svg class="w-5 h-5 stroke-current" fill="none" id="np-like-icon" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewBox="0 0 24 24"><line x1="12" x2="12" y1="5" y2="19"></line><line x1="5" x2="19" y1="12" y2="12"></line></svg>
            </button>
          </section>

          <section class="px-7 mt-6 flex flex-col">
            <input class="np-seek w-full accent-white h-1" id="np-seek" max="100" min="0" type="range" value="0" />
            <div class="flex justify-between items-center text-[11px] font-medium text-white/50 tracking-wider mt-1.5 font-mono">
              <span id="np-current-time">0:00</span>
              <span id="np-duration">0:00</span>
            </div>

            <div class="flex items-center justify-center gap-10 mt-5">
              <button class="text-white hover:text-white/80 active:scale-90 transition-transform" id="np-prev" type="button">
                <svg class="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"></path></svg>
              </button>
              <button class="w-16 h-16 rounded-full bg-white text-[#120905] flex items-center justify-center shadow-lg active:scale-95 transition-transform hover:bg-neutral-100" id="np-toggle" type="button">
                <svg class="w-7 h-7 fill-current" id="np-toggle-icon" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>
              </button>
              <button class="text-white hover:text-white/80 active:scale-90 transition-transform" id="np-next" type="button">
                <svg class="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"></path></svg>
              </button>
            </div>

            <div class="flex items-center justify-end mt-7 pt-1 text-white/80">
              <button class="text-white/80 hover:text-white active:scale-90 transition-transform" id="np-share" type="button">
                <svg class="w-5 h-5 stroke-current" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"></line><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"></line></svg>
              </button>
            </div>
          </section>

          <div class="px-5 mt-7 space-y-4">
            <section class="rounded-3xl bg-[#1e1917]/60 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl relative" id="np-artist-card">
              <div class="relative w-full h-48 overflow-hidden">
                <img class="w-full h-full object-cover object-top filter brightness-75" id="np-artist-banner" src="" />
                <div class="absolute inset-0 bg-gradient-to-t from-[#1b1b1e] via-[#1b1b1e]/30 to-transparent"></div>
                <span class="absolute top-4 left-5 text-[11px] font-mono uppercase tracking-wider text-white/70">About the artist</span>
              </div>
              <div class="px-6 pb-6 pt-1 bg-[#1b1b1e]/90">
                <div class="flex items-center justify-between gap-4 pt-3">
                  <div class="min-w-0">
                    <h3 class="text-2xl font-bold text-white tracking-tight truncate" id="np-artist-name">Artist</h3>
                    <p class="text-xs text-white/50 mt-1 font-mono tracking-wide" id="np-artist-listeners">0 monthly listeners</p>
                  </div>
                  <button class="px-5 py-1.5 rounded-full border border-white/20 text-white text-xs font-semibold hover:border-white active:scale-95 transition-all flex-shrink-0" id="np-follow-btn" type="button">
                    Follow
                  </button>
                </div>
                <p class="text-xs text-white/70 leading-relaxed mt-4 whitespace-pre-line" id="np-artist-bio"></p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
    <audio id="np-audio"></audio>
  `;
  
  const seekStyle = `
    .np-seek { -webkit-appearance: none; appearance: none; background: transparent; }
    .np-seek::-webkit-slider-runnable-track { height: 4px; border-radius: 9999px; }
    .np-seek::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 12px; border-radius: 9999px; background: #fff; margin-top: -4px; box-shadow: 0 1px 3px rgba(0,0,0,0.4); }
    .np-seek::-moz-range-track { height: 4px; border-radius: 9999px; background: rgba(255,255,255,0.2); }
    .np-seek::-moz-range-thumb { width: 12px; height: 12px; border: none; border-radius: 9999px; background: #fff; }
  `;
  
  document.addEventListener('DOMContentLoaded', () => {
    document.head.insertAdjacentHTML('beforeend', `<style>${seekStyle}</style>`);
    document.body.insertAdjacentHTML('beforeend', playerHTML);
    setupControls();
  });
  
  const audioEl = () => document.getElementById('np-audio');
  let queue = [];
  let queueIndex = 0;
  let currentSong = null;
  
  function formatTime(s) {
    if (!isFinite(s)) return '0:00';
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
  }
  
  function setPlayIcon(isPlaying) {
    const pauseIcon = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path>';
    const playIcon = '<path d="M8 5v14l11-7z"></path>';
    document.getElementById('np-toggle-icon').innerHTML = isPlaying ? pauseIcon : playIcon;
    document.getElementById('np-mini-icon').innerHTML = isPlaying ? pauseIcon : playIcon;
  }
  
  function updateSeekFill() {
    const a = audioEl();
    const pct = (a.currentTime / a.duration) * 100 || 0;
    document.getElementById('np-seek').value = pct;
    document.getElementById('np-seek').style.background =
      `linear-gradient(to right, #fff ${pct}%, rgba(255,255,255,0.2) ${pct}%)`;
  }
  
  function setupControls() {
    const a = audioEl();

    a.addEventListener('error', () => {
      const err = a.error;
      const reasons = { 1: 'Aborted', 2: 'Network error', 3: 'Decode error', 4: 'Source not supported' };
      console.error('Audio error:', reasons[err?.code] || 'Unknown', '| src:', a.src);
    });
    
    document.getElementById('np-toggle').addEventListener('click', () => {
      a.paused ? (a.play(), setPlayIcon(true)) : (a.pause(), setPlayIcon(false));
    });
    document.getElementById('np-mini-toggle').addEventListener('click', (e) => {
      e.stopPropagation();
      a.paused ? (a.play(), setPlayIcon(true)) : (a.pause(), setPlayIcon(false));
    });
    document.getElementById('np-close').addEventListener('click', () => document.getElementById('np-player-modal').classList.add('hidden'));
    document.getElementById('np-mini-player').addEventListener('click', () => document.getElementById('np-player-modal').classList.remove('hidden'));
    
    a.addEventListener('timeupdate', () => {
      document.getElementById('np-current-time').textContent = formatTime(a.currentTime);
      updateSeekFill();
    });
    a.addEventListener('loadedmetadata', () => {
      document.getElementById('np-duration').textContent = formatTime(a.duration);
    });
    document.getElementById('np-seek').addEventListener('input', (e) => {
      a.currentTime = (e.target.value / 100) * a.duration;
      updateSeekFill();
    });
    
    document.getElementById('np-prev').addEventListener('click', () => skip(-1));
    document.getElementById('np-next').addEventListener('click', () => skip(1));
    
    document.getElementById('np-like').addEventListener('click', () => {
      const icon = document.getElementById('np-like-icon');
      const liked = icon.dataset.liked === 'true';
      icon.dataset.liked = (!liked).toString();
      icon.innerHTML = liked ?
        '<line x1="12" x2="12" y1="5" y2="19"></line><line x1="5" x2="19" y1="12" y2="12"></line>' :
        '<polyline points="20 6 9 17 4 12"></polyline>';
    });
    
    document.getElementById('np-share').addEventListener('click', () => {
      if (!currentSong?.share_code) return;
      navigator.clipboard.writeText(`https://neime.com.ng/${currentSong.share_code}`);
    });
    
    document.getElementById('np-follow-btn').addEventListener('click', toggleFollow);
  }
  
  function skip(direction) {
    if (!queue.length) return;
    const nextIndex = queueIndex + direction;
    if (nextIndex < 0 || nextIndex >= queue.length) return;
    window.playSong(queue[nextIndex], queue);
  }
  
  async function loadArtistCard(song) {
    const card = document.getElementById('np-artist-card');
    document.getElementById('np-artist-banner').src = song.cover_url || '';
    document.getElementById('np-artist-name').textContent = song.artist_name || '';
    document.getElementById('np-artist-bio').textContent = '';
    document.getElementById('np-artist-listeners').textContent = '';
    document.getElementById('np-follow-btn').classList.add('hidden');
    
    if (!song.artist_id) { card.classList.add('hidden'); return; }
    card.classList.remove('hidden');
    
    const { data: artist } = await window.sb
      .from('artists')
      .select('bio, avatar_url')
      .eq('id', song.artist_id)
      .maybeSingle();
    
    document.getElementById('np-artist-bio').textContent = artist?.bio || '';
    if (artist?.avatar_url) document.getElementById('np-artist-banner').src = artist.avatar_url;
    
    const { data: artistSongs } = await window.sb
      .from('songs')
      .select('play_count')
      .eq('artist_id', song.artist_id);
    
    const totalStreams = (artistSongs || []).reduce((sum, s) => sum + (s.play_count || 0), 0);
    document.getElementById('np-artist-listeners').textContent = `${totalStreams.toLocaleString()} monthly listeners`;
    
    const { data: { session } } = await window.sb.auth.getSession();
    if (!session || session.user.id === song.artist_id) return;
    
    document.getElementById('np-follow-btn').classList.remove('hidden');
    const { data: existing } = await window.sb
      .from('follows')
      .select('follower_id')
      .eq('follower_id', session.user.id)
      .eq('artist_id', song.artist_id)
      .maybeSingle();
    
    setFollowButtonState(!!existing);
  }
  
  function setFollowButtonState(isFollowing) {
    const btn = document.getElementById('np-follow-btn');
    btn.dataset.following = isFollowing;
    btn.textContent = isFollowing ? 'Following' : 'Follow';
    btn.classList.toggle('bg-white', isFollowing);
    btn.classList.toggle('text-black', isFollowing);
  }
  
  async function toggleFollow() {
    if (!currentSong?.artist_id) return;
    const { data: { session } } = await window.sb.auth.getSession();
    if (!session) return;
    
    const btn = document.getElementById('np-follow-btn');
    const isFollowing = btn.dataset.following === 'true';
    btn.disabled = true;
    
    if (isFollowing) {
      await window.sb.from('follows').delete().eq('follower_id', session.user.id).eq('artist_id', currentSong.artist_id);
    } else {
      await window.sb.from('follows').insert({ follower_id: session.user.id, artist_id: currentSong.artist_id });
    }
    
    btn.disabled = false;
    setFollowButtonState(!isFollowing);
  }
  
  /**window.playSong = async function(song, songQueue) {
    const { data, error } = await window.sb.storage.from('songs').createSignedUrl(song.audio_path, 3600);
    if (error) { alert('Could not load audio: ' + error.message); return; }
    
    currentSong = song;
    queue = songQueue && songQueue.length ? songQueue : [song];
    queueIndex = queue.findIndex(s => s.id === song.id);
    if (queueIndex === -1) queueIndex = 0;
    
    const a = audioEl();
    a.src = data.signedUrl;
    a.play();
    startStreamTimer(song.id);**/
  
  window.playSong = async function(song, songQueue) {
    const { data, error } = await window.sb.functions.invoke('get-stream-url', {
      body: { song_id: song.id }
    });
    if (error || !data?.url) {
      alert('Could not load audio: ' + (error?.message || data?.error || 'Unknown error'));
      return;
    }
    
    currentSong = song;
    queue = songQueue && songQueue.length ? songQueue : [song];
    queueIndex = queue.findIndex(s => s.id === song.id);
    if (queueIndex === -1) queueIndex = 0;
    
    const a = audioEl();
    a.src = data.url;
    console.log('Stream URL:', data.url);
    //a.play();
    a.play().catch(err => console.error('play() rejected:', err.name, err.message));
    startStreamTimer(song.id, data.sessionId);
    // ...rest of the function (title/cover/mini-player setup) stays exactly the same
    
    const displayArtist = song.feature ? `${song.artist_name} ft. ${song.feature}` : song.artist_name;
    
    document.getElementById('np-cover').src = song.cover_url || '';
    document.getElementById('np-bg-cover').src = song.cover_url || '';
    document.getElementById('np-title').textContent = song.title;
    document.getElementById('np-artist').textContent = displayArtist;
    document.getElementById('np-mini-cover').src = song.cover_url || '';
    document.getElementById('np-mini-title').textContent = song.title;
    document.getElementById('np-mini-artist').textContent = displayArtist;
    document.getElementById('np-like-icon').dataset.liked = 'false';
    document.getElementById('np-like-icon').innerHTML = '<line x1="12" x2="12" y1="5" y2="19"></line><line x1="5" x2="19" y1="12" y2="12"></line>';
    
    document.getElementById('np-mini-player').classList.remove('hidden');
    document.getElementById('np-player-modal').classList.remove('hidden');
    setPlayIcon(true);
    
    loadArtistCard(song);
  };
  
  /**let streamTimer = null;
  let streamSeconds = 0;
  let streamCounted = false;**/
  
  /**function startStreamTimer(songId) {
    clearStreamTimer();
    streamSeconds = 0;
    streamCounted = false;
    streamTimer = setInterval(() => {
      const a = audioEl();
      if (a.paused) return;
      streamSeconds += 1;
      if (streamSeconds >= 30 && !streamCounted) {
        streamCounted = true;
        window.sb.rpc('increment_play_count', { p_song_id: songId }).then(({ error }) => {
          if (error) console.error('Stream count failed:', error.message);
        });
      }
    }, 1000);
  }**/
  
  /**function startStreamTimer(songId, sessionId) {
    clearStreamTimer();
    streamSeconds = 0;
    streamCounted = false;
    streamTimer = setInterval(() => {
      const a = audioEl();
      if (a.paused) return;
      streamSeconds += 1;
      if (streamSeconds >= 30 && !streamCounted) {
        streamCounted = true;
        window.sb.rpc('confirm_stream', { p_session_id: sessionId }).then(({ error }) => {
          if (error) console.error('Stream count failed:', error.message);
        });
      }
    }, 1000);
  }
  
  function clearStreamTimer() {
    if (streamTimer) clearInterval(streamTimer);
    streamTimer = null;
  }
  
  
  const STORAGE_KEY = 'neime_playback_state';
  
  function saveState() {
    if (!currentSong) return;
    const a = audioEl();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        song: currentSong,
        queue,
        queueIndex,
        currentTime: a.currentTime
      }));
    } catch (_) {}
  }
  
  async function restoreState() {
    let saved;
    try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch (_) { return; }
    if (!saved?.song) return;
    
    const { data, error } = await window.sb.functions.invoke('get-stream-url', { body: { song_id: saved.song.id } });
    if (error || !data?.url) return;
    
    currentSong = saved.song;
    queue = saved.queue || [saved.song];
    queueIndex = saved.queueIndex || 0;
    
    const a = audioEl();
    a.src = data.url;
    a.currentTime = saved.currentTime || 0;
    
    const displayArtist = currentSong.feature ? `${currentSong.artist_name} ft. ${currentSong.feature}` : currentSong.artist_name;
    document.getElementById('np-cover').src = currentSong.cover_url || '';
    document.getElementById('np-bg-cover').src = currentSong.cover_url || '';
    document.getElementById('np-title').textContent = currentSong.title;
    document.getElementById('np-artist').textContent = displayArtist;
    document.getElementById('np-mini-cover').src = currentSong.cover_url || '';
    document.getElementById('np-mini-title').textContent = currentSong.title;
    document.getElementById('np-mini-artist').textContent = displayArtist;
    
    document.getElementById('np-mini-player').classList.remove('hidden');
    setPlayIcon(false);
    loadArtistCard(currentSong);
  }
  
  window.addEventListener('pagehide', saveState);
  document.addEventListener('DOMContentLoaded', restoreState);**/






 let streamTimer = null;
  let streamSeconds = 0;
  let streamCounted = false;

  function startStreamTimer(songId, sessionId) {
    clearStreamTimer();
    streamSeconds = 0;
    streamCounted = false;
    streamTimer = setInterval(() => {
      const a = audioEl();
      if (a.paused) return;
      streamSeconds += 1;
      if (streamSeconds >= 30 && !streamCounted) {
        streamCounted = true;
        window.sb.rpc('confirm_stream', { p_session_id: sessionId }).then(({ error }) => {
          if (error) console.error('Stream count failed:', error.message);
        });
      }
    }, 1000);
  }

  function clearStreamTimer() {
    if (streamTimer) clearInterval(streamTimer);
    streamTimer = null;
  }

  const STORAGE_KEY = 'neime_playback_state';

  function saveState() {
    if (!currentSong) return;
    const a = audioEl();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        song: currentSong,
        queue,
        queueIndex,
        currentTime: a.currentTime
      }));
    } catch (_) {}
  }

  async function restoreState() {
    let saved;
    try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch (_) { return; }
    if (!saved?.song) return;

    const { data, error } = await window.sb.functions.invoke('get-stream-url', { body: { song_id: saved.song.id } });
    if (error || !data?.url) return;

    currentSong = saved.song;
    queue = saved.queue || [saved.song];
    queueIndex = saved.queueIndex || 0;

    const a = audioEl();
    a.src = data.url;
    a.currentTime = saved.currentTime || 0;

    const displayArtist = currentSong.feature ? `${currentSong.artist_name} ft. ${currentSong.feature}` : currentSong.artist_name;
    document.getElementById('np-cover').src = currentSong.cover_url || '';
    document.getElementById('np-bg-cover').src = currentSong.cover_url || '';
    document.getElementById('np-title').textContent = currentSong.title;
    document.getElementById('np-artist').textContent = displayArtist;
    document.getElementById('np-mini-cover').src = currentSong.cover_url || '';
    document.getElementById('np-mini-title').textContent = currentSong.title;
    document.getElementById('np-mini-artist').textContent = displayArtist;

    document.getElementById('np-mini-player').classList.remove('hidden');
    setPlayIcon(false);
    loadArtistCard(currentSong);
  }

  window.addEventListener('pagehide', saveState);
  document.addEventListener('DOMContentLoaded', restoreState);
})();
