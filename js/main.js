const navToggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('.nav-list');

if (navToggle && navList) {
  navToggle.addEventListener('click', () => {
    const active = navList.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', String(active));
  });
}

const timelineButtons = document.querySelectorAll('.timeline-toggle-btn');
for (const btn of timelineButtons) {
  btn.addEventListener('click', () => {
    const panel = btn.nextElementSibling;
    if (!panel) return;
    const isOpen = panel.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(isOpen));
  });
}

const mapNodes = document.querySelectorAll('.map-node');
const mapInspector = document.querySelector('.map-inspector');
if (mapNodes.length && mapInspector) {
  const inspectorGreek = mapInspector.querySelector('.inspector-greek-name');
  const inspectorName = mapInspector.querySelector('.inspector-name');
  const inspectorDomain = mapInspector.querySelector('.inspector-domain');
  const inspectorBio = mapInspector.querySelector('.inspector-bio');
  const inspectorAttributes = mapInspector.querySelector('.inspector-attributes');

  mapNodes.forEach(node => {
    node.addEventListener('click', () => {
      mapNodes.forEach(item => item.classList.remove('active'));
      node.classList.add('active');
      const name = node.dataset.name || 'Zeus';
      const greek = node.dataset.greek || 'Ζεύς';
      const domain = node.dataset.domain || 'Céu e trovão';
      const bio = node.dataset.bio || 'Deus do Olimpo';
      const attrs = (node.dataset.attributes || 'Poder, presença, domínio').split(',');

      if (inspectorGreek) inspectorGreek.textContent = greek;
      if (inspectorName) inspectorName.textContent = name;
      if (inspectorDomain) inspectorDomain.textContent = domain;
      if (inspectorBio) inspectorBio.textContent = bio;
      if (inspectorAttributes) {
        inspectorAttributes.innerHTML = attrs.map(item => `<li>${item.trim()}</li>`).join('');
      }
    });
  });
}

const filterButtons = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.god-flip-card');
for (const btn of filterButtons) {
  btn.addEventListener('click', () => {
    filterButtons.forEach(item => item.classList.toggle('active', item === btn));
    const filter = btn.dataset.filter || 'all';
    cards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
}

const flipCards = document.querySelectorAll('.god-flip-card');
for (const card of flipCards) {
  const action = card.querySelector('.card-flip-action');
  if (action) {
    action.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  }
}

const video = document.getElementById('projectVideo');
const statusText = document.getElementById('videoStatusText');
if (video && statusText) {
  const updateStatus = (text) => {
    statusText.textContent = text;
  };
  video.addEventListener('play', () => updateStatus('Reproduzindo • Vídeo de Amanda & Bianca'));
  video.addEventListener('pause', () => updateStatus('Pausado • Vídeo de Amanda & Bianca'));
  video.addEventListener('ended', () => updateStatus('Reprodução concluída • Vídeo de Amanda & Bianca'));
  video.addEventListener('loadedmetadata', () => updateStatus('Vídeo de Amanda & Bianca • Pronto para Reprodução'));
}

const fullscreenBtn = document.getElementById('btnFullscreen');
if (fullscreenBtn && video) {
  fullscreenBtn.addEventListener('click', async () => {
    if (!document.fullscreenElement) {
      try {
        await video.requestFullscreen();
      } catch {
        // fallback sem falha na UI
      }
    } else {
      try {
        await document.exitFullscreen();
      } catch {
        // fallback sem falha na UI
      }
    }
  });
}

const localVideoInput = document.getElementById('localVideoInput');
if (localVideoInput && video) {
  localVideoInput.addEventListener('change', (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const objectURL = URL.createObjectURL(file);
    video.src = objectURL;
    video.load();
    if (statusText) statusText.textContent = `Arquivo local carregado: ${file.name}`;
  });
}

const canvas = document.getElementById('heroCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  const resize = () => {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * ratio;
    canvas.height = canvas.clientHeight * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * canvas.clientWidth,
      y: Math.random() * canvas.clientHeight,
      r: Math.random() * 2 + 1,
      speed: Math.random() * 0.7 + 0.2,
      alpha: Math.random() * 0.8 + 0.2
    }));
  };

  const animate = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);

    particles.forEach((p) => {
      p.y += p.speed;
      if (p.y > h) {
        p.y = -10;
        p.x = Math.random() * w;
      }
      ctx.beginPath();
      ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(animate);
  };

  resize();
  animate();
  window.addEventListener('resize', resize);
}
