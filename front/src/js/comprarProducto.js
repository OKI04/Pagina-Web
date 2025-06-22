// === VARIABLES GLOBALES (Estas ahora son del ámbito del módulo) ===
let currentImageIndex = 0;
let productImages = [];
let colorSeleccionado = null;
let estampadoSeleccionado = null;
let count = 0;

let productosCargados = []; // Se puede setear desde fuera con una función exportada

export function setProductosCargados(productos) {
  productosCargados = productos;
}

export function AbrirProductoComprarDesdeCarrusel(producto) {
  if (!producto || !producto.referencia) {
    alert("Producto inválido");
    return;
  }

  const yaExiste = productosCargados.some(p => p.referencia === producto.referencia);
  if (!yaExiste) {
    productosCargados.push(producto);
  }

  AbrirProductoComprar(producto.referencia);
}

export function AbrirDescripcionProducto(referenciaProducto) {
  const producto = productosCargados.find(p => p.referencia === referenciaProducto);
  if (!producto) {
    alert("Producto no encontrado");
    return;
  }

  const descripcionModal = document.getElementById('descripcionProducto');
  document.getElementById("nombreProducto").textContent = producto.nombre;
  document.getElementById("descripcionProductoTexto").textContent = producto.descripcion || "Sin descripción disponible.";
  if (descripcionModal) {
    descripcionModal.style.display = "flex";
  }
}

export function AbrirProductoComprar(referenciaProducto) {
  const producto = productosCargados.find(p => p.referencia === referenciaProducto);
  if (!producto) {
    alert("Producto no encontrado");
    return;
  }

  colorSeleccionado = null;
  estampadoSeleccionado = null;

  const modalProducto = document.getElementById('modalProducto');
  document.getElementById("modal-nombre").textContent = producto.nombre;
  document.getElementById("modal-referencia").textContent = producto.referencia;
  document.getElementById("modal-precio").textContent = `$${producto.precio.toLocaleString('es-CO')}`;

  // === ESTAMPADOS ===
  const contenedorEstampados = document.getElementById("modal-estampados");
  contenedorEstampados.innerHTML = "";
  (producto.estampados || []).forEach((est, index) => {
    const img = document.createElement("img");
    img.src = est.publicUrl;
    img.alt = est.codigo || '';
    img.title = est.codigo || '';
    img.classList.add("estampado-img", "estampado-option");
    img.addEventListener("click", () => {
      document.querySelectorAll(".color-option").forEach(o => o.classList.remove("selected"));
      document.querySelectorAll(".estampado-option").forEach(o => o.classList.remove("selected"));
      img.classList.add("selected");
      estampadoSeleccionado = est;
      colorSeleccionado = null;
      cargarImagenesSegunSeleccion(producto);
    });
    contenedorEstampados.appendChild(img);

    if (index === 0 && (!producto.colores || producto.colores.length === 0)) {
      img.classList.add("selected");
      estampadoSeleccionado = est;
    }
  });

  // === COLORES ===
  const contenedorColores = document.getElementById("modal-colores");
  contenedorColores.innerHTML = "";
  (producto.colores || []).forEach((color, index) => {
    const img = document.createElement("img");
    img.src = color.publicUrl;
    img.alt = color.codigo || '';
    img.title = color.codigo || '';
    img.classList.add("color-img", "color-option");
    img.addEventListener("click", () => {
      document.querySelectorAll(".color-option").forEach(o => o.classList.remove("selected"));
      document.querySelectorAll(".estampado-option").forEach(o => o.classList.remove("selected"));
      img.classList.add("selected");
      colorSeleccionado = color;
      estampadoSeleccionado = null;
      cargarImagenesSegunSeleccion(producto);
    });
    contenedorColores.appendChild(img);

    if (index === 0) {
      img.classList.add("selected");
      colorSeleccionado = color;
    }
  });

  cargarImagenesSegunSeleccion(producto);

  // === TALLAS ===
  const contenedorTallas = document.getElementById("modal-tallas");
  contenedorTallas.innerHTML = "";
  const tallasDisponibles = Object.entries(producto.tallas || {})
    .filter(([_, cantidad]) => cantidad > 0)
    .map(([talla]) => talla);

  if (tallasDisponibles.length > 0) {
    tallasDisponibles.forEach(talla => {
      const btn = document.createElement("button");
      btn.textContent = talla;
      btn.classList.add("talla-btn");
      btn.addEventListener("click", () => {
        document.querySelectorAll(".talla-btn").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
      });
      contenedorTallas.appendChild(btn);
    });
  } else {
    contenedorTallas.textContent = "No disponibles";
  }

  const increment = document.getElementById("increment");
  const decrement = document.getElementById("decrement");
  const cantidadDisplay = document.getElementById("cantidad");
  count = 0;
  if (cantidadDisplay) cantidadDisplay.textContent = count;

  if (increment) increment.onclick = () => {
    count++;
    cantidadDisplay.textContent = count;
  };
  if (decrement) decrement.onclick = () => {
    if (count > 0) {
      count--;
      cantidadDisplay.textContent = count;
    }
  };

  const btnOpenDescripcion = document.getElementById('btnOpenDescripcion');
  if (btnOpenDescripcion) {
    btnOpenDescripcion.setAttribute('data-ref', producto.referencia);
    btnOpenDescripcion.onclick = () => {
      AbrirDescripcionProducto(producto.referencia);
    };
  }

  if (modalProducto) modalProducto.style.display = "block";
}

