let productosCargados = [];

  // Función para renderizar productos en el DOM
  function renderProductos(productos) {
    const contenedor = document.querySelector('.main-products');
    if (!contenedor) return;

    productos.forEach(producto => {
      const div = document.createElement('div');
      div.classList.add('producto');

      // Imagen principal
      const img = document.createElement('img');
      img.src = producto.imagenes?.[0]?.publicUrl || '';
      img.alt = producto.nombre;
      img.style.width = '120px'; // Tamaño pequeño
      img.style.height = '120px';
      img.style.objectFit = 'cover';

      // Nombre y precio
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

  // Función para cargar productos desde el backend
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

      const baseApiUrl = import.meta.env.VITE_BACKEND_URL;
      const productos = await res.json();

      productosCargados = productos.map(prod => {
        const imagenesNorm = (prod.imagenes || []).map(img => {
          const rutaLimpia = img.url.replace(/\\/g, "/");
          return {
            ...img,
            url: rutaLimpia,
            publicUrl: `${baseApiUrl}/${rutaLimpia}`
          };
        });

        const coloresNorm = (prod.colores || []).map(color => {
          const imagenesColor = (color.imagenes || []).map(img => {
            const rutaLimpia = img.url.replace(/\\/g, "/");
            return {
              ...img,
              url: rutaLimpia,
              publicUrl: `${baseApiUrl}/${rutaLimpia}`
            };
          });

          return {
            ...color,
            imagenes: imagenesColor,
            publicUrl: imagenesColor[0]?.publicUrl || ''
          };
        });

        const estampadosNorm = (prod.estampados || []).map(estampado => {
          const imagenesEst = (estampado.imagenes || []).map(img => {
            const rutaLimpia = img.url.replace(/\\/g, "/");
            return {
              ...img,
              url: rutaLimpia,
              publicUrl: `${baseApiUrl}/${rutaLimpia}`
            };
          });

          return {
            ...estampado,
            imagenes: imagenesEst,
            publicUrl: imagenesEst[0]?.publicUrl || ''
          };
        });

        return {
          ...prod,
          imagenes: imagenesNorm,
          colores: coloresNorm,
          estampados: estampadosNorm
        };
      });

      // Eliminar loader
      const loader = document.getElementById('spanLoader');
      if (loader) loader.remove();

      // Renderizar productos
      renderProductos(productosCargados);

    } catch (error) {
      console.error('Error en loadProducts:', error);
      alert('Error de conexión al cargar productos');
    }
  }

  // Ejecutar cuando el DOM esté listo
  document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
  });