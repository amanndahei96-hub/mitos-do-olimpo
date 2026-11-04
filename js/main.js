/**
 * OLYMPUS — JavaScript Interativo Master
 * Funcionalidades interativas para Mapa do Olimpo, Cards 3D, Linha do Tempo e Multimídia
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
   1. NAVEGAÇÃO MOBILE RESPONSIVA
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.nav-list');

  if (!toggleBtn || !navList) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', !isExpanded);
    navList.classList.toggle('active');
  });

  // Fechar menu ao clicar em qualquer link
  navList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ==========================================================================
   2. CANVAS DE PARTÍCULAS CELESTIAIS NO HERO (AURA DOURADA DO OLIMPO)
   ========================================================================== */
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let width, height;
  let particles = [];

  function resize() {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
    createParticles();
  }

  function createParticles() {
    particles = [];
    const count = Math.min(Math.floor(width / 22), 65);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.8,
        color: Math.random() > 0.4 ? 'rgba(212, 175, 55, ' : 'rgba(248, 250, 252, ',
        alpha: Math.random() * 0.7 + 0.2,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4 - 0.15,
        pulseSpeed: Math.random() * 0.02 + 0.01
      });
    }
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let p of particles) {
      p.x += p.speedX;
      p.y += p.speedY;
      p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.01;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      const safeAlpha = Math.max(0.1, Math.min(0.85, p.alpha));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color + safeAlpha + ')';
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(212, 175, 55, 0.6)';
      ctx.fill();
    }

    animationFrameId = requestAnimationFrame(render);
  }

  window.addEventListener('resize', resize);
  resize();
  render();
}

