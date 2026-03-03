// --- LOGICA DEL CARRUSEL ---
let slideIndex = 0;
let carouselTimer;

function initCarousel() {
  const slides = document.querySelectorAll('.carousel-slide');
  if (slides.length > 0) {
    showSlide(0);
    carouselTimer = setInterval(() => moveSlide(1), 3000); // Cambia cada 3 segundos
  }
}

function showSlide(n) {
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.dot');
  
  if (slides.length === 0) return;

  if (n >= slides.length) { slideIndex = 0; }
  else if (n < 0) { slideIndex = slides.length - 1; }
  else { slideIndex = n; }

  slides.forEach(slide => slide.style.display = 'none');
  dots.forEach(dot => dot.classList.remove('active'));

  slides[slideIndex].style.display = 'flex';
  dots[slideIndex].classList.add('active');
}

function moveSlide(n) {
  clearInterval(carouselTimer);
  showSlide(slideIndex + n);
  carouselTimer = setInterval(() => moveSlide(1), 3000);
}

function currentSlide(n) {
  clearInterval(carouselTimer);
  showSlide(n);
  carouselTimer = setInterval(() => moveSlide(1), 3000);
}


// --- LOGICA DEL CARRITO ---
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function agregarProducto(nombre, precio) {
  // Buscar si el producto ya existe
  const productoExistente = carrito.find(item => item.nombre === nombre);

  if (productoExistente) {
    productoExistente.cantidad++;
  } else {
    carrito.push({ nombre: nombre, precio: precio, cantidad: 1 });
  }

  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarContador();
  alert(`Se ha agregado ${nombre} al carrito`);
}

function actualizarContador() {
  let contador = document.getElementById("contador");
  if (contador) {
    // Contar el total de items (suma de las cantidades)
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    contador.textContent = totalItems;
  }
}

function modificarCantidad(index, delta) {
  if (carrito[index]) {
    carrito[index].cantidad += delta;
    if (carrito[index].cantidad <= 0) {
      carrito.splice(index, 1);
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContador();
    mostrarCarrito();
  }
}

function mostrarCarrito() {
  let lista = document.getElementById("listaCarrito");
  let totalContainer = document.getElementById("totalContainer");
  let totalSpan = document.getElementById("total");

  if (!lista) return;

  lista.innerHTML = "";
  let totalPrecio = 0;

  if (carrito.length === 0) {
    lista.innerHTML = "<p style='text-align:center; padding: 20px; color:#666;'>Tu carrito está vacío</p>";
    if (totalContainer) totalContainer.style.display = 'none';
  } else {
    if (totalContainer) totalContainer.style.display = 'block';

    carrito.forEach((item, index) => {
      const subtotal = item.precio * item.cantidad;
      totalPrecio += subtotal;

      let divItem = document.createElement("div");
      divItem.className = "cart-item";
      
      divItem.innerHTML = `
        <div style="flex: 2;">
          <strong>${item.nombre}</strong><br>
          <span style="color:#00a650; font-size:12px;">Envío gratis</span>
        </div>
        <div style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 10px;">
          <button onclick="modificarCantidad(${index}, -1)" style="width: 25px; height: 25px; border-radius: 50%; border: 1px solid #ccc; background: white; cursor: pointer;">-</button>
          <span>${item.cantidad}</span>
          <button onclick="modificarCantidad(${index}, 1)" style="width: 25px; height: 25px; border-radius: 50%; border: 1px solid #ccc; background: white; cursor: pointer;">+</button>
        </div>
        <div style="flex: 1; text-align: right;">
          <span style="font-size: 18px;">$ ${subtotal}</span>
        </div>
      `;
      lista.appendChild(divItem);
    });
  }

  if (totalSpan) totalSpan.textContent = totalPrecio;
}

function vaciarCarrito() {
  carrito = [];
  localStorage.removeItem('carrito');
  actualizarContador();
  mostrarCarrito();
}

function enviarPedidoWhatsApp() {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  let numeroWhatsApp = "573206046793"; 
  let mensaje = "Hola, me gustaría realizar el siguiente pedido:%0A%0A";
  let total = 0;

  carrito.forEach(item => {
    let subtotal = item.precio * item.cantidad;
    mensaje += `- ${item.cantidad}x ${item.nombre}: $${subtotal}%0A`;
    total += subtotal;
  });

  mensaje += `%0A*Total: $${total}*`;

  window.open(`https://wa.me/${numeroWhatsApp}?text=${mensaje}`, '_blank');
}

// Ejecutar al cargar
document.addEventListener('DOMContentLoaded', () => {
  actualizarContador();
  mostrarCarrito();
  initCarousel();
});