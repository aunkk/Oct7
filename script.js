const panels = [...document.querySelectorAll('.panel')];
const navButtons = [...document.querySelectorAll('.nav-btn')];
const dots = [...document.querySelectorAll('.dot')];
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const celebrateBtn = document.getElementById('celebrateBtn');
const memoryCards = [...document.querySelectorAll('.memory-card')];
const themeToggle = document.getElementById('themeToggle');
const birthdayAudio = document.getElementById('birthdayAudio');
const coverPlaySong = document.getElementById('coverPlaySong');
const miniAudioToggle = document.getElementById('miniAudioToggle');
const miniAudioSeek = document.getElementById('miniAudioSeek');
const miniAudioElapsed = document.getElementById('miniAudioElapsed');
const miniAudioDuration = document.getElementById('miniAudioDuration');
const miniAudioStatus = document.getElementById('miniAudioStatus');
const audioToggles = [miniAudioToggle, coverPlaySong];

let currentIndex = 0;
const totalPanels = panels.length;

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainingSeconds}`;
}

function updateAudioPosition() {
  const duration = birthdayAudio.duration;
  const elapsed = birthdayAudio.currentTime;
  miniAudioElapsed.textContent = formatTime(elapsed);
  miniAudioDuration.textContent = formatTime(duration);

  if (Number.isFinite(duration) && duration > 0) {
    miniAudioSeek.value = String(Math.round((elapsed / duration) * Number(miniAudioSeek.max)));
  }
  miniAudioSeek.setAttribute('aria-valuetext', `${formatTime(elapsed)} of ${formatTime(duration)}`);
}

function updateAudioState(isPlaying) {
  audioToggles.forEach((toggle) => {
    const playLabel = toggle === coverPlaySong ? 'Play song' : 'Play';
    const pauseLabel = toggle === coverPlaySong ? 'Pause song' : 'Pause';
    toggle.textContent = isPlaying ? pauseLabel : playLabel;
    toggle.setAttribute('aria-label', isPlaying ? 'Pause song' : 'Play song');
  });
  miniAudioStatus.textContent = isPlaying ? 'Now playing.' : birthdayAudio.ended ? 'Song finished.' : 'Paused.';
}

birthdayAudio.addEventListener('loadedmetadata', updateAudioPosition);
birthdayAudio.addEventListener('timeupdate', updateAudioPosition);
birthdayAudio.addEventListener('play', () => updateAudioState(true));
birthdayAudio.addEventListener('pause', () => updateAudioState(false));
birthdayAudio.addEventListener('ended', () => updateAudioState(false));
birthdayAudio.addEventListener('error', () => {
  miniAudioStatus.textContent = 'The audio file could not be loaded.';
});

audioToggles.forEach((toggle) => {
  toggle.addEventListener('click', () => {
    if (birthdayAudio.paused) {
      birthdayAudio.play().catch(() => {
      miniAudioStatus.textContent = 'Playback could not start. Please try again.';
      });
    } else {
      birthdayAudio.pause();
    }
  });
});

miniAudioSeek.addEventListener('input', () => {
  if (Number.isFinite(birthdayAudio.duration) && birthdayAudio.duration > 0) {
    birthdayAudio.currentTime = (Number(miniAudioSeek.value) / Number(miniAudioSeek.max)) * birthdayAudio.duration;
  }
});

function showPanel(index) {
  currentIndex = Math.min(Math.max(index, 0), totalPanels - 1);

  panels.forEach((panel, idx) => {
    panel.classList.toggle('active', idx === currentIndex);
  });

  navButtons.forEach((button) => {
    const target = button.dataset.target;
    const matchedPanel = document.getElementById(target);
    button.classList.toggle('active', matchedPanel && matchedPanel.dataset.index == currentIndex);
  });

  dots.forEach((dot, idx) => {
    dot.classList.toggle('active', idx === currentIndex);
  });

  prevBtn.disabled = currentIndex === 0;
  prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
  nextBtn.textContent = currentIndex === totalPanels - 1 ? 'Finish' : 'Next';
}

function nextPanel() {
  showPanel(currentIndex + 1);
}

function prevPanel() {
  showPanel(currentIndex - 1);
}

navButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const target = button.dataset.target;
    const panel = document.getElementById(target);
    if (panel) {
      showPanel(Number(panel.dataset.index));
    }
  });
});

prevBtn.addEventListener('click', prevPanel);
nextBtn.addEventListener('click', () => {
  if (currentIndex < totalPanels - 1) {
    nextPanel();
  }
});

[...document.querySelectorAll('[data-next]')].forEach((button) => {
  button.addEventListener('click', () => {
    const nextIndex = Number(button.dataset.next);
    if (!Number.isNaN(nextIndex)) showPanel(nextIndex);
  });
});

[...document.querySelectorAll('[data-target]')].forEach((button) => {
  button.addEventListener('click', () => {
    const target = button.dataset.target;
    const panel = document.getElementById(target);
    if (panel) showPanel(Number(panel.dataset.index));
  });
});

memoryCards.forEach((card) => {
  card.addEventListener('click', () => {
    card.classList.toggle('active');
  });
});

function createConfettiBurst() {
  const burstCount = 90;
  const buttonBounds = celebrateBtn.getBoundingClientRect();
  const originX = buttonBounds.left + buttonBounds.width / 2;
  const originY = buttonBounds.top + buttonBounds.height / 2;
  const spread = Math.min(window.innerWidth * 0.48, 420);

  for (let i = 0; i < burstCount; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti';
    const shape = Math.floor(Math.random() * 3);
    if (shape === 1) piece.classList.add('confetti-square');
    if (shape === 2) piece.classList.add('confetti-streamer');

    const angle = Math.random() * Math.PI * 2;
    const distance = 110 + Math.random() * spread;
    piece.style.left = `${originX}px`;
    piece.style.top = `${originY}px`;
    piece.style.background = `var(--confetti-${Math.floor(Math.random() * 5) + 1})`;
    piece.style.setProperty('--dx', `${Math.cos(angle) * distance}px`);
    piece.style.setProperty('--dy', `${Math.sin(angle) * distance - 70}px`);
    piece.style.setProperty('--turn', `${Math.random() * 720 - 360}deg`);
    piece.style.animationDelay = `${Math.random() * 0.28}s`;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 2400);
  }
}

celebrateBtn.addEventListener('click', () => {
  createConfettiBurst();
  celebrateBtn.textContent = 'Celebrating!';
  setTimeout(() => {
    celebrateBtn.textContent = 'Celebrate';
  }, 1400);
});

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  themeToggle.textContent = isDark ? 'Light mode' : 'Dark mode';
});

showPanel(0);