/* ==========================================================================
   3. MAPA INTERATIVO DO OLIMPO (CRITÉRIO C.2)
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
    summary: 'Irmã e esposa legítima de Zeus. Guardiã da ordem conjugal e protetora das mulheres nascidas livres e do parto.',
    symbols: 'Pavão com olhos de Argos, Diadema real, Cetro com lótus e Romã',
    myth: 'Vingança implacável contra as amantes e filhos ilegítimos de Zeus, como Héracles e Leto.',
    cardId: 'card-hera'
  },
  poseidon: {
    name: 'Posídon (Ποσειδῶν)',
    roman: 'Netuno',
    domain: 'Oceanos, Tempestades Marinhas, Terremotos e Cavalos',
    summary: 'Irmão de Zeus e senhor incontestável dos abismos marítimos. Com seu tridente, tem o poder de quebrar continentes e suscitar maremotos.',
    symbols: 'Tridente de bronze, Cavalo marinho (Hipocampo), Golfinho e Touro',
    myth: 'Disputa pelo patrocínio de Atenas, criando a primeira fonte salgada na Acrópole.',
    cardId: 'card-poseidon'
  },
  demeter: {
    name: 'Deméter (Δημήτηρ)',
    roman: 'Ceres',
    domain: 'Agricultura, Colheitas, Fertilidade e Leis Sagradas',
    summary: 'Deusa mãe nutridora da terra cultivada e dos grãos. Seu culto centralizava os célebres e iniciáticos Mistérios de Elêusis.',
    symbols: 'Espigas de trigo, Tocha, Foice e Cornucópia de frutos',
    myth: 'A busca dolorosa por sua filha Perséfone raptada ao Submundo, gerando a alternância das quatro estações.',
    cardId: 'card-demeter'
  },
  atena: {
    name: 'Atena (Ἀθηνᾶ)',
    roman: 'Minerva',
    domain: 'Sabedoria Estratégica, Artes Bélicas, Justiça e Filosofia',
    summary: 'Nascida armada e bradando seu grito de guerra diretamente da cabeça de Zeus após ele devorar Métis. Padroeira das cidades e da civilização.',
    symbols: 'Égide com a Górgona Medusa, Coruja de Atenas, Oliveira e Elmo ático',
    myth: 'Vitória sobre Posídon ao ofertar a oliveira à cidade de Atenas e auxílio a heróis como Perseu e Odisseu.',
    cardId: 'card-atena'
  },
  apolo: {
    name: 'Apolo (Ἀπόλλων)',
    roman: 'Febo',
    domain: 'Luz Solar, Música, Poesia, Profecia e Medicina',
    summary: 'Filho de Zeus e Leto, irmão gêmeo de Ártemis. Patrono supremo das Musas no Monte Parnaso e patrono do grande Oráculo de Delfos.',
    symbols: 'Lira dourada, Loureiro, Arco de prata e Serpente Píton vencida',
    myth: 'Derrota da colossal serpente ctônica Píton e estabelecimento dos Jogos Píticos em Delfos.',
    cardId: 'card-apolo'
  },
  artemis: {
    name: 'Ártemis (Ἄρτεμις)',
    roman: 'Diana',
    domain: 'Caça, Vida Selvagem, Lua e Virgindade Protetora',
    summary: 'Irmã gêmea de Apolo. Senhora protetora das florestas virgens, animais selvagens, donzelas e das transições femininas.',
    symbols: 'Arco e flechas douradas, Cervo (Corça de Cerineia), Lua crescente e Cipreste',
    myth: 'Transformação do caçador Actéon em cervo após ele tê-la visto banhar-se desprovida de vestes na fonte sagrada.',
    cardId: 'card-artemis'
  },
  ares: {
    name: 'Ares (Ἄρης)',
    roman: 'Marte',
    domain: 'Guerra Sangrenta, Fúria em Batalha e Violência Bélica',
    summary: 'Filho de Zeus e Hera. Representa o frenesi impetuoso, brutal e desenfreado do combate, em oposição à guerra calculada de Atena.',
    symbols: 'Lança afiada, Escudo bojudo, Cão de guerra, Abutre e Elmo encimado',
    myth: 'Flagrado pelos deuses preso na rede invisível de bronze forjada por Hefesto ao lado de Afrodite.',
    cardId: 'card-ares'
  },
  afrodite: {
    name: 'Afrodite (Ἀφροδίτη)',
    roman: 'Vênus',
    domain: 'Amor, Beleza, Desejo Erótico e Fertilidade Universal',
    summary: 'Brotada da espuma do mar fecundada pelos genitais de Urano (segundo Hesíodo) ou filha de Zeus e Dione (segundo Homero). Senhora da atração cósmica.',
    symbols: 'Pomba branca, Rosa sagrada, Espelho de bronze, Concha marinha e Maçã',
    myth: 'O Julgamento de Páris, no qual prometeu Helena de Esparta ao príncipe troiano, precipitando a Guerra de Troia.',
    cardId: 'card-afrodite'
  },
  hefesto: {
    name: 'Hefesto (Ἥφαιστος)',
    roman: 'Vulcano',
    domain: 'Metalurgia, Fogo Físico, Ofícios Manuais e Vulcões',
    summary: 'O mestre artesão dos deuses. Embora coxo e arremessado do Olimpo ao mar na infância, arquitetou os suntuosos palácios de ouro dos olímpicos.',
    symbols: 'Bigorna, Martelo de ferreiro, Fole e Pinça de fundição',
    myth: 'Forjamento dos raios de Zeus, do escudo Égide e da armadura impenetrável de Aquiles.',
    cardId: 'card-hefesto'
  },
  hermes: {
    name: 'Hermes (Ἑρμῆς)',
    roman: 'Mercúrio',
    domain: 'Mensagens Divinas, Comércio, Viagens, Lábia e Guia das Almas',
    summary: 'Filho de Zeus e Maia. O mais veloz dos deuses e o único habilitado a transitar livremente entre o Céu, a Terra e o Submundo dos mortos.',
    symbols: 'Caduceu (bastão com serpentes), Sandálias aladas (Talárias) e Chapéu de viajante (Pétaso)',
    myth: 'No primeiro dia de vida, furtou o rebanho sagrado de Apolo e inventou a lira a partir de uma carapaça de tartaruga.',
    cardId: 'card-hermes'
  },
  dionisio: {
    name: 'Dioniso (Διόνυσος)',
    roman: 'Baco',
    domain: 'Vinho, Êxtase Ritual, Teatro, Loucura Sagrada e Vegetação',
    summary: 'Filho de Zeus e da mortal Sêmele, gerado na coxa do pai. Ocupou o 12º assento olímpico após a gentil abdicação da deusa Héstia.',
    symbols: 'Tirso (haste de cana com pinha), Videira, Pantera e Cálice cántaro',
    myth: 'A instituição dos festivais dionisíacos em Atenas, que deram origem formal à Tragédia e à Comédia ocidentais.',
    cardId: 'card-dionisio'
  }
};

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

    inspectorGreek.textContent = `${data.roman} • Grego Clássico`;
    inspectorName.textContent = data.name;
    inspectorDomain.textContent = data.domain;
    inspectorBio.textContent = data.summary;
    inspectorSymbols.textContent = data.symbols;
    inspectorMyth.textContent = data.myth;

    if (inspectorLink) {
      inspectorLink.href = `#${data.cardId}`;
      inspectorLink.onclick = (e) => {
        const targetCard = document.getElementById(data.cardId);
        if (targetCard) {
          e.preventDefault();
          targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          targetCard.classList.add('flipped');
          setTimeout(() => targetCard.classList.remove('flipped'), 2500);
        }
      };
    }

    mapNodes.forEach(node => {
      if (node.dataset.god === godKey) {
        node.classList.add('active');
      } else {
        node.classList.remove('active');
      }
    });
  }

  mapNodes.forEach(node => {
    node.addEventListener('click', () => {
      const godKey = node.dataset.god;
      updateInspector(godKey);
    });

    node.addEventListener('mouseenter', () => {
      const godKey = node.dataset.god;
      updateInspector(godKey);
    });
  });

  // Inicializar com Zeus
  updateInspector('zeus');
}

/* ==========================================================================
   4. CARDS MITOLÓGICOS INTERATIVOS 3D (CRITÉRIO C.3)
   ========================================================================== */
