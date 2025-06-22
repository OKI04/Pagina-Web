// -----------------------------
// DETECTAR CLIC FUERA DE LOS MODALES (Error, Producto, Confirmación, Carrito)
// -----------------------------
window.addEventListener("click", function(event) {
  const modalError = document.getElementById("modalError");
  const modalConfirmacion = document.getElementById('modalConfirmacion');
  const modalProducto = document.getElementById('modalProducto');
  const modalCarrito = document.getElementById("modalCarrito");

  if (event.target === modalError) {
    modalError.style.display = "none";
  }

  if (event.target === modalConfirmacion) {
    cerrarModal();
  }

  if (event.target === modalProducto) {
    modalProducto.style.display = 'none';
  }

  if (event.target === modalCarrito) {
    modalCarrito.style.display = "none";
  }
});

// -----------------------------
// FUNCIÓN PARA MOSTRAR/OCULTAR EL CARRITO
// -----------------------------
function toggleCarrito() {
  const modal = document.getElementById("modalCarrito");
  modal.classList.toggle("show"); // Alterna la clase 'show' para mostrar u ocultar el modal
  renderCarrito(); // Renderiza el contenido del carrito al mostrarlo
}


// -----------------------------
// ARREGLO PARA GUARDAR PRODUCTOS EN EL CARRITO
// -----------------------------
let carrito = [];

// -----------------------------
// FUNCIÓN PARA AGREGAR PRODUCTOS AL CARRITO
// -----------------------------
function AgregarCarro() {
  const nombre = document.getElementById("modal-nombre").textContent;

  const colorSeleccionado = document.querySelector('.color-option.selected');
  const colorCodigo = colorSeleccionado?.title || null;
  const colorNombre = colorSeleccionado?.alt || 'Sin seleccionar';

  const estampadoSeleccionado = document.querySelector('.estampado-option.selected');
  const estampadoCodigo = estampadoSeleccionado?.title || null;
  const estampadoNombre = estampadoSeleccionado?.alt || 'Sin seleccionar';

  const tallaSeleccionada = document.querySelector('.talla-btn.selected');
  const talla = tallaSeleccionada ? tallaSeleccionada.textContent : null;

  const cantidad = parseInt(document.getElementById("cantidad").textContent);

  if (!talla) {
    mostrarErrorModal("Por favor selecciona una talla antes de continuar.");
    return;
  }

  if (isNaN(cantidad) || cantidad < 1) {
    mostrarErrorModal("Por favor ingresa una cantidad válida (mínimo 1).");
    return;
  }

  const precioTexto = document.getElementById("modal-precio").textContent.replace(/[^\d]/g, '');
  const precio = parseInt(precioTexto);
  const total = precio * cantidad;

  const referencia = document.getElementById("modal-referencia").textContent;
  const producto = productosCargados.find(p => p.referencia === referencia);

  let imagenProducto = "src/Imagen_De_Apoyo/producto.png";

  if (estampadoCodigo && producto?.estampados?.length > 0) {
    const est = producto.estampados.find(e => e.codigo === estampadoCodigo);
    if (est?.imagenes?.length > 1) {
      imagenProducto = est.imagenes[1].publicUrl;
    } else if (est?.imagenes?.length > 0) {
      imagenProducto = est.imagenes[0].publicUrl;
    }
  } else if (colorCodigo && producto?.colores?.length > 0) {
    const col = producto.colores.find(c => c.codigo === colorCodigo);
    if (col?.imagenes?.length > 1) {
      imagenProducto = col.imagenes[1].publicUrl;
    } else if (col?.imagenes?.length > 0) {
      imagenProducto = col.imagenes[0].publicUrl;
    }
  } else if (producto?.imagenes?.length > 0) {
    imagenProducto = producto.imagenes.length > 1 ? producto.imagenes[1].publicUrl : producto.imagenes[0].publicUrl;
  }

  carrito.push({
    nombre,
    referencia,
    color: colorNombre,
    colorCodigo,
    estampado: estampadoNombre,
    estampadoCodigo,
    talla,
    cantidad,
    precio,
    total,
    imagen: imagenProducto
  });

  actualizarContadorCarrito();

  const modalCarrito = document.getElementById("modalCarrito");
  if (modalCarrito.classList.contains("show")) {
    renderCarrito();
  }

  document.getElementById('modalConfirmacion').style.display = 'block';
}

// -----------------------------
// FUNCIÓN PARA CERRAR MODAL DE CONFIRMACIÓN
// -----------------------------
function cerrarModal() {
  document.getElementById('modalConfirmacion').style.display = 'none';
}

