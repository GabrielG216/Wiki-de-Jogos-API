// Carregar lista de jogos
async function carregarJogos() {
  const res = await fetch("jogos.json");
  const jogos = await res.json();

  const lista = document.getElementById("listaJogos");
  if (!lista) return;

  function renderizar(filtro = "todos", busca = "") {
    lista.innerHTML = "";
    const favoritos = getFavoritos();
    jogos
      .filter(j => (filtro === "todos" || j.genero === filtro))
      .filter(j => j.nome.toLowerCase().includes(busca.toLowerCase()))
      .forEach(jogo => {
        const card = document.createElement("div");
        card.className = "card";
        const favoritado = favoritos.includes(jogo.id);
        card.innerHTML = `
          <img src="${jogo.img.imagem1}" alt="${jogo.nome}">
          <h3>${jogo.nome}</h3>
          <p>${jogo.ano}</p>
          <span class="fav ${favoritado ? 'favoritado' : 'nao-favoritado'}" data-id="${jogo.id}">${favoritado ? '❤' : '🤍'}</span>
          <br>
          <a href="detalhes.html?id=${jogo.id}">Ver detalhes</a>
        `;
        lista.appendChild(card);
      });
    // Adiciona evento para todos os corações
    lista.querySelectorAll('.fav').forEach(el => {
      el.addEventListener('click', function() {
        toggleFavorito(Number(this.dataset.id));
        renderizar(document.getElementById("filterGenero").value, document.getElementById("searchInput").value);
      });
    });
  }

  renderizar();

  document.getElementById("searchInput").addEventListener("input", e => {
    renderizar(document.getElementById("filterGenero").value, e.target.value);
  });

  document.getElementById("filterGenero").addEventListener("change", e => {
    renderizar(e.target.value, document.getElementById("searchInput").value);
  });
}

// Detalhes
async function carregarDetalhes() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) return;

  const res = await fetch("jogos.json");
  const jogos = await res.json();
  const jogo = jogos.find(j => j.id == id);

  // Define o background do body com a imagem3 e overlay escuro
  if (jogo && jogo.img && jogo.img.imagem3) {
    document.body.style.background = `url('${jogo.img.imagem3}') no-repeat center center fixed`;
    document.body.style.backgroundSize = 'cover';
    document.body.classList.add('detalhes-bg');
    // Adiciona overlay se não existir
    if (!document.querySelector('.bg-overlay')) {
      const overlay = document.createElement('div');
      overlay.className = 'bg-overlay';
      document.body.appendChild(overlay);
    }
  }

  const container = document.getElementById("detalhesContainer");
  if (container) {
    const favoritos = getFavoritos();
    const favoritado = favoritos.includes(jogo.id);
    container.innerHTML = `
      <div class="card">
        <img class="imgDetalhes" src="${jogo.img.imagem2}" alt="${jogo.nome}">
        <h2>${jogo.nome}</h2>
        <p><b>Ano:</b> ${jogo.ano}</p>
        <p><b>Gênero:</b> ${jogo.genero}</p>
        <p>${jogo.descricao}</p>
        <span class="fav ${favoritado ? 'favoritado' : 'nao-favoritado'}" id="favDetalhes" data-id="${jogo.id}">${favoritado ? '❤' : '🤍'}</span>
      </div>
    `;
    // Evento para o coração
    const favBtn = document.getElementById('favDetalhes');
    if (favBtn) {
      favBtn.addEventListener('click', function() {
        toggleFavorito(Number(this.dataset.id));
        carregarDetalhes();
      });
    }
  }
}

// Favoritos
function getFavoritos() {
  return JSON.parse(localStorage.getItem("favoritos")) || [];
}

function toggleFavorito(id) {
  let favoritos = getFavoritos();
  if (favoritos.includes(id)) {
    favoritos = favoritos.filter(f => f !== id);
  } else {
    favoritos.push(id);
  }
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
}

async function carregarFavoritos() {
  const res = await fetch("jogos.json");
  const jogos = await res.json();
  const favoritos = getFavoritos();

  const lista = document.getElementById("favoritosLista");
  if (!lista) return;

  lista.innerHTML = "";
  jogos.filter(j => favoritos.includes(j.id)).forEach(jogo => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${jogo.img.imagem1}" alt="${jogo.nome}">
      <h3>${jogo.nome}</h3>
      <p>${jogo.ano}</p>
      <span class="fav favoritado" data-id="${jogo.id}">❤</span>
      <a href="detalhes.html?id=${jogo.id}">Ver detalhes</a>
    `;
    lista.appendChild(card);
  });
  // Evento para remover dos favoritos
  lista.querySelectorAll('.fav').forEach(el => {
    el.addEventListener('click', function() {
      toggleFavorito(Number(this.dataset.id));
      carregarFavoritos();
    });
  });
}



// Executar nas páginas certas
if (document.getElementById("listaJogos")) carregarJogos();
if (document.getElementById("detalhesContainer")) carregarDetalhes();
if (document.getElementById("favoritosLista")) carregarFavoritos();