function initGodCards() {
  const cards = document.querySelectorAll('.god-flip-card');
  const filterBtns = document.querySelectorAll('.filter-btn');

  // Virar ao clicar no botão de ação da carta
  cards.forEach(card => {
    const flipBtns = card.querySelectorAll('.card-flip-action, .card-flip-back-action');
    flipBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        card.classList.toggle('flipped');
      });
    });
  });

  // Filtros de Deuses por Domínio
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        cards.forEach(card => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }
}

/* ==========================================================================
   5. LINHA DO TEMPO MITOLÓGICA (CRITÉRIO C.4)
   ========================================================================== */
function initTimeline() {
  const toggleButtons = document.querySelectorAll('.timeline-toggle-btn');

  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const parentCard = btn.closest('.timeline-card');
      const content = parentCard.querySelector('.timeline-expandable');
      if (content) {
        const isOpen = content.classList.contains('open');
        content.classList.toggle('open');
        btn.innerHTML = isOpen ? '✦ Ver Fontes & Detalhes ▾' : '✦ Ocultar Detalhes ▴';
      }
    });
  });
}

/* ==========================================================================
   6. PLAYER DE VÍDEO HTML5 E SALA DE APRESENTAÇÃO (CRITÉRIO C.7 & REQ 10)
   ========================================================================== */
function initVideoPlayer() {
  const video = document.getElementById('projectVideo');
  if (!video) return;

  const btnTheater = document.getElementById('btnTheaterMode');
  const btnFullscreen = document.getElementById('btnFullscreen');
  const localVideoInput = document.getElementById('localVideoInput');
  const videoStatusText = document.getElementById('videoStatusText');

  // Modo Teatro
  if (btnTheater) {
    btnTheater.addEventListener('click', () => {
      document.body.classList.toggle('theater-mode');
      const isTheater = document.body.classList.contains('theater-mode');
      btnTheater.textContent = isTheater ? 'Sair do Modo Teatro' : 'Modo Teatro';
    });
  }

  // Alternar Tela Cheia
  if (btnFullscreen) {
    btnFullscreen.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        if (video.requestFullscreen) {
          video.requestFullscreen();
        } else if (video.webkitRequestFullscreen) {
          video.webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    });
  }

  // Carregador de Vídeo Local (facilita testar qualquer arquivo do grupo na hora)
  if (localVideoInput) {
    localVideoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const fileUrl = URL.createObjectURL(file);
        video.src = fileUrl;
        video.load();
        video.play();
        if (videoStatusText) {
          videoStatusText.textContent = `Vídeo Carregado: ${file.name} (${Math.round(file.size / 1024 / 1024 * 10) / 10} MB)`;
        }
      }
    });
  }

  // Atalhos de Teclado Úteis para Apresentação
  window.addEventListener('keydown', (e) => {
    // Ignorar se o usuário estiver digitando em input ou textarea
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    if (e.code === 'Space') {
      e.preventDefault();
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    } else if (e.key === 'm' || e.key === 'M') {
      video.muted = !video.muted;
    } else if (e.key === 'f' || e.key === 'F') {
      if (btnFullscreen) btnFullscreen.click();
    } else if (e.key === 't' || e.key === 'T') {
      if (btnTheater) btnTheater.click();
    }
  });
}
