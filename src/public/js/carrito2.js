const URL = '/carrito/'

class UI{

    async deleteAll(){
        await fetch(URL+'delete/all', {method: 'DELETE'})
        let table = document.getElementById('modify-carrito')
        table.innerHTML = ''
        document.getElementById('cont-carrito').innerHTML = 0
        document.getElementById('precio-total').innerHTML = 'Precio total: $0'
    }

    refresh(){
        let contador_carrito = document.getElementById('cont-carrito')
        let contador = contador_carrito.innerHTML
        contador++
        contador_carrito.innerHTML = contador
    }

    refreshProductos(productos){
        let table = document.getElementById('modify-carrito')
        table.innerHTML = ''
        productos.forEach(producto => {
            let html = `
            <div class="card">
                <img src="${producto.producto.imagen}" alt="${producto.producto.name}">
                <div class="info-product"><a href="/producto/${producto.producto.id}">${producto.producto.name}</a></div>
                <p class="p-unidades"><span mas="${producto.producto_id}" style="color: #0be60b;"><i mas="${producto.producto_id}" class="fas fa-plus-square"></i></span><span>Unidades: <span id="${producto.producto_id}">${producto.unidades}</span></span><span menos="${producto.producto_id}" style="color: #ff0000;"><i menos="${producto.producto_id}" class="fas fa-minus-square"></i></span></p>
                <span id="${producto.producto_id}2">$${producto.unidades * producto.precio}</span>
            </div>
            `
            table.insertAdjacentHTML('beforeend', html)
        });
    }

    async refreshPrecioTotal(){
        let res = await fetch(URL+'get/total/costo')
        let data = await res.json()
        let table = document.getElementById('precio-total')
        table.innerHTML = ''
        table.innerHTML = 'Precio total: $'+data.costo
    }

    async refreshPrecio(id){
        let res = await fetch(URL+'get/precio/'+id)
        let costo = await res.json()

        let div = id+'2'

        let precio = document.getElementById(div)
        precio.innerHTML = ''
        precio.innerHTML = '$'+costo.costo
    }

    refreshMas(id){
        let contador_carrito = document.getElementById('cont-carrito')
        let contador = contador_carrito.innerHTML
        contador++
        contador_carrito.innerHTML = contador

        let unidades = document.getElementById(id)
        contador = unidades.innerHTML
        contador++
        unidades.innerHTML = contador
        this.refreshPrecio(id)
    }
    
    async refreshMenos(id){
        const contador_carrito = document.getElementById('cont-carrito')
        let contador = contador_carrito.innerHTML
        contador--
        contador_carrito.innerHTML = contador

        let unidades = document.getElementById(id)
        let contador2 = unidades.innerHTML
        contador2--
        unidades.innerHTML = contador2
        this.refreshPrecio(id)
        let cant = parseInt(unidades.innerHTML)
        if(cant <= 0){

            let res = await fetch(URL+'delete')
            let data = await res.json()
            this.refreshProductos(data)
        }
    }

    async add(producto_id){
        let res = await fetch(URL+'add/'+producto_id, {method: 'POST'})
        let data = await res.json()
        
        this.refresh()
    }

    async mas(producto_id){
        let res = await fetch(URL+'mas/'+producto_id, {method: 'POST'})
        let data = await res.json()
        
        this.refreshMas(producto_id)
    }

    async menos(producto_id){
        let res = await fetch(URL+'menos/'+producto_id, {method: 'POST'})
        let data = await res.json()

        this.refreshMenos(producto_id)
    }
}

const ui = new UI()

document.getElementById('modify-carrito').addEventListener('click', (e) => {
    let mas = e.target.getAttribute('mas')
    let menos = e.target.getAttribute('menos')
    if(mas){
        ui.mas(mas)
        ui.refreshPrecioTotal()
    }else if(menos){
        
        ui.menos(menos)
        ui.refreshPrecioTotal()
    }
})

document.getElementById('limpiar').addEventListener('click', () => {
    ui.deleteAll()
})