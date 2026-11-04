
/**
 * OLYMPUS — JavaScript Interativo
 * Mapa do Olimpo, Cards 3D, Linha do Tempo e Multimídia
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initHeroCanvas();
  initOlympusMap();
  initGodCards();
  initTimeline();
  initVideoPlayer();
});

/* ==========================================================================
   1. NAVEGAÇÃO MOBILE
   ========================================================================== */

function initMobileNav() {
  const toggleBtn = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.nav-list');

  if (!toggleBtn || !navList) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';

    toggleBtn.setAttribute('aria-expanded', String(!isExpanded));
    navList.classList.toggle('active');
  });

  navList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ==========================================================================
   2. CANVAS DE PARTÍCULAS DO HERO
   ========================================================================== */

function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || !canvas.parentElement) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  let width = 0;
  let height = 0;
  let particles = [];
  let animationFrameId = null;

  function createParticles() {
    particles = [];

    const count = Math.min(Math.floor(width / 22), 65);

    for (let i = 0; i < count; i++) {
      const baseAlpha = Math.random() * 0.7 + 0.2;

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.8,
        color: Math.random() > 0.4
          ? 'rgba(212, 175, 55, '
          : 'rgba(248, 250, 252, ',
        baseAlpha,
        alpha: baseAlpha,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4 - 0.15,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseOffset: Math.random() * Math.PI * 2
      });
    }
  }

  function resize() {
    const parent = canvas.parentElement;

    width = parent.clientWidth;
    height = parent.clientHeight;

    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    createParticles();

    if (reducedMotion) {
      renderStatic();
    }
  }

  function drawParticle(p, time) {
    p.x += p.speedX;
    p.y += p.speedY;

    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;

    const pulse = Math.sin(time * p.pulseSpeed + p.pulseOffset);
    const alpha = Math.max(
      0.1,
      Math.min(0.85, p.baseAlpha + pulse * 0.12)
    );

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

    ctx.fillStyle = p.color + alpha + ')';
    ctx.shadowBlur = 8;
    ctx.shadowColor = 'rgba(212, 175, 55, 0.6)';
    ctx.fill();
  }

  function renderStatic() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.baseAlpha + ')';
      ctx.fill();
    });
  }

  function render(time = 0) {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => drawParticle(p, time));

    animationFrameId = requestAnimationFrame(render);
  }

  window.addEventListener('resize', resize);

  resize();

  if (!reducedMotion) {
    render();
  }

  // Evita manter a animação rodando quando a página não está visível.
  document.addEventListener('visibilitychange', () => {
    if (reducedMotion) return;

    if (document.hidden) {
      cancelAnimationFrame(animationFrameId);
    } else {
      cancelAnimationFrame(animationFrameId);
      render();
    }
  });
}

/* ==========================================================================
   3. DADOS DOS DEUSES
   ========================================================================== */

