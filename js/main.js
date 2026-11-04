// Navegação móvel acessível.
const navToggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('.nav-list');
if (navToggle && navList) {
  navToggle.addEventListener('click', () => {
    const expanded = navList.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', String(expanded));
  });
  navList.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      navList.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Expansão da linha do tempo.
document.querySelectorAll('.timeline-toggle-btn').forEach((button) => {
  button.addEventListener('click', () => {
    const panel = button.nextElementSibling;
    if (!panel) return;
    const expanded = panel.classList.toggle('open');
    button.setAttribute('aria-expanded', String(expanded));
  });
});

// Inspetor do mapa: texto sempre é inserido como texto, não como HTML.
const mapNodes = document.querySelectorAll('.map-node');
const inspector = document.querySelector('.map-inspector');
if (inspector) {
  const greek = inspector.querySelector('.inspector-greek-name');
  const name = inspector.querySelector('.inspector-name');
  const domain = inspector.querySelector('.inspector-domain');
  const bio = inspector.querySelector('.inspector-bio');
  const attributes = inspector.querySelector('.inspector-attributes');
  const selectNode = (node) => {
    mapNodes.forEach((item) => item.classList.toggle('active', item === node));
    if (greek) greek.textContent = node.dataset.greek || '';
    if (name) name.textContent = node.dataset.name || '';
    if (domain) domain.textContent = node.dataset.domain || '';
    if (bio) bio.textContent = node.dataset.bio || '';
    if (attributes) {
      attributes.replaceChildren(...(node.dataset.attributes || '').split(',').map((value) => {
        const li = document.createElement('li');
        li.textContent = value.trim();
        return li;
      }));
    }
  };
  mapNodes.forEach((node) => {
    node.addEventListener('click', () => selectNode(node));
    node.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectNode(node);
      }
    });
  });
}

// Filtros e cartões flip, caso existam na página.
const filterButtons = document.querySelectorAll('.filter-btn');
const godCards = document.querySelectorAll('.god-flip-card');
filterButtons.forEach((button) => button.addEventListener('click', () => {
  filterButtons.forEach((item) => item.classList.toggle('active', item === button));
  const filter = button.dataset.filter || 'all';
  godCards.forEach((card) => {
    card.hidden = filter !== 'all' && card.dataset.category !== filter;
  });
}));
godCards.forEach((card) => {
  const button = card.querySelector('.card-flip-action');
  if (button) button.addEventListener('click', () => card.classList.toggle('flipped'));
});

// Vídeo carregado pelo usuário. Não substituímos o conteúdo por um vídeo alheio.
const video = document.getElementById('projectVideo');
const statusText = document.getElementById('videoStatusText');
const fileInput = document.getElementById('localVideoInput');
let currentObjectUrl;
if (video && statusText && fileInput) {
  video.addEventListener('play', () => { statusText.textContent = 'Reproduzindo vídeo.'; });
  video.addEventListener('pause', () => { statusText.textContent = 'Vídeo pausado.'; });
  video.addEventListener('ended', () => { statusText.textContent = 'Reprodução concluída.'; });
  video.addEventListener('error', () => { statusText.textContent = 'Não foi possível carregar o vídeo. Escolha um arquivo MP4 ou WebM.'; });
  fileInput.addEventListener('change', () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;
    if (currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
    currentObjectUrl = URL.createObjectURL(file);
    video.src = currentObjectUrl;
    video.load();
    statusText.textContent = `Arquivo selecionado: ${file.name}`;
  });
  window.addEventListener('beforeunload', () => {
    if (currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
  });
}
const fullscreenButton = document.getElementById('btnFullscreen');
if (fullscreenButton && video) {
  fullscreenButton.addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await (video.closest('.cinema-screen-frame') || video).requestFullscreen();
    } catch {
      if (statusText) statusText.textContent = 'Tela cheia não está disponível neste navegador.';
    }
  });
}

// Partículas leves no banner inicial.
const canvas = document.getElementById('heroCanvas');
if (canvas) {
  const context = canvas.getContext('2d');
  if (context) {
    let particles = [];
    let frame;
    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * ratio;
      canvas.height = canvas.clientHeight * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles = Array.from({ length: 28 }, () => ({ x: Math.random() * canvas.clientWidth, y: Math.random() * canvas.clientHeight, radius: Math.random() * 1.6 + 0.6, speed: Math.random() * 0.45 + 0.15, alpha: Math.random() * 0.55 + 0.2 }));
    };
    const animate = () => {
      context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      particles.forEach((particle) => {
        particle.y += particle.speed;
        if (particle.y > canvas.clientHeight) { particle.y = -4; particle.x = Math.random() * canvas.clientWidth; }
        context.beginPath();
        context.fillStyle = `rgba(245, 231, 169, ${particle.alpha})`;
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
      });
      frame = requestAnimationFrame(animate);
    };
    resize();
    animate();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(frame);
      else animate();
    });
  }
}
