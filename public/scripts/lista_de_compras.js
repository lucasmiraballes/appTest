var listaProductos = [];

function agregarProducto() {
  var producto = document.getElementById("producto").value;

  if (producto === "") {
    mostrarMensaje("Ingrese un nombre de producto", "error");
    return;
  }

  var nuevoProducto = {
    nombre: producto,
    precio: 0, // Precio inicial por defecto
    cantidad: 1,
    tachado: false // Nuevo atributo para indicar si está tachado o no
  };

  listaProductos.push(nuevoProducto);
  actualizarListaProductos();
  actualizarTotal();

  mostrarMensaje("Producto agregado correctamente", "success");

  // Limpiar el campo después de agregar el producto
  document.getElementById("producto").value = "";
}

document.getElementById("producto").addEventListener("keyup", function(event) {
    // Verifica si la tecla presionada es "Enter" (código 13)
    if (event.keyCode === 13) {
      // Llama a la función agregarProducto() si la tecla es "Enter"
      agregarProducto();
    }
  });

function actualizarListaProductos() {
    var listaProductosElement = document.getElementById("listaProductos");
    listaProductosElement.innerHTML = "";
  
    listaProductos.forEach(function(producto, index) {
      var nuevoProducto = document.createElement("li");
      nuevoProducto.innerHTML = `
      <button class="btn-eliminar" onclick="eliminarProducto(${index})"><i class="fa fa-trash-o"></i></button>
        <span class="${producto.tachado ? 'tachado' : ''}">
          <span class="prod-name">${producto.nombre}</span> - $<span class="precio" id="precio-${index}" contenteditable 
            oninput="actualizarPrecio(${index}, this.innerText)">${producto.precio.toFixed(2)}</span> 
          <input type="number" value="${producto.cantidad}" min="1" class="input-cantidad"
            onchange="actualizarCantidad(${index}, this.value)">
          <button class="aum" onclick="incrementarCantidad(${index})">+</button>
          <button class="decr" onclick="decrementarCantidad(${index})">-</button>
          <button class="btn-prod" onclick="tacharProducto(${index})">&#10004;</button>
        </span>
      `;
      listaProductosElement.appendChild(nuevoProducto);
    });
  }
  

function actualizarPrecio(index, nuevoPrecio) {
  listaProductos[index].precio = parseFloat(nuevoPrecio) || 0;
  actualizarTotal();
}

function actualizarCantidad(index, cantidad) {
  listaProductos[index].cantidad = parseInt(cantidad) || 1;
  actualizarTotal();
}

function incrementarCantidad(index) {
  listaProductos[index].cantidad++;
  actualizarListaProductos();
  actualizarTotal();
}

function decrementarCantidad(index) {
  if (listaProductos[index].cantidad > 1) {
    listaProductos[index].cantidad--;
    actualizarListaProductos();
    actualizarTotal();
  }
}

function tacharProducto(index) {
  listaProductos[index].tachado = !listaProductos[index].tachado;
  actualizarListaProductos();
  actualizarTotal();
}

function eliminarProducto(index) {
    listaProductos.splice(index, 1);
    actualizarListaProductos();
    actualizarTotal();
  }

function actualizarTotal() {
  var totalElement = document.getElementById("total");
  var total = listaProductos.reduce(function(acc, producto) {
    return acc + producto.precio * producto.cantidad;
  }, 0);
  totalElement.innerText = `Total: $${total.toFixed(2)}`;
}

function mostrarMensaje(mensaje, tipo) {
  var mensajeElement = document.getElementById("mensaje");
  mensajeElement.innerText = mensaje;
  mensajeElement.className = tipo;
  mensajeElement.style.display = "block";

  setTimeout(function() {
    mensajeElement.style.display = "none";
  }, 3000);
}