const GODS_DATA = {
  zeus: {
    name: 'Zeus (Ζεύς)',
    roman: 'Júpiter',
    domain: 'Rei dos Deuses, Céus, Trovões e Justiça Divina',
    summary: 'Soberano absoluto do Monte Olimpo e regulador da ordem cósmica (Cosmos vs Caos). Filho mais novo de Cronos e Reia, liderou seus irmãos na grande Titanomaquia.',
    symbols: 'Raio fulminante, Águia real, Cetro e Carvalho sagrado',
    myth: 'Distribuição dos reinos cósmicos por sorteio com Posídon e Hades após a vitória sobre os Titãs.',
    cardId: 'card-zeus'
  },

  hera: {
    name: 'Hera (Ἥρα)',
    roman: 'Juno',
    domain: 'Rainha do Olimpo, Casamento, Fidelidade e Família',
    summary: 'Irmã e esposa legítima de Zeus. Guardiã da ordem conjugal e protetora das mulheres e do parto.',
    symbols: 'Pavão com olhos de Argos, Diadema real, Cetro com lótus e Romã',
    myth: 'Vingança contra as amantes e filhos ilegítimos de Zeus, como Héracles e Leto.',
    cardId: 'card-hera'
  },

  poseidon: {
    name: 'Posídon (Ποσειδῶν)',
    roman: 'Netuno',
    domain: 'Oceanos, Tempestades Marinhas, Terremotos e Cavalos',
    summary: 'Irmão de Zeus e senhor dos abismos marítimos. Com seu tridente, controla as águas e provoca tempestades.',
    symbols: 'Tridente de bronze, Cavalo marinho, Golfinho e Touro',
    myth: 'Disputa pelo patrocínio de Atenas, criando uma fonte salgada na Acrópole.',
    cardId: 'card-poseidon'
  },

  demeter: {
    name: 'Deméter (Δημήτηρ)',
    roman: 'Ceres',
    domain: 'Agricultura, Colheitas, Fertilidade e Leis Sagradas',
    summary: 'Deusa da terra cultivada e dos grãos. Seu culto estava ligado aos Mistérios de Elêusis.',
    symbols: 'Espigas de trigo, Tocha, Foice e Cornucópia de frutos',
    myth: 'A busca por sua filha Perséfone, relacionada à explicação mitológica das estações do ano.',
    cardId: 'card-demeter'
  },

  atena: {
    name: 'Atena (Ἀθηνᾶ)',
    roman: 'Minerva',
    domain: 'Sabedoria Estratégica, Artes Bélicas, Justiça e Filosofia',
    summary: 'Nascida armada da cabeça de Zeus após ele devorar Métis. Padroeira das cidades e da civilização.',
    symbols: 'Égide com a Górgona Medusa, Coruja, Oliveira e Elmo',
    myth: 'Vitória sobre Posídon ao ofertar a oliveira à cidade de Atenas e auxílio a heróis como Perseu e Odisseu.',
    cardId: 'card-atena'
  },

  apolo: {
    name: 'Apolo (Ἀπόλλων)',
    roman: 'Febo',
    domain: 'Luz Solar, Música, Poesia, Profecia e Medicina',
    summary: 'Filho de Zeus e Leto, irmão gêmeo de Ártemis. Patrono das Musas e do Oráculo de Delfos.',
    symbols: 'Lira dourada, Loureiro, Arco e Serpente Píton',
    myth: 'Derrota da serpente Píton e estabelecimento dos Jogos Píticos em Delfos.',
    cardId: 'card-apolo'
  },

  artemis: {
    name: 'Ártemis (Ἄρτεμις)',
    roman: 'Diana',
    domain: 'Caça, Vida Selvagem, Lua e Proteção',
    summary: 'Irmã gêmea de Apolo. Senhora protetora das florestas, dos animais selvagens e das jovens.',
    symbols: 'Arco e flechas douradas, Cervo, Lua crescente e Cipreste',
    myth: 'Transformação do caçador Actéon em cervo após ele desrespeitar seu espaço sagrado.',
    cardId: 'card-artemis'
  },

  ares: {
    name: 'Ares (Ἄρης)',
    roman: 'Marte',
    domain: 'Guerra, Fúria em Batalha e Conflitos',
    summary: 'Filho de Zeus e Hera. Representa o lado impulsivo e violento do combate, em oposição à estratégia de Atena.',
    symbols: 'Lança, Escudo, Cão de guerra, Abutre e Elmo',
    myth: 'Foi preso em uma rede invisível de bronze forjada por Hefesto ao lado de Afrodite.',
    cardId: 'card-ares'
  },

  afrodite: {
    name: 'Afrodite (Ἀφροδίτη)',
    roman: 'Vênus',
    domain: 'Amor, Beleza, Desejo e Fertilidade',
    summary: 'Deusa do amor e da beleza. Segundo Hesíodo, nasceu da espuma do mar; em outra tradição, era filha de Zeus e Dione.',
    symbols: 'Pomba branca, Rosa, Espelho, Concha marinha e Maçã',
    myth: 'O Julgamento de Páris, que contribuiu para o início da Guerra de Troia.',
    cardId: 'card-afrodite'
  },

  hefesto: {
    name: 'Hefesto (Ἥφαιστος)',
    roman: 'Vulcano',
    domain: 'Metalurgia, Fogo, Ofícios Manuais e Vulcões',
    summary: 'Mestre artesão dos deuses. Criava armas, ferramentas e objetos extraordinários para os habitantes do Olimpo.',
    symbols: 'Bigorna, Martelo, Fole e Pinça de fundição',
    myth: 'Forjamento dos raios de Zeus e da armadura de Aquiles.',
    cardId: 'card-hefesto'
  },

  hermes: {
    name: 'Hermes (Ἑρμῆς)',
    roman: 'Mercúrio',
    domain: 'Mensagens Divinas, Comércio, Viagens e Guia das Almas',
    summary: 'Filho de Zeus e Maia. Mensageiro dos deuses e protetor dos viajantes e comerciantes.',
    symbols: 'Caduceu, Sandálias aladas e Chapéu de viajante',
    myth: 'Furtou o rebanho de Apolo quando ainda era bebê e inventou a lira.',
    cardId: 'card-hermes'
  },

  dionisio: {
    name: 'Dioniso (Διόνυσος)',
    roman: 'Baco',
    domain: 'Vinho, Teatro, Êxtase Ritual e Vegetação',
    summary: 'Filho de Zeus e da mortal Sêmele. É associado ao teatro, às festas e à vegetação.',
    symbols: 'Tirso, Videira, Pantera e Cálice',
    myth: 'Os festivais dionisíacos em Atenas contribuíram para o desenvolvimento do teatro grego.',
    cardId: 'card-dionisio'
  }
};

