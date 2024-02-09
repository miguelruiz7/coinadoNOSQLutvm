import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile} from 'firebase/auth';
import {Usuario} from '../models/usuario.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, getDoc, doc, collection, query, where, getDocs, addDoc, deleteDoc, orderBy} from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { Subject } from 'rxjs';
import { Cuenta } from '../models/cuenta.model';
import { transaccionInicial } from '../models/transaccion.model';
import { Categoria } from '../models/categoria.model';



@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  

auth = inject(AngularFireAuth);
firestore = inject(AngularFirestore);
utilsSvc = inject(UtilsService);

private eventoExitoso = new Subject<void>();
eventoExitoso$ = this.eventoExitoso.asObservable();

usuario: string = this.utilsSvc.obtenerLocalStorage('usr_mst')?.usr_id;



//Control de autenticacion

obtenerAutenticacion(){
  return getAuth();
}

iniciarSesion(usuario:Usuario){
   return signInWithEmailAndPassword(getAuth(), usuario.usr_correo, usuario.usr_con);
}

crearUsuario(usuario:Usuario){
  return createUserWithEmailAndPassword(getAuth(), usuario.usr_correo, usuario.usr_con);
}

actualizarUsuario(nombre:string){
  return updateProfile(getAuth().currentUser, {displayName: nombre});
}

cerrarSesion(){
  getAuth().signOut();
  localStorage.removeItem('usr_mst');
  this.utilsSvc.enrutar('/login')
}

//Base de datos
insertarDocumento(ruta: string, datos: any ){
  return setDoc(doc(getFirestore(), ruta), datos)
}

async obtenerDocumento(ruta: string){
  return (await getDoc(doc(getFirestore(), ruta))).data();
}








// Sistema

/////////////////////////////////////////////
///                                       ///
///                Inicio                 ///
///                                       ///
/////////////////////////////////////////////

async  generarReportes() {

  const obtenerSaldosIniciales = query(collection(getFirestore(), `usr_mst/${this.usuario}/trans_mst`), where("trans_tipo", "==", 'abono'));
  const consultarSaldosIniciales = await getDocs(obtenerSaldosIniciales);
  let totalIniciales = 0;
  consultarSaldosIniciales.forEach((doc) => {
    const cantidad = doc.data()['trans_cant'];
    totalIniciales += cantidad;
  });

  const obtenerSaldosDifInicial = query(collection(getFirestore(), `usr_mst/${this.usuario}/trans_mst`), where("trans_tipo", "!=", 'abono'));
  const querySnapshot = await getDocs(obtenerSaldosDifInicial);
  let totalDifInicial = 0;
  querySnapshot.forEach((doc) => {
    const cantidad = doc.data()['trans_cant'];
    totalDifInicial += cantidad;
  });

  const obtenerSaldosTotalesPorCuenta = query(collection(getFirestore(), `usr_mst/${this.usuario}/cta_mst`));
  const consultarSaldosTotalesCuentas = await getDocs(obtenerSaldosTotalesPorCuenta);
  let totalCuentas = 0;
  consultarSaldosTotalesCuentas.forEach((doc) => {
    const cantidad = doc.data()['cta_saldo'];
    totalCuentas += cantidad;
  });
  
  return [totalIniciales, totalDifInicial, totalCuentas];
}


async ObtenerCuentasUsuario(){
  const q = query(collection(getFirestore(), "cta_mst"), where("cta_usr_id", "==", this.usuario));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });
}


/////////////////////////////////////////////
///                                       ///
///                Cuentas                ///
///                                       ///
/////////////////////////////////////////////

 async obtenerCuentasBancarias() {
  const cuentasRef = collection(getFirestore(), `usr_mst/${this.usuario}/cta_mst`);

  const q = 
  query(cuentasRef,
  orderBy('cta_nom','asc')
  );

  try {
    const querySnapshot = await getDocs(q);
    const cuentas = [];
    querySnapshot.forEach((doc) => {
      cuentas.push({cta_id: doc.id,...doc.data()});
    });

    return cuentas;
  } catch (error) {
    console.error('Error al obtener las cuentas bancarias:', error);
    throw error;
  }
}


async crearCuenta(datos: Cuenta) {
  delete datos.cta_id
  const collectionRef = collection(getFirestore(), `usr_mst/${this.usuario}/cta_mst`);
  return addDoc(collectionRef, datos);
}

async modificarCuenta(datos: Cuenta) {
  const id = datos.cta_id;
  delete datos.cta_id;
    return setDoc(doc(getFirestore(), `usr_mst/${this.usuario}/cta_mst/${id}`), datos);
  }

  async obtenerInfoCuenta(cuenta: Cuenta) {
    return (await getDoc(doc(getFirestore(), `usr_mst/${this.usuario}/cta_mst/${cuenta}`))).data();
  }
  

async eliminarCuenta(cuenta: string) {

    const collectionRef = collection(getFirestore(), `usr_mst/${this.usuario}/cta_mst`);
    const documentRef = doc(collectionRef, cuenta);
    await deleteDoc(documentRef);
}



async eliminaTransacciones(cuenta: string): Promise<void> {
  const transCollectionRef = collection(getFirestore(), `usr_mst/${this.usuario}/trans_mst`);

  const transQuery = query(transCollectionRef, where('trans_cta_id', '==', cuenta));

  try {
    const querySnapshot = await getDocs(transQuery);
    const deletionPromises = querySnapshot.docs.map(async (doc) => {
      await deleteDoc(doc.ref);
    });

    await Promise.all(deletionPromises);

  } catch (error) {
    console.error('Error al eliminar transacciones:', error);
    throw error; 
  }
}


async generaTransaccion(tipo?: number, valores?: transaccionInicial): Promise<void | null> {
  switch (tipo) {
    case 1:
      try {
       delete valores.trans_id;
        const collectionRef = collection(getFirestore(), `usr_mst/${this.usuario}/trans_mst`);
        await addDoc(collectionRef, valores);
        return; 
      } catch (error) {
        return null; 
      }

    default:
      console.warn('Tipo de transacción no reconocido:', tipo);
      return null; 
  }
}



/////////////////////////////////////////////
///                                       ///
///              Categorias               ///
///                                       ///
/////////////////////////////////////////////

async obtenerCategorias(tipo: string) {
  const categorias = [];
  const q = query(collection(getFirestore(), `usr_mst/${this.usuario}/cat_mst`), where("cat_tipo", "==", tipo));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    console.log('categorias' + doc.data());
    categorias.push({cat_id: doc.id,...doc.data()});
  });

  return categorias;
}


async crearCategorias(datos: Categoria) {
  delete datos.cat_id
  const collectionRef = collection(getFirestore(), `usr_mst/${this.usuario}/cat_mst`);
  return addDoc(collectionRef, datos);
}

async modificarCategoria(datos: Categoria) {
  const id = datos.cat_id;
  delete datos.cat_id;
    return setDoc(doc(getFirestore(), `usr_mst/${this.usuario}/cat_mst/${id}`), datos);
  }


async eliminarCategoria(categoria: string){
  const collectionRef = collection(getFirestore(), `usr_mst/${this.usuario}/cat_mst`);
  const documentRef = doc(collectionRef, categoria);
  await deleteDoc(documentRef);
}


async obtenerInfoCategoria(categoria: Categoria) {
  return (await getDoc(doc(getFirestore(), `usr_mst/${this.usuario}/cat_mst/${categoria}`))).data();
}



notificarEventoExitoso() {
  this.eventoExitoso.next();
}

}
 