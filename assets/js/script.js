const panels = [...document.querySelectorAll('.panel')];
const navButtons = [...document.querySelectorAll('.nav-btn')];
const dots = [...document.querySelectorAll('.dot')];
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const celebrateBtn = document.getElementById('celebrateBtn');
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
    button.classList.toggle('active', matchedPanel && Number(matchedPanel.dataset.index) === currentIndex);
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

const wishStorageKey = 'oct7-personal-wishes';
const wishForm = document.getElementById('wishForm');
const wishTitle = document.getElementById('wishTitle');
const wishMessage = document.getElementById('wishMessage');
const wishStatus = document.getElementById('wishStatus');
const wishGrid = document.getElementById('giftGrid');
const initialWishes = [...wishGrid.querySelectorAll('.mini-card')].map((card, index) => ({
  id: `initial-${index + 1}`,
  title: card.querySelector('h3').textContent,
  message: card.querySelector('p').textContent,
}));
let personalWishes = [];
let deletedInitialWishIds = new Set();

function setWishStatus(message, isError = false) {
  wishStatus.textContent = message;
  wishStatus.classList.toggle('error', isError);
}

function readPersonalWishes() {
  try {
    const storedWishes = localStorage.getItem(wishStorageKey);
    if (storedWishes === null) return initialWishes;

    const savedData = JSON.parse(storedWishes);
    let parsedWishes;
    if (Array.isArray(savedData)) {
      parsedWishes = [...initialWishes, ...savedData];
    } else if (savedData && (savedData.version === 2 || savedData.version === 3) && Array.isArray(savedData.wishes)) {
      const retainedWishes = savedData.wishes.filter((wish) => (
        !wish || !/^initial-(?:[4-9]|1[0-9]|20)$/.test(wish.id)
      ));
      const existingIds = new Set(retainedWishes.map((wish) => wish && wish.id));
      deletedInitialWishIds = new Set(
        savedData.version === 3 && Array.isArray(savedData.deletedInitialWishIds)
          ? savedData.deletedInitialWishIds.filter((id) => typeof id === 'string')
          : initialWishes
            .slice(0, 3)
            .filter((wish) => !existingIds.has(wish.id))
            .map((wish) => wish.id)
      );
      parsedWishes = [
        ...retainedWishes,
        ...initialWishes.filter((wish) => (
          !existingIds.has(wish.id) && !deletedInitialWishIds.has(wish.id)
        )),
      ];
    }
    if (!parsedWishes || parsedWishes.some((wish) => (
      !wish
      || typeof wish.id !== 'string'
      || typeof wish.title !== 'string'
      || typeof wish.message !== 'string'
    ))) {
      throw new Error('Saved wishes have an invalid format.');
    }
    return parsedWishes;
  } catch (error) {
    console.error('Could not load saved wishes:', error);
    setWishStatus('Saved wishes could not be loaded from this browser.', true);
    return [];
  }
}

function savePersonalWishes(wishes, deletedWishIds = deletedInitialWishIds) {
  try {
    localStorage.setItem(wishStorageKey, JSON.stringify({
      version: 3,
      wishes,
      deletedInitialWishIds: [...deletedWishIds],
    }));
    personalWishes = wishes;
    deletedInitialWishIds = deletedWishIds;
    renderPersonalWishes();
    return true;
  } catch (error) {
    console.error('Could not save wishes in this browser:', error);
    setWishStatus('Could not save your wish. Check that browser storage is available.', true);
    return false;
  }
}

function deletePersonalWish(wish) {
  const updatedWishes = personalWishes.filter((item) => item.id !== wish.id);
  const deletedWishIds = new Set(deletedInitialWishIds);
  if (wish.id.startsWith('initial-')) deletedWishIds.add(wish.id);
  if (savePersonalWishes(updatedWishes, deletedWishIds)) setWishStatus(`${wish.title} deleted.`);
}

function renderPersonalWishes() {
  const fragment = document.createDocumentFragment();

  personalWishes.forEach((wish, index) => {
    fragment.append(createPersonalWishCard(wish, index));
  });

  wishGrid.replaceChildren(fragment);
}

function editPersonalWish(id) {
  const wish = personalWishes.find((item) => item.id === id);
  if (!wish) return;

  const card = document.createElement('article');
  card.className = 'mini-card glass-card memory-card personal-wish-card';

  const form = document.createElement('form');
  form.className = 'wish-edit-form';

  const titleLabel = document.createElement('label');
  titleLabel.textContent = 'Wish title';
  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.maxLength = 60;
  titleInput.required = true;
  titleInput.value = wish.title;
  titleLabel.append(titleInput);

  const messageLabel = document.createElement('label');
  messageLabel.textContent = 'Wish message';
  const messageInput = document.createElement('textarea');
  messageInput.maxLength = 240;
  messageInput.rows = 3;
  messageInput.required = true;
  messageInput.value = wish.message;
  messageLabel.append(messageInput);

  const actions = document.createElement('div');
  actions.className = 'wish-card-actions';
  const saveButton = document.createElement('button');
  saveButton.className = 'primary-btn';
  saveButton.type = 'submit';
  saveButton.textContent = 'Save';
  const cancelButton = document.createElement('button');
  cancelButton.className = 'secondary-btn';
  cancelButton.type = 'button';
  cancelButton.textContent = 'Cancel';
  cancelButton.addEventListener('click', renderPersonalWishes);

  actions.append(saveButton, cancelButton);
  form.append(titleLabel, messageLabel, actions);
  card.replaceChildren(form);
  wishGrid.replaceChildren(...personalWishes.map((item, index) => {
    if (item.id !== id) return createPersonalWishCard(item, index);
    return card;
  }));
  titleInput.focus();

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const updatedWish = {
      ...wish,
      title: titleInput.value.trim(),
      message: messageInput.value.trim(),
    };
    if (!updatedWish.title || !updatedWish.message) return;

    const updatedWishes = personalWishes.map((item) => (item.id === id ? updatedWish : item));
    if (savePersonalWishes(updatedWishes)) setWishStatus('Wish updated.');
  });
}

