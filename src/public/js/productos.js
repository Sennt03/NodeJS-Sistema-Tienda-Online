const URL = 'http://localhost:3000/producto/'

class UI{
    async refresh(){
        const res = await fetch(URL+'get/all')
        const productos = await res.json()
        const table = document.getElementById('table-productos')
        table.innerHTML = ''
        if(productos.message){
            document.getElementById('message').innerHTML = productos.message
        }else{
            document.getElementById('message').innerHTML = '' 
            
            const html = `
            <h3>Categoria</h3>
            <h3>Nombre</h3>
            <h3>Editar</h3>
            <h3>Eliminar</h3>
            `
            table.insertAdjacentHTML('afterbegin', html)
            productos.forEach(producto => {
                let insertHtml = `
                <p>${producto.categoria}</p>
                <a href="/producto/${producto.id}"><p style="color: #000;">${producto.name}</p></a>
                <a href="/producto/edit/${producto.id}" class="btn btn-edit" style="color: #3fbb17;"><i class="fas fa-pen"></i></a>
                <p _id="${producto.id}" class="delete btn btn-delete" style="color: #e40909;"><i _id="${producto.id}" class="delete fas fa-trash-alt"></i></p>
                `
                table.insertAdjacentHTML('beforeend', insertHtml)
            });
        }
        
    }


    async deleteOne(id){
        const res = await fetch(URL+'get/one/'+id)
        const producto = await res.json()
        
        const validate = confirm('¿Seguro quieres eleminar el producto '+producto.name+'?')
        if(validate){
            await fetch(URL+'delete-one/'+id, {method: 'DELETE'})
            ui.deleteOk()
        }
    }

    deleteOk(){
        document.getElementById('message').innerHTML = 'Producto eliminado correctamente'
        this.reseatMessage()
    }

    reseatMessage(){
        setTimeout(() => {
            document.getElementById('message').innerHTML = ''
        }, 3000);
    }
}

const ui = new UI()
ui.refresh()

document.getElementById('table-productos').addEventListener('click', async (e) => {
    const id = e.target.getAttribute('_id')
    if(id){
        await ui.deleteOne(id)
        await ui.refresh()
        
    }
})