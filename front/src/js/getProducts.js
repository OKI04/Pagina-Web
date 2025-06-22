document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
  });

  let productosCargados = [];

  async function loadProducts() {
    try {
      const res = await fetch('/admin/products/all', {
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
        const imagenesNorm = (prod.imagenes || []).map(img => {
          const rutaLimpia = img.url.replace(/\\/g, "/");
          return {
            ...img,
            url: rutaLimpia,
            publicUrl: `/` + rutaLimpia  // ← Usa una ruta relativa
          };
        });

        return {
          ...prod,
          imagenes: imagenesNorm
        };
      });

      const loader = document.getElementById('spanLoader');
      if (loader) loader.remove();

      renderProductos(productosCargados);

    } catch (error) {
      console.error('Error en loadProducts:', error);
      alert('Error de conexión al cargar productos');
    }
  }

  function renderProductos(productos) {
    const contenedor = document.querySelector('.main-products');
    if (!contenedor) return;

    productos.forEach(producto => {
      const div = document.createElement('div');
      div.classList.add('producto');

      const img = document.createElement('img');
      img.src = producto.imagenes?.[0]?.publicUrl || '';
      img.alt = producto.nombre;
      img.style.width = '120px';
      img.style.height = '120px';
      img.style.objectFit = 'cover';

      const nombre = document.createElement('h3');
      nombre.textContent = producto.nombre;

      const precio = document.createElement('p');
      precio.textContent = `$${producto.precio}`;

      div.appendChild(img);
      div.appendChild(nombre);
      div.appendChild(precio);

      contenedor.appendChild(div);
    });
  }
