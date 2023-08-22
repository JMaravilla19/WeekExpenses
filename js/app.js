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

    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante(){
        const gastado = this.gastos.reduce( (total, gasto)=> total + gasto.cantidad, 0)
        this.restante = this.presupuesto - gastado
    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter( (gasto)=> gasto.id !== id );
        this.calcularRestante()

    }
}

class UI{
    insertarPresupuesto(cantidad){
        const {presupuesto, restante} = cantidad
        document.querySelector('#total').textContent = presupuesto
        document.querySelector('#restante').textContent = restante
        
    }

    actualizarRestante(restante){
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

    mostrarGastos(gastos){
         this.limpiarHTML()
        //Iterar sobre los gastos
        gastos.forEach(gasto => {
            const { nombre, cantidad, id } = gasto;
            
            // CREAR UN LI
            const nuevoGasto = document.createElement('LI');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center'

            // Estos 2 hacen lo mismo, pero en versiones mas nuevas se recomienda usar dataset.
            //nuevoGasto.setAttribute('data-id', id);
            nuevoGasto.dataset.id = id;

            // Agregar el HTML del gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill"> $${cantidad} </span>`

            // Boton para borrar el gasto
            const btnBorrar = document.createElement('BUTTON');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times'
            btnBorrar.onclick = ()=> {
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);

            // agregar al HTML
            gastoListado.appendChild(nuevoGasto);

        });
    }

    limpiarHTML(){
        while(gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild);
        }

    }

    comprobarPresupuesto(presupuestoObj){
        const {presupuesto, restante} = presupuestoObj;
        const restanteDiv = document.querySelector('.restante')

        //Comprobar si queda menos del 25%
        if( (presupuesto * .25) >= restante ){
            restanteDiv.classList.remove('alert-success', 'alert-warning')
            restanteDiv.classList.add('alert-danger')
        }else if( (presupuesto *.5) >= restante ){
            restanteDiv.classList.remove('alert-success')
            restanteDiv.classList.add('alert-warning')
        }else{
             restanteDiv.classList.remove('alert-danger', 'alert-warning');
             restanteDiv.classList.add('alert-success')
        }

        if(restante <=0){
            this.imprimirAlerta('El presupuesto se agoto!!', 'error');
            formulario.querySelector('button[type="submit"]').disabled = true
        }
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

    ui.insertarPresupuesto(presupuesto);
}

function agregarGasto(e){
    e.preventDefault();

    // Leer datos del formulario\
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);


    if(nombre === '' || cantidad === ''){
        ui.imprimirAlerta('Ambos campos son Obligatorios', 'error');
        return;

    }else if( cantidad <= 0 || isNaN(cantidad) ){
        ui.imprimirAlerta('Cantidad no valida', 'error');
        return;
    }

    // Object literal enhancement, if both key and value are named the same
    // you can write it once.
    const gasto = {
            nombre, 
            cantidad,
            id: Date.now()
    };
   
    //Agregar un gasto al arreglo
    presupuesto.nuevoGasto(gasto);

    //Imprimir mensaje todo bien!
    ui.imprimirAlerta('Gasto Agregado');

    //Imprimir los gastos.
    const {gastos, restante} = presupuesto
    ui.mostrarGastos(gastos)
    ui.actualizarRestante(restante)
    ui.comprobarPresupuesto(presupuesto);
    //resetear formulario
    formulario.reset();
}  

function eliminarGasto(id){
    //Elimina del objeto
    presupuesto.eliminarGasto(id);

    //Elimina de HTML
    const {gastos, restante}= presupuesto
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}