function createPersonalWishCard(wish, index) {
  const card = document.createElement('article');
  card.className = 'mini-card glass-card memory-card personal-wish-card';
  const label = document.createElement('span');
  label.className = 'mini-label';
  label.textContent = `Wish ${index + 1}`;
  const title = document.createElement('h3');
  title.textContent = wish.title;
  const message = document.createElement('p');
  message.textContent = wish.message;
  const actions = document.createElement('div');
  actions.className = 'wish-card-actions';
  const editButton = document.createElement('button');
  editButton.className = 'secondary-btn';
  editButton.type = 'button';
  editButton.textContent = 'Edit';
  editButton.addEventListener('click', () => editPersonalWish(wish.id));
  const deleteButton = document.createElement('button');
  deleteButton.className = 'secondary-btn';
  deleteButton.type = 'button';
  deleteButton.textContent = 'Delete';
  deleteButton.setAttribute('aria-label', `Delete wish: ${wish.title}`);
  deleteButton.addEventListener('click', () => deletePersonalWish(wish));
  actions.append(editButton, deleteButton);
  card.append(label, title, message, actions);
  return card;
}

wishGrid.addEventListener('click', (event) => {
  if (event.target.closest('button, form, input, textarea')) return;
  const card = event.target.closest('.memory-card');
  if (card) card.classList.toggle('active');
});

wishForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = wishTitle.value.trim();
  const message = wishMessage.value.trim();
  if (!title || !message) return;

  const wish = {
    id: window.crypto.randomUUID(),
    title,
    message,
  };
  if (savePersonalWishes([...personalWishes, wish])) {
    wishForm.reset();
    setWishStatus('Your wish was added.');
  }
});

personalWishes = readPersonalWishes();
renderPersonalWishes();

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

function createWishCardSpread() {
  const sourceCards = [...document.querySelectorAll('#giftGrid .mini-card')];
  if (sourceCards.length === 0) return;

  const bounds = celebrateBtn.getBoundingClientRect();
  const originX = bounds.left + bounds.width / 2;
  const originY = bounds.top + bounds.height / 2;
  const spreadLayer = document.getElementById('wishCelebration');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  sourceCards.forEach((sourceCard, index) => {
    const card = document.createElement('article');
    card.className = 'mini-card glass-card wish-burst-card';

    const label = document.createElement('span');
    label.className = 'mini-label';
    label.textContent = sourceCard.querySelector('.mini-label').textContent;

    const title = document.createElement('h3');
    title.textContent = sourceCard.querySelector('h3').textContent;

    const message = document.createElement('p');
    message.textContent = sourceCard.querySelector('p').textContent;
    card.append(label, title, message);
    card.style.left = `${originX}px`;
    card.style.top = `${originY}px`;
    spreadLayer.append(card);

    const angle = (Math.PI * 2 * index) / sourceCards.length - Math.PI / 2;
    const distance = Math.min(window.innerWidth * 0.34, window.innerHeight * 0.34, 250);
    const travelX = Math.cos(angle) * distance;
    const travelY = Math.sin(angle) * distance;

    if (reducedMotion) {
      card.style.transform = `translate(-50%, -50%) translate(${travelX}px, ${travelY}px)`;
      setTimeout(() => card.remove(), 1800);
      return;
    }

    const animation = card.animate([
      {
        opacity: 0,
        transform: 'translate(-50%, -50%) scale(0.35) rotate(0deg)',
        offset: 0,
      },
      {
        opacity: 1,
        transform: `translate(-50%, -50%) translate(${travelX}px, ${travelY}px) scale(1) rotate(${index % 2 === 0 ? -10 : 10}deg)`,
        offset: 0.22,
      },
      {
        opacity: 1,
        transform: `translate(-50%, -50%) translate(${travelX}px, ${travelY}px) scale(1) rotate(${index % 2 === 0 ? -10 : 10}deg)`,
        offset: 0.72,
      },
      {
        opacity: 0,
        transform: `translate(-50%, -50%) translate(${travelX * 1.2}px, ${travelY * 1.2}px) scale(0.8) rotate(${index % 2 === 0 ? -18 : 18}deg)`,
        offset: 1,
      },
    ], {
      duration: 3600,
      delay: index * 65,
      easing: 'cubic-bezier(0.18, 0.72, 0.28, 1)',
      fill: 'forwards',
    });
    animation.finished.then(() => card.remove());
  });
}

celebrateBtn.addEventListener('click', () => {
  createWishCardSpread();
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
