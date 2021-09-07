const d = document;


const url = "https://api.jikan.moe/v3";



const btnManga = document.getElementById("btnBuscar");
const contAnime = document.getElementById("mangas");
const nombre = document.getElementById("buscar");


/*-------------- */

if (localStorage.sMangas) {
  const guardado = JSON.parse(localStorage.sMangas);

  mostrar(guardado);

}

/*------      Busqueda de mangas        -------- */

btnManga.addEventListener("click", () => {
  if (!navigator.onLine) {
    msgError();
  } else {
       if (validInputs() == true) {
        // console.log(nombCiudad.value);
        buscarAnime(nombre.value);
      }
  }
});

function  buscarAnime(anime) {
  console.log("Palabra", anime);

  const fetchPromise = fetch(`${url}/search/manga?q=${nombre.value}`);

  fetchPromise
    .then((Response) => {
      console.log("resultado", Response);
      return Response.json();
    })
    .then((result) => {
      // console.log("Datos", result);
      mostrar(result);
      // mapapear(result);
    })
    .catch((err) => {
      console.log("Algo fallo", err);
    });
}


function mostrar(datos) {

  const mangas = datos.results.map(
    anime => `<a href="${anime.url}" target="_blank"
                class="btn cardi tarjeta col-8 col-md-4 col-lg-3 my-3 mx-4 p-0  bg-white shadow">
                <article class="d-flex flex-column-reverse">
                    <div class="col-12 bd-highlight texto-card p-2 text-center h-100 d-inline-block">
                        <h3>${anime.title}</h3>
                        <p>${anime.synopsis}</p>
                        <span class="score">${anime.score}</span>
                    </div>
                    <div class="col-12 bd-highlight pb-2 text-center p-0">
                        <img src="${anime.image_url}"
                            v-bind:alt="Poster de ${anime.title}">
                    </div>
                </article>
            </a>`).join("\n");
 
  guardar(datos);
  contAnime.innerHTML = mangas;

}

// Guardar ult sMangas

function guardar(datos) {
  localStorage.sMangas = JSON.stringify(datos);
}

// ------- Validacion de si el campo esta vacio 
function validInputs() {
  let enviar = true;
  {
    if (nombre.value.length == 0) {
      enviar = false;
      nombre.classList.add("error");
    } else {
      nombre.classList.remove("error");
    }
  }

  return enviar;
}


/*-------------- mensaje de msgError ante igreso incorrecto --------------*/
/**
 * funcion arroja un mensaje de error cuando no encuentra una hubicacion al obtener un 404 del fetch
 */
function msgError() {
  let modal = d.createElement("div");
  modal.setAttribute(
    "class",
    "modal position-fixed d-flex  justify-content-center flex-column align-middle"
  );
  d.querySelector("body").appendChild(modal);

  let modalDialog = d.createElement("div");
  modalDialog.setAttribute("class", "modal-dialog");
  modal.appendChild(modalDialog);
  1;

  let modalCont = d.createElement("div");
  modalCont.setAttribute("class", "modal-content text-center");
  modalDialog.appendChild(modalCont);

  let modalBody = d.createElement("div");
  modalBody.setAttribute("class", "modal-body text-center");
  modalCont.appendChild(modalBody);

  let contenido = d.createElement("div");
  contenido.setAttribute("class", "cont-modal");
  modalBody.appendChild(contenido);

  let h3 = d.createElement("h3");
  h3.setAttribute("class", "h2");
  h3.innerText = "Ooops!";
  contenido.appendChild(h3);

  let texto = d.createElement("p");
  texto.setAttribute("class", "m-3");
  texto.innerText =
    "UPSS se puede buscar en este momento intente mas tarde";
  contenido.appendChild(texto);

  // btn cerrar

  let btn = d.createElement("button");
  btn.innerHTML = "Cerrar";
  btn.setAttribute("class", "btn btnCerrar");
  btn.onclick = function () {
    modal.remove();
  };
  modalBody.appendChild(btn);
}
