const URL = 'http://localhost:3000/categoria/'

// CLASES
class UI{
    async refresh(){
        const res = await fetch(URL+'getAll')
        const categorias = await res.json()
        
            const table = document.getElementById('table-categorias')
            table.innerHTML = ''
            
            if(categorias.message){
                setTimeout(() => {
                    this.noCategorys()
                }, 4000);
            }else{
                document.getElementById('noCategorys').innerHTML = ''
                try{
                    document.getElementById('noCategoryEjs').innerHTML = ''
                }catch(e){

                }
                const cabecera = `
                <h3>Id</h3>
                <h3>Nombre</h3>
                <h3>Editar</h3>
                <h3>Eliminar</h3>`

            table.insertAdjacentHTML('afterbegin', cabecera)

            categorias.forEach(categoria => {
                
                let insertHtml = `
                    <p>${categoria.id}</p>
                    <p>${categoria.name}</p>
                    <a href="/categoria/edit/${categoria.id}" class="btn btn-edit"><i class="fas fa-pen"></i></a>
                    <p _id="${categoria.id}" class="delete btn btn-delete"><i _id="${categoria.id}" class="delete fas fa-trash-alt"></i></p>
                `
                table.insertAdjacentHTML('beforeend', insertHtml)
            })
            }
    }

    async add(name){
        let res = await fetch(URL+'add/'+name, {method: 'POST'})
        res = await res.json()
        const message = document.getElementById('añadiendo')
        if(res.message){
            message.innerHTML = res.message
            this.reseatMessage('añadiendo', 3000)
        }else{
            message.innerHTML = 'Añadida correctamente'
            this.refresh()
            this.reseatMessage('añadiendo', 3000)
        }
    }

    reseatMessage(id, segundos){
        const message = document.getElementById(id)
        setTimeout(() => {
            message.innerHTML = ''
        }, segundos);
    }

    async deleteOne(id){
        const res = await fetch(URL+'get-one/'+id)
        const data = await res.json()
        
        const confirmDelete = confirm('¿Seguro quieres eliminar la categoria '+data.name+'?')
        if(confirmDelete){
            await fetch(URL+'delete-one/'+id, {method: 'DELETE'})
            this.refresh()
            this.alertOk()
        }
    }

    alertOk(){
        document.getElementById('alert-ok').style.display = 'block'
        setTimeout(() => {
            document.getElementById('alert-ok').style.display = 'none'
        }, 3000);
    }

    noCategorys(){
        document.getElementById('noCategorys').innerHTML = 'No hay categorias, !Añade una¡'
    }
} 

// EVENTOS
const ui = new UI()

document.getElementById('table-categorias').addEventListener('click', async (e) => {
    const id = e.target.getAttribute('_id')
    if(id){
        await ui.deleteOne(id)
    }
})

document.getElementById('add-categoria').addEventListener('submit', async (e) => {
    e.preventDefault()
    const name = document.getElementById('name-new-category').value
    if(name){
        document.getElementById('añadiendo').innerHTML = 'Añadiendo...'
        await ui.add(name)
        document.getElementById('name-new-category').value = ''
    }
})