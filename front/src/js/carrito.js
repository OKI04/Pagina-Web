// carrito.js
// ===============================
// Módulo para manejar carrito de compras y cotización
// ===============================

const modalCarrito = document.getElementById("modalCarrito");
const modalCotizacion = document.getElementById("modalCotizacion");

const btnCerrarCarrito = document.getElementById("btnCerrarCarrito");
const btnCotizar = document.getElementById("btnCotizar");
const btnCerrarCotizacion = document.getElementById("btnCerrarCotizacion");
const btnEnviarCotizacion = document.getElementById("btnEnviarCotizacion");

const cartItemsContainer = document.getElementById("cart-items");
const totalPago = document.getElementById("total-pago");
const totalPagoFinal = document.getElementById("total-pagoFinal");

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// =======================
// Funciones principales
// =======================

export function agregarAlCarrito(producto) {
  carrito.push(producto);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  renderizarCarrito();
}

// Mostrar u ocultar modal del carrito
function toggleCarrito() {
  modalCarrito.classList.toggle("activo");
}

// Mostrar modal de cotización
function abrirCotizacion() {
  modalCotizacion.classList.add("activo");
  renderizarCotizacion();
}

// Cerrar modal de cotización
function cerrarCotizacion() {
  modalCotizacion.classList.remove("activo");
}

// Eliminar producto del carrito
function eliminarProducto(index) {
  carrito.splice(index, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  renderizarCarrito();
}

// =======================
// Renderizar Carrito
// =======================
function renderizarCarrito() {
  cartItemsContainer.innerHTML = "";

  if (carrito.length === 0) {
    cartItemsContainer.innerHTML = "<p>Tu carrito está vacío.</p>";
    totalPago.textContent = "0";
    return;
  }

  let total = 0;

  carrito.forEach((producto, index) => {
    const item = document.createElement("div");
    item.classList.add("carrito-item");
    item.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}" class="imagen-carrito">
      <div class="info-carrito">
        <p><strong>${producto.nombre}</strong></p>
        <p>Color: ${producto.color}</p>
        <p>Talla: ${producto.talla}</p>
        <p>Cantidad: ${producto.cantidad}</p>
        <p>Precio: $${producto.precio}</p>
      </div>
      <button class="btn-eliminar" data-index="${index}">X</button>
    `;
    cartItemsContainer.appendChild(item);
    total += producto.precio * producto.cantidad;
  });

  totalPago.textContent = total;
}

// =======================
// Renderizar Cotización
// =======================
function renderizarCotizacion() {
  const lista = modalCotizacion.querySelector(".product-list");
  lista.innerHTML = "";

  let total = 0;

  carrito.forEach((producto) => {
    const li = document.createElement("li");
    li.classList.add("product-item");
    li.innerHTML = `
      <div class="product-info">
        <span class="product-info-main">${producto.nombre} - ${producto.color} - ${producto.talla} - Cant: ${producto.cantidad}</span>
      </div>
    `;
    lista.appendChild(li);
    total += producto.precio * producto.cantidad;
  });

  totalPagoFinal.textContent = total;
}

// =======================
// Enviar Cotización por WhatsApp
// =======================
function enviarCotizacion() {
  const nombre = document.getElementById("nombre").value;
  const empresa = document.getElementById("empresa").value;
  const direccion = document.getElementById("direccion").value;
  const telefono = document.getElementById("telefono").value;
  const correo = document.getElementById("correo").value;

  if (!nombre || !telefono || !correo) {
    alert("Por favor, completa los campos obligatorios.");
    return;
  }

  let mensaje = `👋 Hola, quiero una cotización:\n\n`;

  carrito.forEach((producto) => {
    mensaje += `🛍️ ${producto.nombre} | Color: ${producto.color} | Talla: ${producto.talla} | Cant: ${producto.cantidad} | Precio: $${producto.precio}\n`;
  });

  mensaje += `\n💵 Total: $${totalPagoFinal.textContent}`;
  mensaje += `\n\n📄 Datos del cliente:\nNombre: ${nombre}\nEmpresa: ${empresa}\nDirección: ${direccion}\nTel: ${telefono}\nCorreo: ${correo}`;

  const numero = "573001112222"; // <-- Cambia por tu número
  const whatsappURL = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
  window.open(whatsappURL, "_blank");
}

// =======================
// Listeners
// =======================
btnCerrarCarrito.addEventListener("click", toggleCarrito);
btnCotizar.addEventListener("click", abrirCotizacion);
btnCerrarCotizacion.addEventListener("click", cerrarCotizacion);
btnEnviarCotizacion.addEventListener("click", enviarCotizacion);

// Delegar eliminación de producto
cartItemsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-eliminar")) {
    const index = e.target.dataset.index;
    eliminarProducto(index);
  }
});

// =======================
// Inicialización
// =======================
renderizarCarrito();
