console.log('script.js cargado correctamente');
document.getElementById('search').addEventListener('input', function() {
    const searchQuery = this.value.toLowerCase();
    const productos = document.querySelectorAll('.producto');
    
    for (const producto of productos) {
        const productName = producto.querySelector('p').textContent.toLowerCase();
        if (productName.includes(searchQuery)) {
            producto.style.display = 'inline-block';
        } else {
            producto.style.display = 'none';
        }
    }
});

// Cargar el carrito desde localStorage al iniciar
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Función para guardar el carrito en localStorage
function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Función para agregar productos al carrito con cantidad
function agregarAlCarrito(nombre, precio) {
    const cantidadInput = document.getElementById(`cantidad-${nombre}`);
    const cantidad = parseInt(cantidadInput.value) || 1; // Obtiene la cantidad, por defecto 1
    const productoExistente = carrito.find(item => item.nombre === nombre);

    if (productoExistente) {
        productoExistente.cantidad += cantidad; // Incrementa la cantidad existente
    } else {
        carrito.push({ nombre, precio, cantidad }); // Agrega un nuevo producto
    }
    guardarCarrito(); // Actualiza el carrito en localStorage
    actualizarCarrito(); // Asegúrate de actualizar la UI también
}

// Función para quitar productos del carrito
function quitarDelCarrito(nombre) {
    carrito = carrito.filter(item => item.nombre !== nombre); // Elimina el producto del carrito
    guardarCarrito(); // Actualiza el carrito en localStorage
    actualizarCarrito();
}

// Función para actualizar la visualización del carrito
function actualizarCarrito() {
    const itemsCarrito = document.getElementById('itemsCarrito');
    const totalElement = document.getElementById('total');
    itemsCarrito.innerHTML = ''; // Limpia el contenido actual
    let total = 0;

    carrito.forEach(item => {
        total += item.precio * item.cantidad;
        itemsCarrito.innerHTML += `
            <div>
                <span>${item.nombre} (x${item.cantidad}) - $${item.precio * item.cantidad}</span>
                <button onclick="quitarDelCarrito('${item.nombre}')">Quitar</button>
            </div>
        `;
    });

    totalElement.innerText = `Total: $${total}`;
}

// Delegación de eventos para manejar dinámicamente los productos
document.body.addEventListener("click", function (event) {
    if (event.target.classList.contains("agregar-carrito")) {
        let producto = event.target.closest(".producto");
        if (producto) {
            let nombre = producto.querySelector("p").textContent;
            let precio = parseFloat(producto.getAttribute("data-precio"));
            let cantidad = parseInt(producto.querySelector(".cantidad").value) || 1;

            agregarAlCarrito(nombre, precio, cantidad);
        }
    }

    if (event.target.classList.contains("eliminar")) {
        let index = event.target.getAttribute("data-index");
        carrito.splice(index, 1);
        actualizarCarrito();
    }

    if (event.target.id === "finalizar-compra") {
        finalizarCompra();
    }
});

const numero = '5492324475640';

function finalizarCompra() {
    const localidad = document.getElementById('localidad').value;
    if (!localidad) {
        alert('Por favor, ingresa tu localidad.');
        return;
    }

    if (carrito.length === 0) {
        alert('El carrito está vacío.');
        return;
    }

    let numeroPedido = parseInt(localStorage.getItem('numeroPedido')) || 1;
    localStorage.setItem('numeroPedido', numeroPedido + 1);

    const now = new Date();
    const fecha = now.toLocaleDateString('es-AR');
    const hora = now.toLocaleTimeString('es-AR');

    let mensaje = `Hola, quiero realizar el siguiente pedido:\n`;
    mensaje += `Número de Pedido: ${numeroPedido}\n`;
    mensaje += `Fecha y Hora: ${fecha} ${hora}\n\n`;

    carrito.forEach(item => {
        mensaje += `- ${item.nombre} (x${item.cantidad}): $${item.precio * item.cantidad}\n`;
    });

    const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    mensaje += `\nTotal: $${total}\n`;
    mensaje += `Localidad: ${localidad}`;

    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    window.location.href = url;
}
// Obtener el botón
let mybutton = document.getElementById("backToTop");

// Mostrar el botón cuando el usuario se desplace hacia abajo 100px
window.onscroll = function() {
  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
};

// Función para desplazar suavemente hasta la parte superior
function smoothScrollToTop(duration) {
  const start = document.documentElement.scrollTop || document.body.scrollTop;
  const change = -start;  // La diferencia es la cantidad de desplazamiento hacia arriba
  let startTime = null;

  function animateScroll(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = timestamp - startTime;
    const increment = easeInOutQuad(progress, start, change, duration);

    document.documentElement.scrollTop = increment; // Desplazamiento de la página
    document.body.scrollTop = increment; // En caso de que scrollTop no funcione en algunos navegadores

    if (progress < duration) {
      requestAnimationFrame(animateScroll);
    } else {
      document.documentElement.scrollTop = 0; // Asegura que se llegue al destino final
      document.body.scrollTop = 0;
    }
  }

  function easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(animateScroll);
}

// Al hacer clic, regresar al inicio de la página con desplazamiento suave
mybutton.onclick = function() {
  smoothScrollToTop(1000); // 1000ms (1 segundo) para el desplazamiento suave
};
