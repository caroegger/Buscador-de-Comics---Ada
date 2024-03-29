const urlBase = "https://gateway.marvel.com/v1/public/"
const apiKey = "05db1849d82fefc677c13a9900c87b4f"

const resultados = document.querySelector(".resultados")

const selectTipo = document.querySelector("#busqueda-tipo")
const selectOrden = document.querySelector("#busqueda-orden")
const selectOrdenComics = document.querySelector(".select-comics")
const selectOrdenPersonajes = document.querySelector(".select-personajes")

const inputBusqueda = document.querySelector(".input-busqueda")
const botonBuscar = document.querySelector(".boton-buscar")

const resultadosPorPagina = 20
let paginaActual = 0
let cantidadDeResultados = 0

const primeraPagina = document.querySelector(".primera-pagina")
const paginaPrevia = document.querySelector(".pagina-previa")
const paginaSiguiente = document.querySelector(".siguiente-pagina")
const ultimaPagina = document.querySelector(".ultima-pagina")

const contenedorNumeroDeResultados = document.querySelector(".contenedor-numero-de-resultados")


///////////////////////////////////////////////////////////////////////////////


///// MOSTRAR TARJETAS ////////////////////////////////////////////////////////


mostrarTarjetasComics = (comic) => {
    return `
    <div class="tarjeta-comic">
        <div class="contenedor-imagen-comic">
            <img src="${comic.thumbnail.path}.jpg" class="imagen-comic" data-id="${comic.id}">
        </div>
        <h3 class="titulo-comic">${comic.title}</h3>
    </div>
    `
}

mostrarTarjetasPersonajes = (character) => {
    return `
        <div class="tarjeta-personaje">
            <div class="contenedor-imagen-personaje">
                <img src="${character.thumbnail.path}.jpg" class="imagen-personaje" data-id="${character.id}">
            </div>
            <div class="contenedor-nombre-personaje">
                <h3 class="nombre-personaje">${character.name}</h3>
            </div>
        </div>
    `
}


///// MOSTRAR RESULTADOS ////////////////////////////////////////////////////////


selectTipo.onchange = () => {
    if (selectTipo.value === "characters") {
        selectOrdenComics.classList.add("ocultar")
        selectOrdenPersonajes.classList.remove("ocultar")
    }
    if (selectTipo.value === "comics") {
        selectOrdenComics.classList.remove("ocultar")
        selectOrdenPersonajes.classList.add("ocultar")
    }
}

const mostrarResultados = (tipo = "comics", orden = "title", inputBusqueda = "") => {
    let valorInput = ""
    if (inputBusqueda !== "") {
        if (tipo == "comics") {
            valorInput = `&titleStartsWith=${inputBusqueda}`
        }
        if (tipo == "characters"){
            valorInput = `&nameStartsWith=${inputBusqueda}`
        }
    }
    fetch(`${urlBase}${tipo}?apikey=${apiKey}&orderBy=${orden}${valorInput}&offset=${paginaActual * resultadosPorPagina}`)
    .then(res => res.json())
    .then(data => {
        cantidadDeResultados = data.data.total
        resultados.innerHTML = ""

        data.data.results.map((seleccionTipo) => {
            if (tipo == "comics") {
                return resultados.innerHTML +=
                mostrarTarjetasComics(seleccionTipo)
            }
            if (tipo == "characters") {               
                return resultados.innerHTML +=
                mostrarTarjetasPersonajes(seleccionTipo)
            }
        })
        let offset = data.data.offset
        deshabilitarOHabilitarBotones(offset, cantidadDeResultados)
        clickearComicParaVerInfo()
        clickearPersonajeParaVerInfo()
        mostrarCantidadDeResultados(cantidadDeResultados)
    })
}

mostrarResultados()


///// BUSQUEDA DE RESULTADOS ////////////////////////////////////////////////////////


const buscarResultados = () => {
    if (inputBusqueda.value != "") {
        if (selectTipo.value === "characters") {
            mostrarResultados(selectTipo.value, selectOrdenPersonajes.value, inputBusqueda.value)
        }
        else {
            mostrarResultados(selectTipo.value, selectOrdenComics.value, inputBusqueda.value)
        }
    }
    else {
        if (selectTipo.value === "characters") {
            mostrarResultados(selectTipo.value, selectOrdenPersonajes.value)
        }
        else {
            mostrarResultados(selectTipo.value, selectOrdenComics.value)
        }
    }
}

botonBuscar.onclick = () => {
    paginaActual = 0
    buscarResultados()
}


///// PAGINADO Y BOTONES ////////////////////////////////////////////////////////


primeraPagina.onclick = () => {
    resultados.innerHTML = ""
    paginaActual = 0
    buscarResultados()
}

paginaPrevia.onclick = () => {
    resultados.innerHTML = ""
    paginaActual--
    buscarResultados()
}