// -----------------------------
// FUNCIÓN PARA ELIMINAR UN PRODUCTO DEL CARRITO
// -----------------------------
function eliminarItem(index) {
  carrito.splice(index, 1);
  renderCarrito();
  actualizarContadorCarrito();
}

// -----------------------------
// FUNCIÓN PARA RENDERIZAR EL CARRITO
// -----------------------------
function renderCarrito() {
  const cartItems = document.getElementById("cart-items");
  const totalPago = document.getElementById("total-pago");

  cartItems.innerHTML = "";
  let total = 0;

  carrito.forEach((item, index) => {
    const itemHTML = `
      <div class="cart-item">
        <img src="${item.imagen}" alt="producto" class="cart-img" style="width: 80px; height: auto; object-fit: contain;" />
        <div class="cart-item-info">
          <h3>${item.nombre}</h3>
          <p>Color: ${item.color !== 'Sin seleccionar' ? item.color : item.estampado || 'Sin seleccionar'}</p>
          <p>Talla: ${item.talla}</p>
          <p>Cantidad: ${item.cantidad} un.</p>
          <p class="cart-item-total">Total producto: $${item.total.toLocaleString("es-CO")}</p>
        </div>
        <button class="delete-item" onclick="eliminarItem(${index})">X</button>
      </div>
    `;
    cartItems.innerHTML += itemHTML;
    total += item.total;
  });

  totalPago.textContent = total.toLocaleString("es-CO");
}

// -----------------------------
// FUNCIÓN PARA ACTUALIZAR CONTADOR DEL CARRITO
// -----------------------------
function actualizarContadorCarrito() {
  const contador = document.getElementById("cart-count");
  contador.textContent = carrito.length;
  contador.style.display = carrito.length > 0 ? "inline-block" : "none";
}

// -----------------------------
// BOTÓN DE CIERRE CARRITO
// -----------------------------
const modalCarrito = document.getElementById("modalCarrito");
const btnCerrarCarrito = document.getElementById("btnCerrarCarrito");
btnCerrarCarrito.onclick = () => modalCarrito.style.display = "none";

// -----------------------------
// ABRIR CARRITO DESDE BOTÓN
// -----------------------------
document.getElementById("btnAgregarCarrito").addEventListener("click", () => {
  const nombre = document.getElementById("modal-nombre").textContent;
  const precio = parseInt(document.getElementById("modal-precio").textContent.replace(/[^\d]/g, ''));
  const cantidad = parseInt(document.getElementById("cantidad").textContent);
  
  let imagenUrl = "";
  let codigo = "";

  if (colorSeleccionado) {
    imagenUrl = colorSeleccionado.imagenes?.[0]?.publicUrl || "";
    codigo = colorSeleccionado.codigo || "Sin código";
  } else if (estampadoSeleccionado) {
    imagenUrl = estampadoSeleccionado.imagenes?.[0]?.publicUrl || "";
    codigo = estampadoSeleccionado.codigo || "Sin código";
  }

  const total = precio * cantidad;

  document.getElementById("carrito-nombre").textContent = nombre;
  document.getElementById("carrito-codigo").textContent = codigo;
  document.getElementById("carrito-cantidad").textContent = cantidad;
  document.getElementById("carrito-total").textContent = total.toLocaleString('es-CO');
  document.getElementById("carrito-imagen").src = imagenUrl;

  modalCarrito.style.display = "flex";
});

// -----------------------------
// MODAL DE ERROR
// -----------------------------
function mostrarErrorModal(mensaje) {
  const modalError = document.getElementById("modalError");
  const mensajeElemento = document.getElementById("modalErrorMensaje");

  mensajeElemento.textContent = mensaje;
  modalError.style.display = "flex";
}

function cerrarModalError() {
  document.getElementById("modalError").style.display = "none";
}

document.getElementById("btnCerrarError").addEventListener("click", cerrarModalError);

