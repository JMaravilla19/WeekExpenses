// Variables y Selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');


// Eventos

// Event listeners
eventListeners()
function eventListeners(){
    document.addEventListener( 'DOMContentLoaded', preguntarPresupuesto )
    formulario.addEventListener('submit', agregarGasto);
}

// Clases
class Presupuesto{
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante =  Number(presupuesto);
        this.gastos = [];
    }
}

class UI{
    insertarPresupuesto(cantidad){
        const {presupuesto, restante} = cantidad
        document.querySelector('#total').textContent = presupuesto
        document.querySelector('#restante').textContent = restante
        
        
    }

    imprimirAlerta(mensaje, tipo){
        //crear el div
        
        const divMensaje = document.createElement('DIV');
        divMensaje.classList.add('text-center', 'alert');

        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger')
        }else{
            divMensaje.classList.add('alert-success')
        }

        divMensaje.textContent = mensaje;
        const primario = document.querySelector('.primario');
        
            primario.insertBefore( divMensaje, formulario );
        
        //quitar HTML
        setTimeout(() => {
            divMensaje.remove()
        }, 2000);
    }
}

//Instancias
const ui = new UI();
let presupuesto;

// Funciones
function preguntarPresupuesto(){
    const presupuestoUsuario = Number(prompt('Cual es tu presupuesto semanal?'))

    if(presupuestoUsuario === '' || isNaN(presupuestoUsuario) || presupuestoUsuario===null || presupuestoUsuario <= 0){
        window.location.reload();
    }

    // ya tenemos un presupuesto valido
    presupuesto = new Presupuesto(presupuestoUsuario);
    console.log(presupuesto);

    ui.insertarPresupuesto(presupuesto);
}

function agregarGasto(e){
    e.preventDefault();

    // Leer datos del formulario\
    const nombre = document.querySelector('#gasto').value;
    const cantidad = document.querySelector('#cantidad').value;


    if(nombre === '' || cantidad === ''){
        ui.imprimirAlerta('Ambos campos son Obligatorios', 'error');
        return;

    }else if( cantidad <= 0 || isNaN(cantidad) ){
        ui.imprimirAlerta('Cantidad no valida', 'error');
        return;
    }

    ui.imprimirAlerta('Gasto Agregado', 'exito')
    // Object literal enhancement, if both key and value are named the same
    // you can write it once.
    const gasto = {nombre, cantidad};
    console.log(gasto);
}