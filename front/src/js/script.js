// Lista de productos de ejemplo (debes definirla o importarla)
const productos = [
  // Ejemplo: { nombre: 'Producto 1', imagen: 'img1.jpg', precio: 100 }
];

// Función para cargar productos en el carrusel (debes definirla)
// Cargar productos en el carrusel

// Mostrar/ocultar categorías
function toggleCategorias() {
  const elContenedor = document.getElementById('categorias');
  if (elContenedor) {
    elContenedor.classList.toggle('mostrar');
  } else {
    console.error("No se encontró el contenedor de categorías.");
  }
}

// Llenar opciones en un select
function llenarSelect(id, opciones) {
  const select = document.getElementById(id);
  select.innerHTML = "";
  opciones.forEach(opcion => {
    const opt = document.createElement("option");
    opt.value = opcion;
    opt.textContent = opcion;
    select.appendChild(opt);
  });
}

// Modal de inicio de sesión
function iniciarModalLogin() {
  const openModalBtn = document.getElementById('openModalBtn');
  const loginModal = document.getElementById('loginModal');
  const closeModalBtn = document.getElementById('closeModalBtn');

  if (openModalBtn && loginModal && closeModalBtn) {
    openModalBtn.addEventListener('click', () => {
      loginModal.style.display = 'flex';
    });

    closeModalBtn.addEventListener('click', () => {
      loginModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
      if (event.target === loginModal) {
        loginModal.style.display = 'none';
      }
    });
  }
}

// Flechas en scroll de categorías
function iniciarScrollCategorias() {
  const scrollContainer = document.querySelector('.categorias');
  const leftArrow = document.querySelector('.flecha-izquierda');
  const rightArrow = document.querySelector('.flecha-derecha');

  function actualizarVisibilidadFlechas() {
    const scrollWidth = scrollContainer.scrollWidth;
    const clientWidth = scrollContainer.clientWidth;
    const scrollLeft = scrollContainer.scrollLeft;

    const hayOverflow = scrollWidth > clientWidth;

    leftArrow.style.display = (hayOverflow && scrollLeft > 0) ? 'block' : 'none';
    rightArrow.style.display = (hayOverflow && scrollLeft + clientWidth < scrollWidth - 1) ? 'block' : 'none';
  }

  scrollContainer.addEventListener('scroll', actualizarVisibilidadFlechas);
  window.addEventListener('resize', actualizarVisibilidadFlechas);

  leftArrow.addEventListener('click', () => {
    scrollContainer.scrollBy({ left: -150, behavior: 'smooth' });
  });

  rightArrow.addEventListener('click', () => {
    scrollContainer.scrollBy({ left: 150, behavior: 'smooth' });
  });

  actualizarVisibilidadFlechas();
}

// Inicializar todo al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  cargarCarrusel(productos);
  iniciarCarrusel();
  iniciarModalLogin();
  iniciarScrollCategorias();
});