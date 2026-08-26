(function() {
  const playerHTML = `
    <div class="hidden fixed bottom-20 md:bottom-0 left-0 w-full z-40 bg-surface-container-high/95 backdrop-blur-xl border-t border-white/10 px-4 py-2 flex items-center gap-3 cursor-pointer" id="np-mini-player">
      <img class="w-10 h-10 rounded object-cover" id="np-mini-cover" src="" />
      <div class="flex-1 min-w-0">
        <p class="font-body-md text-body-md text-on-surface truncate" id="np-mini-title">Title</p>
        <p class="font-label-sm text-label-sm text-on-surface-variant truncate" id="np-mini-artist">Artist</p>
      </div>
      <button class="w-9 h-9 flex items-center justify-center text-on-surface" id="np-mini-toggle" type="button">
        <span class="material-symbols-outlined" id="np-mini-icon" style="font-variation-settings: 'FILL' 1;">pause</span>
      </button>
    </div>

    <div class="hidden fixed inset-0 z-[80] flex flex-col bg-gradient-to-b from-surface-container-high to-background" id="np-player-modal">
      <div class="flex items-center justify-between px-6 pt-6">
        <button class="text-on-surface" id="np-close" type="button">
          <span class="material-symbols-outlined text-3xl">expand_more</span>
        </button>
        <p class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Playing Now</p>
        <span class="w-8"></span>
      </div>
      <div class="flex-1 flex flex-col items-center justify-center px-8 gap-8">
        <img class="w-full max-w-xs aspect-square rounded-xl object-cover shadow-2xl" id="np-cover" src="" />
        <div class="text-center w-full">
          <h2 class="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-1" id="np-title">Song Title</h2>
          <p class="font-body-lg text-body-lg text-on-surface-variant" id="np-artist">Artist</p>
        </div>
        <div class="w-full">
          <input class="w-full accent-primary-container" id="np-seek" max="100" min="0" type="range" value="0" />
          <div class="flex justify-between font-label-sm text-label-sm text-on-surface-variant mt-1">
            <span id="np-current-time">0:00</span>
            <span id="np-duration">0:00</span>
          </div>
        </div>
        <button class="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center" id="np-toggle" type="button">
          <span class="material-symbols-outlined text-4xl" id="np-toggle-icon" style="font-variation-settings: 'FILL' 1;">pause</span>
        </button>
      </div>
    </div>
    <audio id="np-audio"></audio>
  `;
  
  document.addEventListener('DOMContentLoaded', () => {
    document.body.insertAdjacentHTML('beforeend', playerHTML);
    setupControls();
  });
  
  const audioEl = () => document.getElementById('np-audio');
  
  function formatTime(s) {
    if (!isFinite(s)) return '0:00';
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
  }
  
  function setPlayIcon(isPlaying) {
    document.getElementById('np-toggle-icon').textContent = isPlaying ? 'pause' : 'play_arrow';
    document.getElementById('np-mini-icon').textContent = isPlaying ? 'pause' : 'play_arrow';
  }
  
  function setupControls() {
    const a = audioEl();
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
      document.getElementById('np-seek').value = (a.currentTime / a.duration) * 100 || 0;
    });
    a.addEventListener('loadedmetadata', () => {
      document.getElementById('np-duration').textContent = formatTime(a.duration);
    });
    document.getElementById('np-seek').addEventListener('input', (e) => {
      a.currentTime = (e.target.value / 100) * a.duration;
    });
  }
  
  // Public API — pass { title, artist_name, cover_url, audio_path }
  window.playSong = async function(song) {
    const { data, error } = await window.sb.storage.from('songs').createSignedUrl(song.audio_path, 3600);
    if (error) { alert('Could not load audio: ' + error.message); return; }
    
    const a = audioEl();
    a.src = data.signedUrl;
    a.play();
    
    document.getElementById('np-cover').src = song.cover_url || '';
    document.getElementById('np-title').textContent = song.title;
    document.getElementById('np-artist').textContent = song.artist_name;
    document.getElementById('np-mini-cover').src = song.cover_url || '';
    document.getElementById('np-mini-title').textContent = song.title;
    document.getElementById('np-mini-artist').textContent = song.artist_name;
    
    document.getElementById('np-mini-player').classList.remove('hidden');
    document.getElementById('np-player-modal').classList.remove('hidden');
    setPlayIcon(true);
  };
})();
