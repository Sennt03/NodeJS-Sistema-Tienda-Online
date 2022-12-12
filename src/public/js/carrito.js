const URL = '/carrito/'

class UI{
    refresh(){
        const contador_carrito = document.getElementById('cont-carrito')
        let contador = contador_carrito.innerHTML
        contador++
        contador_carrito.innerHTML = contador
    }

    async add(producto_id){
        const res = await fetch(URL+'add/'+producto_id, {method: 'POST'})
        const data = await res.json()
        
        this.refresh()
    }
}

const ui = new UI()

document.getElementById('add-carrito').addEventListener('click', (e) => {
    const producto_id = e.target.getAttribute('_id')
    ui.add(producto_id)
})
