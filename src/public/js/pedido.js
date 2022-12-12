const URL = '/pedido/'

async function cambiarEstado(id){
    const estado = document.getElementById('estado')
    let Pestado = estado.innerHTML.trim()
    if(Pestado == 'pendiente'){
        const validate = confirm('¿Quieres cambiar el estado del pedido a enviado?')
        if(validate){
            estado.innerHTML = 'enviado'
            await fetch(URL+'edit/estado/enviado/'+id, { method: 'POST' })
        }
    }else if(Pestado == 'enviado'){
        const validate = confirm('¿Quieres cambiar el estado del pedido a entregado?')
            if(validate){
                estado.innerHTML = 'entregado'
                await fetch(URL+'edit/estado/entregado/'+id, { method: 'POST' })
            }
        }else{
        const validate = confirm('¿Quieres cambiar el estado del pedido a pendiente?')
            if(validate){
                estado.innerHTML = 'pendiente'
                await fetch(URL+'edit/estado/pendiente/'+id, { method: 'POST' })
            }
    }
}

document.getElementById('estado').addEventListener('click', (e) => {
    cambiarEstado(e.target.getAttribute('_id'))
})