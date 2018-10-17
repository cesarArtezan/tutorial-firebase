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
// Referencia a la coleccion customers
const collectionRef = firestore.collection('customers');

// Obtener datos de los inputs de html
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const businessName = document.getElementById('businessName');
const address = document.getElementById('address');
const customerType = document.getElementById('customerType');
const discount = document.getElementById('discount');
// id para editar
let _id;
// botones
const saveButton = document.getElementById('saveButton');
const editButton = document.getElementById('editButton');
const resetButton = document.getElementById('resetButton');

// inicia acciones del sistema
// 1.-funcion para guardar doc
const saveDoc = () => {
  console.log(firstName.value);
  console.log(`Guardando dato ${lastName.value} `);
  collectionRef
    .add({
      firstName: firstName.value,
      lastName: lastName.value,
      businessName: businessName.value,
      address: address.value,
      customerType: customerType.value,
      discount: +discount.value
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
  collectionRef
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
  collectionRef
    .doc(id)
    .get()
    .then(doc => {
      // ve si existe y pone los valores en el form
      if (doc.exists) {
        const customer = doc.data();
        firstName.value = customer.firstName;
        lastName.value = customer.lastName;
        businessName.value = customer.businessName;
        address.value = customer.address;
        customerType.value = customer.customerType;
        discount.value = customer.discount;
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
  collectionRef
    .doc(_id)
    .update({
      firstName: firstName.value,
      lastName: lastName.value,
      businessName: businessName.value,
      address: address.value,
      customerType: customerType.value,
      discount: +discount.value
    })
    .then(function() {
      console.log('Document successfully updated!');
    })
    .catch(function(error) {
      // The document probably doesn't exist.
      console.error('Error updating document: ', error);
    });
};

// 4.- Funcion listar
const getData = docs => {
  // Pone el numero de elementos listados
  const numOfCustomers = document.getElementById('numOfCustomers');
  // asigna numeros al elemento
  numOfCustomers.innerHTML = docs.docs.length;
  // obtiene la lista de html con id list
  var list = document.getElementById('list');
  // limpia la lista para mantenerla actualizada
  list.innerHTML = '';
  // docs es un arreglo de todos los documentos en la BD
  docs.forEach(doc => {
    // muestra en consola los datos
    console.log('Documento', doc.data());
    // guarda el cliente encontrado
    const customer = doc.data();
    // Crea el elemento de la lista con los datos del cliente
    list.innerHTML += `
    <li class="list-group-item d-flex justify-content-between lh-condensed">
            <div>
              <h6 class="my-0">${customer.firstName} ${customer.lastName}</h6>
             <div><small class="text-muted"><b>Razon Social: </b>${
               customer.businessName
             }</small></div> 
             <div><small class="text-muted"><b>Direccion: </b>${
               customer.address
             }</small></div> 
             <div><small class="text-muted"><b>Tipo: </b>${
               customer.customerType
             }</small></div> 
             <div><small class="text-muted"><b>Descuento: </b>${
               customer.discount
             }%</small></div> 
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
collectionRef.onSnapshot(getData);

// reset a nuevo
const reset = () => {
  saveButton.hidden = false;
  editButton.hidden = true;
  resetButton.hidden = true;
  firstName.value = '';
  lastName.value = '';
  businessName.value = '';
  address.value = '';
  customerType.value = '';
  discount.value = 0;
};
// completar el select de maquinas
/* const getMachines = docs => {
  // obtiene la lista de html con id list
  var select = document.getElementById('machines');
  // limpia la lista para mantenerla actualizada
  select.innerHTML = '';
  console.log('docs', docs);
  docs.forEach(doc => {
    const machine = doc.data();
    console.log('doc', doc.data());
    // el + es para ir concatenando cada maquina
    select.innerHTML += `
    <option value='${doc.id}' >Serie: ${machine.serie} capacidad: ${
      machine.capacity
    }, ubicación: ${machine.address}</option>
    `;
  });
};
collectionRefMachines.onSnapshot(getMachines);
// Formar el arreglo de opciones seleccionadas
const getSelectValues = select => {
  var result = [];
  var options = select;
  var option;
  for (var i = 0, iLen = options.length; i < iLen; i++) {
    option = options[i];
    if (option.selected) {
      result.push(option.value);
    }
  }
  return result;
};
// Formar el arreglo de opciones seleccionadas
const setSelectValues = (select, idsSelected) => {
  var options = select;
  var option;
  for (var i = 0, iLen = options.length; i < iLen; i++) {
    option = options[i];
    option.selected = false;
    const isFinded = idsSelected.some(id => id === option.value);
    console.log(idsSelected);
    if (isFinded) {
      option.selected = true;
    }
  }
};
 */