/* ==========================================================================
   4. MAPA INTERATIVO DO OLIMPO
   ========================================================================== */

function initOlympusMap() {
  const mapNodes = document.querySelectorAll('.map-node');

  const inspectorName = document.getElementById('inspectorName');
  const inspectorGreek = document.getElementById('inspectorGreek');
  const inspectorDomain = document.getElementById('inspectorDomain');
  const inspectorBio = document.getElementById('inspectorBio');
  const inspectorSymbols = document.getElementById('inspectorSymbols');
  const inspectorMyth = document.getElementById('inspectorMyth');
  const inspectorLink = document.getElementById('inspectorCardLink');

  if (!mapNodes.length || !inspectorName) return;

  function updateInspector(godKey) {
    const data = GODS_DATA[godKey];

    if (!data) return;

    inspectorName.textContent = data.name;

    if (inspectorGreek) {
      inspectorGreek.textContent = `${data.roman} • Grego Clássico`;
    }

    if (inspectorDomain) {
      inspectorDomain.textContent = data.domain;
    }

    if (inspectorBio) {
      inspectorBio.textContent = data.summary;
    }

    if (inspectorSymbols) {
      inspectorSymbols.textContent = data.symbols;
    }

    if (inspectorMyth) {
      inspectorMyth.textContent = data.myth;
    }

    if (inspectorLink) {
      inspectorLink.href = `#${data.cardId}`;

      inspectorLink.onclick = event => {
        const targetCard = document.getElementById(data.cardId);

        if (targetCard) {
          event.preventDefault();

          targetCard.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });

          targetCard.classList.add('flipped');

          window.setTimeout(() => {
            targetCard.classList.remove('flipped');
          }, 2500);
        }
      };
    }

    mapNodes.forEach(node => {
      node.classList.toggle('active', node.dataset.god === godKey);
    });
  }

  mapNodes.forEach(node => {
    const activateGod = () => {
      updateInspector(node.dataset.god);
    };

    node.addEventListener('click', activateGod);

    node.addEventListener('mouseenter', activateGod);

    node.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        activateGod();
      }
    });
  });

  updateInspector('zeus');
}

/* ==========================================================================
   5. CARDS MITOLÓGICOS 3D E FILTROS
   ========================================================================== */

function initGodCards() {
  const cards = document.querySelectorAll('.god-flip-card');
  const filterBtns = document.querySelectorAll('.filter-btn');

  cards.forEach(card => {
    const flipBtns = card.querySelectorAll(
      '.card-flip-action, .card-flip-back-action'
    );

    flipBtns.forEach(btn => {
      btn.addEventListener('click', event => {
        event.stopPropagation();
        card.classList.toggle('flipped');
      });
    });
  });

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(filterBtn => {
        filterBtn.classList.remove('active');
      });

      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const matches =
          filter === 'all' || card.dataset.category === filter;

        card.style.display = matches ? '' : 'none';
      });
    });
  });
}

