const URL = 'http://localhost:3000/'

class UI{
    async buscar(){
        const input = document.getElementById('input-buscador')
        const busqueda = input.value.trim()
        const message = document.getElementById('message-buscador')
        if(busqueda.length > 0){
            const res = await fetch(URL+'buscar', {
                method: 'POST',
                body: new URLSearchParams({
                    'busqueda': busqueda
                  })
            })
            const data = await res.json()
            if(data.productos.length > 0){
                message.innerHTML = `Resultados de la busqueda: ${busqueda}`
                message.style.display = 'block'
                this.refresh(data)
            }else{
                message.innerHTML = `No se encontraron resultados de la busqueda: ${busqueda}`
                message.style.display = 'block'
                const response = await fetch(URL+'get/all/productos')
                const productos = await response.json()
                this.refresh(productos)
                setTimeout(() => {
                    message.innerHTML = ``
                    message.style.display = 'none'
                }, 6000);
            }
            document.getElementById('input-buscador').value = ''
        }else{
            input.placeholder = 'Introdusca alguna busqueda'
            setTimeout(() => {
                input.placeholder = 'Buscador'
            }, 3000);
        }
    }

    refresh(data){
        const table = document.getElementById('container')
                table.innerHTML = ''
                data.productos.forEach(producto => {
                    let html = `
                    <section class="card">
                        <a style="padding: 0;" href="/producto/${producto.id}"><img src="${producto.imagen}" alt="${producto.name}"></a>
                        <a class="black" href="/producto/${producto.id}">
                            <h3>${producto.name}</h3>
                            <p>$${producto.precio}</p>
                        </a>
                    </section>
                    `
                    table.insertAdjacentHTML('beforeend', html)
                });
    }
}

const ui = new UI()

document.getElementById('buscador').addEventListener('submit', (e) => {
    e.preventDefault()
    ui.buscar()
})