// -----------------------------
// MODAL DE COTIZACION
// -----------------------------
// Mostrar el modal
function Contizacion() {
  const modal = document.getElementById("modalCotizacion");
  const lista = modal.querySelector(".product-list");

  lista.innerHTML = "";

  if (carrito.length === 0) {
    const mensajeVacio = document.createElement("li");
    mensajeVacio.classList.add("product-item");
    mensajeVacio.innerHTML = `<div class="product-info"><span>No hay productos en el carrito.</span></div>`;
    lista.appendChild(mensajeVacio);
  } else {
    carrito.forEach((item, index) => {
      const li = document.createElement("li");
      li.className = "product-item";

      li.innerHTML = `
        <div class="product-info">
          <span class="product-info-main">
            <b>${item.nombre}</b> - Ref: ${item.referencia}
          </span>
          <span class="product-subtitle">
            ${item.color !== 'Sin seleccionar' ? `Color: ${item.color}` : `Estampado: ${item.estampado}`} |
            Talla: ${item.talla} |
            Cant: ${item.cantidad} |
            Precio: $${item.precio.toLocaleString("es-CO")} |
            <b>Total: $${item.total.toLocaleString("es-CO")}</b>
          </span>
        </div>
        <button class="remove-button" onclick="eliminarProductoCotizacion(${index})">X</button>
      `;

      lista.appendChild(li);
    });
  }

  actualizarTotalPagar(); // <--- aquí se actualiza el total
  modal.style.display = "block";
}

function actualizarTotalPagar() {
  const total = carrito.reduce((suma, item) => suma + item.total, 0);
  document.getElementById("total-pagoFinal").textContent = total.toLocaleString("es-CO");
}

function eliminarProductoCotizacion(index) {
  carrito.splice(index, 1);
  renderCarrito();
  Contizacion(); // Vuelve a renderizar el modal actualizado
  actualizarContadorCarrito(); // Opcional: actualiza el contador del ícono del carrito
}


// Cerrar el modal y limpiar el formulario
function cerrarCotizacion() {
  const modal = document.getElementById("modalCotizacion");
  if (modal) {
    modal.style.display = "none";
    limpiarFormularioCotizacion();
  }
}

// Limpiar el formulario dentro del modal
function limpiarFormularioCotizacion() {
  const form = document.querySelector("#modalCotizacion .quote-form");
  if (form) {
    form.reset();
  }
}

// Eliminar un producto de la lista al hacer clic en la X
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-button")) {
    const item = event.target.closest(".product-item");
    if (item) {
      item.remove();
    }
  }
});


//Enviar cotizacion a WhatsApp
function enviarCotizacion() {
  if (carrito.length === 0) {
    alert("El carrito está vacío. Agrega productos antes de enviar la cotización.");
    return;
  }

  const nombre = document.getElementById("nombre").value.trim();
  const empresa = document.getElementById("empresa").value.trim();
  const direccion = document.getElementById("direccion").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const correo = document.getElementById("correo").value.trim();

  if (!nombre || !empresa || !direccion || !telefono || !correo) {
    alert("Por favor completa todos los campos del formulario antes de enviar la cotización.");
    return;
  }

  let mensaje = `📦 *COTIZACIÓN DE PRODUCTOS*\n\n`;
  mensaje += `👤 *Nombre:* ${nombre}\n`;
  mensaje += `🏢 *Empresa:* ${empresa}\n`;
  mensaje += `🏠 *Dirección:* ${direccion}\n`;
  mensaje += `📞 *Teléfono:* ${telefono}\n`;
  mensaje += `📧 *Correo:* ${correo}\n\n`;
  mensaje += `🛒 *Detalle de productos:*\n\n`;

  mensaje += `| Producto       | Ref        | Color/Estampado       | Talla | Cant  | Precio       | Total       |\n`;
  mensaje += `|--------------------------------------------------------------------------------------------------|\n`;

  carrito.forEach((item) => {
    const colorOEstampado = item.color !== 'Sin seleccionar' ? `Codigo Color: ${item.color}` : `Codigo Estampado: ${item.estampado}`;
    mensaje += `| ${item.nombre.padEnd(14)} | ${item.referencia.padEnd(7)} | ${colorOEstampado.padEnd(20)} | ${item.talla.padEnd(5)} | ${String(item.cantidad).padEnd(4)} | $${item.precio.toLocaleString("es-CO").padEnd(9)} | $${item.total.toLocaleString("es-CO").padEnd(9)} |\n`;
  });

  const total = carrito.reduce((sum, item) => sum + item.total, 0);
  mensaje += `\n💰 *Total a pagar:* $${total.toLocaleString("es-CO")}`;

  const mensajeCodificado = encodeURIComponent(mensaje);
  const numero = "573227534241"; // Número de WhatsApp

  const url = `https://wa.me/${numero}?text=${mensajeCodificado}`;
  window.open(url, "_blank");

  // 👉 Limpiar carrito y actualizar la UI:
  carrito = [];
  renderCarrito();
  actualizarContadorCarrito();
  cerrarCotizacion();
}