/* ==========================================================================
   6. LINHA DO TEMPO MITOLÓGICA
   ========================================================================== */

function initTimeline() {
  const toggleButtons = document.querySelectorAll(
    '.timeline-toggle-btn'
  );

  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const parentCard = btn.closest('.timeline-card');

      if (!parentCard) return;

      const content = parentCard.querySelector(
        '.timeline-expandable'
      );

      if (!content) return;

      const isOpen = content.classList.toggle('open');

      btn.textContent = isOpen
        ? '✦ Ocultar Detalhes ▴'
        : '✦ Ver Fontes & Detalhes ▾';

      btn.setAttribute('aria-expanded', String(isOpen));
    });
  });
}

/* ==========================================================================
   7. PLAYER DE VÍDEO E MODO APRESENTAÇÃO
   ========================================================================== */

function initVideoPlayer() {
  const video = document.getElementById('projectVideo');

  if (!video) return;

  const btnTheater = document.getElementById('btnTheaterMode');
  const btnFullscreen = document.getElementById('btnFullscreen');
  const localVideoInput = document.getElementById('localVideoInput');
  const videoStatusText = document.getElementById('videoStatusText');

  let currentObjectUrl = null;

  // Modo Teatro
  if (btnTheater) {
    btnTheater.addEventListener('click', () => {
      document.body.classList.toggle('theater-mode');

      const isTheater = document.body.classList.contains(
        'theater-mode'
      );

      btnTheater.textContent = isTheater
        ? 'Sair do Modo Teatro'
        : 'Modo Teatro';
    });
  }

  // Tela Cheia
  if (btnFullscreen) {
    btnFullscreen.addEventListener('click', async () => {
      try {
        if (!document.fullscreenElement) {
          if (video.requestFullscreen) {
            await video.requestFullscreen();
          } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen();
          }
        } else {
          if (document.exitFullscreen) {
            await document.exitFullscreen();
          }
        }
      } catch (error) {
        console.warn('Não foi possível alterar a tela cheia:', error);
      }
    });
  }

  // Carregamento de vídeo local
  if (localVideoInput) {
    localVideoInput.addEventListener('change', event => {
      const file = event.target.files?.[0];

      if (!file) return;

      if (!file.type.startsWith('video/')) {
        if (videoStatusText) {
          videoStatusText.textContent =
            'Selecione um arquivo de vídeo válido.';
        }

        return;
      }

      // Libera o endereço temporário anterior.
      if (currentObjectUrl) {
        URL.revokeObjectURL(currentObjectUrl);
      }

      currentObjectUrl = URL.createObjectURL(file);

      video.src = currentObjectUrl;
      video.load();

      const playPromise = video.play();

      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          // Alguns navegadores exigem que o usuário inicie a reprodução.
        });
      }

      if (videoStatusText) {
        const sizeMB = (file.size / 1024 / 1024).toFixed(1);

        videoStatusText.textContent =
          `Vídeo Carregado: ${file.name} (${sizeMB} MB)`;
      }
    });
  }

  // Libera o endereço temporário quando a página é fechada.
  window.addEventListener('beforeunload', () => {
    if (currentObjectUrl) {
      URL.revokeObjectURL(currentObjectUrl);
    }
  });

  // Atalhos de teclado
  window.addEventListener('keydown', event => {
    const activeElement = document.activeElement;

    const isTyping =
      activeElement &&
      (
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeElement.tagName) ||
        activeElement.isContentEditable
      );

    if (isTyping || event.ctrlKey || event.altKey || event.metaKey) {
      return;
    }

    if (event.code === 'Space') {
      // Evita interferir em botões e outros controles.
      if (
        activeElement &&
        ['BUTTON', 'A'].includes(activeElement.tagName)
      ) {
        return;
      }

      event.preventDefault();

      if (video.paused) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    }

    if (event.key === 'm' || event.key === 'M') {
      video.muted = !video.muted;
    }

    if (event.key === 'f' || event.key === 'F') {
      if (btnFullscreen) btnFullscreen.click();
    }

    if (event.key === 't' || event.key === 'T') {
      if (btnTheater) btnTheater.click();
    }
  });
}