paginaSiguiente.onclick = () => {
    resultados.innerHTML = ""
    paginaActual++
    buscarResultados()
}

ultimaPagina.onclick = () => {
    restoDeResultados = cantidadDeResultados % resultadosPorPagina
    if (restoDeResultados > 0 ) {
        paginaActual = (cantidadDeResultados - (restoDeResultados)) / resultadosPorPagina
    }    
    else {
        paginaActual = (cantidadDeResultados / resultadosPorPagina) - 1
    }
    buscarResultados()
}

// aqui estas dando por valor por defecto un string en lugar de un numero
// que pasa si apelamos a esto y despues sumamos una nueva pagina?
// el resultado va a ser el string "020"!
deshabilitarOHabilitarBotones = (offset = "0", cantidadDeResultados = "0") => {
    if (paginaActual == 0) {
        primeraPagina.disabled = true
        paginaPrevia.disabled = true
    }
    else {
        primeraPagina.disabled = false
        paginaPrevia.disabled = false
    }

    if (offset + 20 >= cantidadDeResultados) {
        paginaSiguiente
    .disabled = true
        ultimaPagina.disabled = true
    }
    else {
        paginaSiguiente
    .disabled = false
        ultimaPagina.disabled = false
    }
}


///// MOSTRAR INFO DE PERSONAJES O COMICS ////////////////////////////////////////////////////////


const mostrarInfoComic = (comicId) => {
    fetch(`${urlBase}/comics/${comicId}?apikey=${apiKey}`)
    .then(res => res.json())
    .then(data => {
        data.data.results.map (data => {
            // bien esta funcion!
            const guionistas = data.creators.items.filter((guionista) => guionista.role === "writer").map((guionista) => guionista.name)

            // aqui hubiera sido preferible usar Date()
            const publicacionFormatoAmericano = data.modified.split("T")[0]
            const dia = publicacionFormatoAmericano.slice(8, 10)
            const mes = publicacionFormatoAmericano.slice(5, 7)
            const anio = publicacionFormatoAmericano.slice(0, 4)
            const publicacionFormatoLatinoamericano = `${dia}/${mes}/${anio}`


            const informacionComic = document.querySelector(".contenedor-info-comic")
            informacionComic.classList.remove("ocultar")

            // Que pasa si no hay guionistas, si no hay imagen, si no hay descripcion o fecha?
            // Tu codigo debe estar preparado para que estos datos falten y se vea bien la web
            // Necesitas valores por defecto aqui
            informacionComic.innerHTML = 
            `
            <div class="contenedor-imagen-info-comic">
                <img class="imagen-info-comic" src="${data.thumbnail.path}.jpg">
            </div>
            <div class="info-comic">
                <h2 class="titulo-comic">${data.title}</h2>
                <h3 class="subtitulo-info">Publicado:</h3>
                <p class="detalle-info">${publicacionFormatoLatinoamericano}</p>
                <h3 class="subtitulo-info">Guionistas:</h3>
                <p class="detalle-info">${guionistas}</p>
                <h3 class="subtitulo-info">Descripcion:</h3>
                <p class="detalle-info">${data.description}</p>
            </div>
            `
        })
    })
}

const clickearComicParaVerInfo = () => {
    const tarjetasComics = document.querySelectorAll(".tarjeta-comic")

    tarjetasComics.forEach(tarjeta => {
    tarjeta.onclick = (e) => {
        comicId = e.target.dataset.id
        resultados.innerHTML = ""
        mostrarInfoComic(comicId)
        }
    })
}

const mostrarInfoPersonaje = (characterId) => {
    fetch(`${urlBase}/characters/${characterId}?apikey=${apiKey}`)
    .then(res => res.json())
    .then(data => {
        data.data.results.map (data => {
            const informacionPersonaje = document.querySelector(".contenedor-info-personaje")
            informacionPersonaje.classList.remove("ocultar")
            informacionPersonaje.innerHTML = 
            `
            <div class="contenedor-imagen-info-comic">
                <img class="imagen-info-comic" src="${data.thumbnail.path}.jpg">
            </div>
            <div class="info-personaje">
                <h2 class="nombre-personaje">${data.name}</h2>
                <p class="descripcion-personaje">${data.description}</p>
            </div>
            `
        })
    })
}

const clickearPersonajeParaVerInfo = () => {
    const tarjetasPersonajes = document.querySelectorAll(".tarjeta-personaje")

    tarjetasPersonajes.forEach(tarjeta => {
    tarjeta.onclick = (e) => {
        characterId = e.target.dataset.id
        resultados.innerHTML = ""
        mostrarInfoPersonaje(characterId)
        }
    })
}


///// MOSTRAR CANTIDAD DE RESULTADOS DE LA BUSQUEDA ////////////////////////////////////////////////////////


const mostrarCantidadDeResultados = (cantidadDeResultados) => {
    contenedorNumeroDeResultados.innerHTML = `${cantidadDeResultados}`
}
