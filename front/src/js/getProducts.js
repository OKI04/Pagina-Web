// === VARIABLES GLOBALES ===
const bodyProduct = document.querySelector(".main-products");
const tituloProductos = document.querySelector("#producto h2");
let productosCargados = [];
let carrusel = [];

// === CARGAR PRODUCTOS ===
async function loadProducts() {
  try {
    const baseApiUrl = import.meta.env.VITE_BACKEND_URL;
    if (!baseApiUrl) {
      console.error("VITE_BACKEND_URL no definida");
      alert("Error: URL del backend no configurada");
      return;
    }

    const res = await fetch(`${baseApiUrl}/admin/products/all`, {
      method: 'GET',
      credentials: 'include'
    });

    if (!res.ok) {
      const err = await res.text();
      alert('Error al cargar productos: ' + err);
      return;
    }

    const productos = await res.json();

    productosCargados = productos.map(prod => {
      const imagenesNorm = (prod.imagenes || []).map(img => normalizarImagen(img, baseApiUrl));
      const coloresNorm = (prod.colores || []).map(color => ({
        ...color,
        imagenes: (color.imagenes || []).map(img => normalizarImagen(img, baseApiUrl)),
        publicUrl: color.imagenes?.[0]?.url ? `${baseApiUrl}/${color.imagenes[0].url.replace(/\\/g, "/")}` : ''
      }));

      const estampadosNorm = (prod.estampados || []).map(estampado => ({
        ...estampado,
        imagenes: (estampado.imagenes || []).map(img => normalizarImagen(img, baseApiUrl)),
        publicUrl: estampado.imagenes?.[0]?.url ? `${baseApiUrl}/${estampado.imagenes[0].url.replace(/\\/g, "/")}` : ''
      }));

      return {
        ...prod,
        imagenes: imagenesNorm,
        colores: coloresNorm,
        estampados: estampadosNorm
      };
    });

    document.querySelector('.spanLoader')?.remove();

    renderProductos(productosCargados);
    loadCarrusel();

  } catch (error) {
    console.error('Error en loadProducts:', error);
    alert('Error de conexión al cargar productos');
  }
}

function normalizarImagen(img, baseApiUrl) {
  const rutaLimpia = img.url.replace(/\\/g, "/");
  return {
    ...img,
    url: rutaLimpia,
    publicUrl: `${baseApiUrl}/${rutaLimpia}`
  };
}

// === CARRUSEL ===
async function loadCarrusel() {
  try {
    const res = await fetch('/admin/carrusel/products/carrusel', {
      method: 'GET',
      credentials: 'include'
    });

    if (!res.ok) {
      const err = await res.text();
      alert('Error al cargar carrusel: ' + err);
      return;
    }

    const data = await res.json();
    const productos = data.carruselItems[0].productos;
    carrusel = filtrarCarrusel(productosCargados, productos);
    insertarEnCarrusel(carrusel, productos);

  } catch (error) {
    console.error('Error en loadCarrusel:', error);
    alert('Error de conexión al cargar el carrusel');
  }
}

function filtrarCarrusel(base, filtro) {
  const referencias = filtro.map(p => p.referencia);
  return base.filter(p => referencias.includes(p.referencia));
}

function insertarEnCarrusel(productos, res) {
  const carouselTrack = document.querySelector(".carousel-track");
  carouselTrack.innerHTML = "";

  productos.forEach(producto => {
    let imagen = obtenerImagenCarrusel(producto, res);
    const card = document.createElement("div");
    card.className = "carousel-item";
    card.innerHTML = `
      <img src="${imagen}" alt="${producto.nombre}" data-id="${producto.referencia}" onclick='AbrirProductoComprarDesdeCarrusel(${JSON.stringify(producto)})'>
    `;
    carouselTrack.appendChild(card);
    carouselTrack.appendChild(card.cloneNode(true));
  });

  startAutoScroll(productos.length);
}

function obtenerImagenCarrusel(producto, res) {
  for (const item of res) {
    if (item.referencia === producto.referencia) {
      const fuente = item.tipo === 'colores' ? producto.colores : producto.estampados;
      const match = fuente.find(e => e.codigo === item.codigo);
      return match?.imagenes?.[1]?.publicUrl || '';
    }
  }
  return '';
}

