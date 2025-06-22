document.addEventListener("DOMContentLoaded", () => {
  const btnAbrirCarrito = document.getElementById("abrirCarrito");
  const btnCerrarCarrito = document.getElementById("btnCerrarCarrito");
  const modal = document.getElementById("modalCarrito");

  btnAbrirCarrito?.addEventListener("click", toggleCarrito);
  btnCerrarCarrito?.addEventListener("click", toggleCarrito);

  function toggleCarrito() {
    modal.classList.toggle("show");
    renderCarrito(); // Asegúrate que esta función exista
  }

  function renderCarrito() {
    // Aquí va tu lógica para renderizar productos
    console.log("Carrito renderizado.");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const btnAbrirModal = document.getElementById("btnCotizar");
  const modalCotizacion = document.getElementById("modalCotizacion");
  const btnCerrarModal = document.getElementById("btnCerrarCotizacion");

  // Mostrar modal al hacer clic en el botón
  btnAbrirModal?.addEventListener("click", () => {
    modalCotizacion.style.display = "flex";
    document.body.style.overflow = "hidden";
  });

  // Cerrar al hacer clic en el botón "X"
  btnCerrarModal?.addEventListener("click", () => {
    modalCotizacion.style.display = "none";
    document.body.style.overflow = "auto";
  });

  // Cerrar si se hace clic fuera del modal
  window.addEventListener("click", (event) => {
    if (event.target === modalCotizacion) {
      modalCotizacion.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });
});