function cargarImagenesSegunSeleccion(producto) {
  if (colorSeleccionado?.imagenes?.length > 1) {
    productImages = colorSeleccionado.imagenes.slice(1);
  } else if (colorSeleccionado?.imagenes?.length === 1) {
    productImages = colorSeleccionado.imagenes;
  } else if (estampadoSeleccionado?.imagenes?.length > 1) {
    productImages = estampadoSeleccionado.imagenes.slice(1);
  } else if (estampadoSeleccionado?.imagenes?.length === 1) {
    productImages = estampadoSeleccionado.imagenes;
  } else {
    productImages = (producto.imagenes || []).slice(1);
  }

  currentImageIndex = 0;
  updateMainImageAndThumbnails();
}

function updateMainImageAndThumbnails() {
  const imagenPrincipal = document.getElementById("modal-imagen");
  const galeria = document.querySelector(".thumbnail-gallery");

  if (!imagenPrincipal || !galeria || !productImages.length) return;

  imagenPrincipal.src = productImages[currentImageIndex].publicUrl;
  galeria.innerHTML = "";

  productImages.forEach((imgObj, idx) => {
    const thumb = document.createElement("img");
    thumb.src = imgObj.publicUrl;
    thumb.classList.add("thumbnail-img");
    if (currentImageIndex === idx) thumb.classList.add("selected");

    thumb.addEventListener("click", () => {
      currentImageIndex = idx;
      imagenPrincipal.src = productImages[currentImageIndex].publicUrl;
      updateMainImageAndThumbnails();
    });

    galeria.appendChild(thumb);
  });
}

// === EVENTOS QUE DEBEN ESPERAR AL DOM ===
document.addEventListener("DOMContentLoaded", () => {
  const descripcionModal = document.getElementById('descripcionProducto');
  const btnClose = document.getElementById('btnClose');
  const btnCancelar = document.getElementById('btnCancelar');
  const btnCerrarCompra = document.getElementById('btnCerrarCompra');
  const modalProducto = document.getElementById('modalProducto');
  const prevArrow = document.querySelector('.prev-arrow');
  const nextArrow = document.querySelector('.next-arrow');

  if (btnClose) btnClose.onclick = () => descripcionModal.style.display = "none";
  if (btnCancelar) btnCancelar.onclick = () => descripcionModal.style.display = "none";
  if (btnCerrarCompra) btnCerrarCompra.onclick = () => modalProducto.style.display = "none";

  window.onclick = (event) => {
    if (event.target === descripcionModal) descripcionModal.style.display = "none";
    if (event.target === modalProducto) modalProducto.style.display = "none";
  };

  if (prevArrow) {
    prevArrow.addEventListener('click', () => {
      if (productImages.length <= 1) return;
      currentImageIndex = (currentImageIndex - 1 + productImages.length) % productImages.length;
      updateMainImageAndThumbnails();
    });
  }

  if (nextArrow) {
    nextArrow.addEventListener('click', () => {
      if (productImages.length <= 1) return;
      currentImageIndex = (currentImageIndex + 1) % productImages.length;
      updateMainImageAndThumbnails();
    });
  }

  const btnSeguirComprando = document.querySelector(".btnSeguirComprando");
  if (btnSeguirComprando) {
    btnSeguirComprando.addEventListener("click", () => {
      const tallaSeleccionada = document.querySelector(".talla-btn.selected");
      if (tallaSeleccionada) tallaSeleccionada.classList.remove("selected");
      const cantidadDisplay = document.getElementById("cantidad");
      if (cantidadDisplay) {
        count = 0;
        cantidadDisplay.textContent = count;
      }
    });
  }
});