function startAutoScroll(count) {
  const track = document.querySelector(".carousel-track");
  const item = document.querySelector(".carousel-item");
  if (!item) return;

  const itemWidth = item.offsetWidth;
  const spacing = parseInt(getComputedStyle(item).marginRight || 0);
  const loopWidth = (itemWidth + spacing) * count;

  let offset = 0;
  function step() {
    offset = (offset + 3.5) % loopWidth;
    track.style.transform = `translateX(-${offset}px)`;
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// === RENDER PRODUCTOS ===
function renderProductos(productos) {
  bodyProduct.innerHTML = productos.map((p, i) => {
    const color = p.colores?.[0];
    const estampado = p.estampados?.[0];
    const generales = p.imagenes || [];
    let imagenes = color?.imagenes.length ? color.imagenes : estampado?.imagenes.length ? estampado.imagenes : generales;
    const principal = imagenes[1]?.publicUrl || imagenes[0]?.publicUrl || '';
    const rotacion = imagenes.slice(1).map(img => img.publicUrl);

    return `
      <div class="product-container">
        <div class="product-card">
          <div class="product-image">
            <img src="${principal}" alt="Vista" class="main-image" id="mainImage-${i}" data-index="${i}" data-rotacionactiva='${JSON.stringify(rotacion)}'>
            <button class="quick-buy" onclick="AbrirProductoComprar('${p.referencia}')">COMPRAR</button>
          </div>
          <div class="product-info">
            <div class="product-name">${p.nombre}</div>
            ${renderColores(p)}
            ${renderEstampados(p)}
            <div class="product-sizes">
              ${Object.entries(p.tallas || {}).filter(([_, c]) => c > 0).map(([t]) => `<span class="size-box">${t}</span>`).join('') || '<span class="size-box">No disponibles</span>'}
            </div>
            <div class="product-price">Precio mayorista: <span class="price-value">$${p.precio.toLocaleString('es-CO')}</span></div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  inicializarRotacion();
  inicializarColorClick();
  inicializarEstampadoClick();
}

function renderColores(p) {
  if (!p.colores?.length) return '';
  return `<div class="product-colors"><div class="lista-colores"><div class="colores-container">${p.colores.map((c, i) => `<div class="color-item ${i === 0 ? 'selected' : ''}"><img src="${c.publicUrl}" class="color-imagen"></div>`).join('')}</div></div></div>`;
}

function renderEstampados(p) {
  if (!p.estampados?.length) return '';
  return `<div class="product-colors"><div class="lista-colores"><div class="colores-container">${p.estampados.map((e, i) => `<div class="estampado-item ${(p.colores?.length === 0 && i === 0) ? 'selected' : ''}"><img src="${e.publicUrl}" class="estampado-imagen color-imagen"></div>`).join('')}</div></div></div>`;
}

function inicializarRotacion() {
  document.querySelectorAll('.main-image').forEach(img => {
    const rotacion = JSON.parse(img.dataset.rotacionactiva || "[]");
    if (!rotacion.length) return;
    let intervalId = null, currentIndex = 0;
    img.addEventListener("mouseenter", () => {
      if (intervalId !== null) return;
      intervalId = setInterval(() => {
        img.src = rotacion[currentIndex];
        currentIndex = (currentIndex + 1) % rotacion.length;
      }, 1000);
    });
    img.addEventListener("mouseleave", () => {
      clearInterval(intervalId);
      intervalId = null;
      img.src = rotacion[0];
    });
  });
}

function inicializarColorClick() {
  document.querySelectorAll(".product-colors .color-imagen:not(.estampado-imagen)").forEach(colorImg => {
    colorImg.addEventListener("click", (e) => {
      const card = e.target.closest(".product-card");
      card.querySelectorAll(".color-item, .estampado-item").forEach(i => i.classList.remove("selected"));
      e.target.parentElement.classList.add("selected");

      const mainImg = card.querySelector(".main-image");
      const index = mainImg.dataset.index;
      const producto = productosCargados[index];

      const src = new URL(colorImg.src).pathname;
      const colorSel = producto.colores.find(c => new URL(c.publicUrl, location.origin).pathname === src);
      if (!colorSel || colorSel.imagenes.length < 2) return;

      mainImg.src = colorSel.imagenes[1].publicUrl;
      mainImg.dataset.rotacionactiva = JSON.stringify(colorSel.imagenes.slice(2).map(img => img.publicUrl));
      inicializarRotacion();
    });
  });
}

function inicializarEstampadoClick() {
  document.querySelectorAll(".product-colors .estampado-imagen").forEach(estampadoImg => {
    estampadoImg.addEventListener("click", (e) => {
      const card = e.target.closest(".product-card");
      card.querySelectorAll(".color-item, .estampado-item").forEach(i => i.classList.remove("selected"));
      e.target.parentElement.classList.add("selected");

      const mainImg = card.querySelector(".main-image");
      const index = mainImg.dataset.index;
      const producto = productosCargados[index];

      const src = new URL(estampadoImg.src).pathname;
      const estampadoSel = producto.estampados.find(e => new URL(e.publicUrl, location.origin).pathname === src);
      if (!estampadoSel || estampadoSel.imagenes.length < 2) return;

      mainImg.src = estampadoSel.imagenes[1].publicUrl;
      mainImg.dataset.rotacionactiva = JSON.stringify(estampadoSel.imagenes.slice(2).map(img => img.publicUrl));
      inicializarRotacion();
    });
  });
}

// === INICIALIZACIÓN GENERAL ===
document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  const botonesCategoria = document.querySelectorAll(".btn-categoria");
  botonesCategoria.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const categoria = e.target.dataset.categoria;
      if (categoria !== "todos") {
        const filtrados = productosCargados.filter(p => p.categoria.toLowerCase() === categoria.toLowerCase());
        renderProductos(filtrados);
        tituloProductos.textContent = e.target.textContent.trim().toUpperCase();
      } else {
        renderProductos(productosCargados);
        tituloProductos.textContent = "TODOS LOS PRODUCTOS";
      }
    });
  });
});