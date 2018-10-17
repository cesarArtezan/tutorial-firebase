/**
 * Ejemplo Basico de Firebase
 */
'use strict';
/**
 * Configuracion copiada desde consola https://console.firebase.google.com/
 */
var config = {
  apiKey: 'AIzaSyBQ6y_OkSHZnixtKOFKfm3-F9zcwjvokkc',
  authDomain: 'tutorial-firebase-a126e.firebaseapp.com',
  databaseURL: 'https://tutorial-firebase-a126e.firebaseio.com',
  projectId: 'tutorial-firebase-a126e',
  storageBucket: 'tutorial-firebase-a126e.appspot.com',
  messagingSenderId: '1074849584491'
};
// Inicia  firebase
firebase.initializeApp(config);
// Inica firestore
var firestore = firebase.firestore();
// configuracion de firestore requerida
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);
// Referencia a la coleccion machines
const collectionMachine = firestore.collection('machines');
// Referencia a la coleccion customers
const collectionCustomers = firestore.collection('customers');
// Obtener datos de los inputs de html
const serie = document.getElementById('serie');
const type = document.getElementById('type');
const address = document.getElementById('address');
const model = document.getElementById('model');
const capacity = document.getElementById('capacity');
const items = document.getElementById('items');
const customerSelect = document.getElementById('customer');
let customers = [];
// id para editar
let _id;
// botones
const saveButton = document.getElementById('saveButton');
const editButton = document.getElementById('editButton');
const resetButton = document.getElementById('resetButton');

// inicia acciones del sistema
// 1.-funcion para guardar doc
const saveDoc = () => {
  console.log(`Guardando dato`);
  collectionMachine
    .add({
      serie: serie.value,
      type: type.value,
      address: address.value,
      model: model.value,
      capacity: capacity.value,
      customer: customerSelect.value
      // items: items
    })
    .then(() => {
      console.log('guardado');
    })
    .catch(() => {
      console.log('error');
    });
};
//2.- funcion para borrar
const deleteById = id => {
  collectionMachine
    .doc(id)
    .delete()
    .then(function() {
      console.log('Document successfully deleted!');
    })
    .catch(function(error) {
      console.error('Error removing document: ', error);
    });
};
// 3.- funcion editar
//  obtine por id de la coleccion customer
const getById = id => {
  collectionMachine
    .doc(id)
    .get()
    .then(doc => {
      // ve si existe y pone los valores en el form
      if (doc.exists) {
        const machine = doc.data();
        serie.value = machine.serie;
        type.value = machine.type;
        address.value = machine.address;
        model.value = machine.model;
        capacity.value = machine.capacity;
        customerSelect.value = machine.customer;
        // items.value = machine.items;
        _id = id;
      } else {
        // doc.data() will be undefined in this case
        console.log('No such document!');
      }
    })
    .catch(function(error) {
      console.log('Error getting document:', error);
    });
  // mostrar botones de editar
  saveButton.hidden = true;
  resetButton.hidden = false;
  editButton.hidden = false;
};
// edita por id
const updateById = () => {
  collectionMachine
    .doc(_id)
    .update({
      serie: serie.value,
      type: type.value,
      address: address.value,
      model: model.value,
      capacity: capacity.value,
      customer: customerSelect.value
      // items: items
    })
    .then(function() {
      console.log('Document successfully updated!');
    })
    .catch(function(error) {
      // The document probably doesn't exist.
      console.error('Error updating document: ', error);
    });
};
// Clientes
const getCustomers = docs => {
  // limpia la lista para mantenerla actualizada
  customerSelect.innerHTML = '';
  docs.forEach(doc => {
    customers.push({ data: doc.data(), id: doc.id });
    console.log(customers);
    const customer = doc.data();
    // el + es para ir concatenando cada maquina
    customerSelect.innerHTML += `
        <option value='${doc.id}' >${customer.firstName} ${
      customer.lastName
    }</option>
        `;
  });
};
// Llama a listar cuando detecta un cambio en tiempo real :)
collectionCustomers.onSnapshot(getCustomers);

// 4.- Funcion listar
const getData = docs => {
  // Pone el numero de elementos listados
  const numOfElements = document.getElementById('numOfElements');
  // asigna numeros al elemento
  numOfElements.innerHTML = docs.docs.length;
  // obtiene la lista de html con id list
  var list = document.getElementById('list');
  // limpia la lista para mantenerla actualizada
  list.innerHTML = '';
  // docs es un arreglo de todos los documentos en la BD
  docs.forEach(doc => {
    // muestra en consola los datos
    // console.log('Documento', doc.data());
    // guarda el cliente encontrado
    const machine = doc.data();
    // busca cliente de la maquina
    let customerName;
    if (machine.customer) {
      customerName = customers.find(c => c.id === machine.customer).data
        .firstName;
    } else {
      customerName = 'Sin asignar';
    }
    // Crea el elemento de la lista con los datos del cliente
    list.innerHTML += `
    <li class="list-group-item d-flex justify-content-between lh-condensed">
            <div>
              <h6 class="my-0">${machine.serie}</h6>
             <div><small class="text-muted"><b>Tipo: </b>${
               machine.type
             }</small></div> 
             <div><small class="text-muted"><b>Ubicacion: </b>${
               machine.address
             }</small></div> 
             <div><small class="text-muted"><b>Modelo: </b>${
               machine.model
             }</small></div> 
             <div><small class="text-muted"><b>Capacidad: </b>${
               machine.capacity
             }%</small></div> 
             <div><small class="text-muted"><b>Cliente: </b></small>${customerName}</div> 
            </div>
            <div>
            <button onclick="getById('${
              doc.id
            }')" type="button" id="pencil" class="btn btn-outline-primary" placement="bottom" value="myvalue" >
            <i class="fa fa-pencil"></i>
            </button>
            <button onclick="deleteById('${
              doc.id
            }')" type="button" id="deleteButton" class="btn btn-outline-danger" placement="bottom" value="myvalue" >
            <i class="fa fa-trash"></i>
            </button>
            </div>
    </li>
    `;
  });
};
// Llama a listar cuando detecta un cambio en tiempo real :)
collectionMachine.onSnapshot(getData);

// reset a nuevo
const reset = () => {
  saveButton.hidden = false;
  editButton.hidden = true;
  resetButton.hidden = true;
  //   formulario
  serie.value = 0;
  type.value = '';
  address.value = '';
  model.value = '';
  capacity.value = 0;
  // items.value = machine.items;
};
