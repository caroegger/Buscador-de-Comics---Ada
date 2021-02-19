const mostrarComics = () => {
    fetch("https://gateway.marvel.com/v1/public/comics?apikey=05db1849d82fefc677c13a9900c87b4f")
    .then(res => res.json())
    .then(data => {
        console.log(data)
        comics = data.data.results
        const resultados = document.querySelector(".resultados")
        comics.map((comic) => {
        resultados.innerHTML += `
            <div class="tarjeta-comic">
                <div class="contenedor-imagen-comic">
                    <img src="${comic.thumbnail.path}.jpg" class="imagen-comic">
                </div>
                <h3 class="titulo-comic">${comic.title}</h3>
            </div>
        `
        })
    })
}

mostrarComics()
