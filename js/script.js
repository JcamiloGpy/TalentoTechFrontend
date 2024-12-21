import { api } from "./utils.js";

import "./funcionesProducto.js";


// abrir el modal
export const modal = new bootstrap.Modal("#ModalFormulario", {
  keyboard: false,
});

document.addEventListener("DOMContentLoaded", function () {
  cargarDatosProductos(); // llamado a la funcion cargarDatosCliente

  const form = document.querySelector("form");

  const { nombre, descripcion, precio, imagen, editar } = form.elements; // Destructuring: recupera los elementos del formulario

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Evita que se recargue la página

    const data = {
      nombre: nombre.value,
      descripcion:descripcion.value,
      precio: precio.value,
      imagen: imagen.value
    };

    // enviar los datos
    api({
      method: editar.value ? "PUT" : "POST",
      url: editar.value ? `/producto/${editar.value}` : "/producto",
      data,
    })
      .then(({ data }) => {
        console.log(data);
        Swal.fire("Exito!", data.message, "success")
        cargarDatosProductos()
        form.reset()
        modal.hide()
      })
      .catch((err) =>
        Swal.fire("Error!: "+ err?.response?.data?.message, "error"));
      ;
  });
});

export function cargarDatosProductos(pagina = 1) {
  const wrapper = document.querySelector("#catalogo");
  wrapper.innerHTML = "";
  // peticion a localhost:3000/clientes del server de node
  api.get(`/productos?page=${pagina}&perPage=9`).then(({ data }) => {
     
    for (const producto of data) {
          

      wrapper.innerHTML += `
          <div class="card producto h-100">
                    <img src="${producto.imagen}" class="card-img-top" alt="Producto 3">
                    <div class="card-body">
                        <h5 class="card-title">${producto.nombre}</h5>
                        <p class="card-text">${producto.descripcion}</p>
                        <p class="card-text"><strong>Precio:</strong> $${producto.precio}</p>
                        <button class="btn btn-warning mt-2" onclick="editarProducto(${producto.id})"  ><i class="fas fa-edit"></i></button>
                        <button class="btn btn-danger mt-2" onclick="eliminarProducto(${producto.id})"  ><i class="fas fa-trash-alt"></i></button>
                    </div                </div>`;
    }
  });
}