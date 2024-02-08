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


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  getDatabase() {
    throw new Error('Method not implemented.');
  }

auth = inject(AngularFireAuth);
firestore = inject(AngularFirestore);
utilsSvc = inject(UtilsService);

private eventoExitoso = new Subject<void>();
eventoExitoso$ = this.eventoExitoso.asObservable();



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


async generarReportes() {
  const db = getFirestore();

  const query1 = query(collection(db, 'trans_mst'), where('trans_tipo', '==', 1));
  const query2 = query(collection(db, 'trans_mst'), where('trans_tipo', '!=', 1));
  const query3 = query(collection(db, 'cta_det'), where('cta_usr_id', '==', this.utilsSvc.obtenerLocalStorage('usr_mst').usr_id)); 

  try {
    const [result1, result2, result3] = await Promise.all([
      getDocs(query1),
      getDocs(query2),
      getDocs(query3),
    ]);

    const totalIniciales = result1.docs.reduce((acc, doc) => acc + doc.data()['trans_cant'], 0) || 0;
    const totalGeneral = result2.docs.reduce((acc, doc) => acc + doc.data()['trans_cant'], 0) || 0;
    const totalSaldo = result3.docs.reduce((acc, doc) => acc + doc.data()['cta_saldo'], 0) || 0;

    const reporteGeneral = {
      totalIniciales,
      totalGeneral,
      totalSaldo,
    };

    return [reporteGeneral];
  } catch (error) {
    console.error('Error al realizar las consultas:', error);
    throw error;
  }
}







/////////////////////////////////////////////
///                                       ///
///                Cuentas                ///
///                                       ///
/////////////////////////////////////////////
 async obtenerCuentasBancarias(usuario) {
  const cuentasRef = collection(getFirestore(), 'cta_mst');

  const q = 
  query(cuentasRef, where('cta_usr_id', '==', usuario),
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


async crearCuenta(datos: any) {
  const collectionRef = collection(getFirestore(), 'cta_mst');
  return addDoc(collectionRef, datos);
}


async eliminarCuenta(cuenta:string) {
    const collectionRef = collection(getFirestore(), 'cta_mst');
    const documentRef = doc(collectionRef, cuenta);
    await deleteDoc(documentRef);
}

async eliminaTransacciones(cuenta: string): Promise<void> {
  const transCollectionRef = collection(getFirestore(), 'trans_mst');

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


async obtenerInfoCuenta(cuenta: Cuenta) {
  return (await getDoc(doc(getFirestore(), `cta_mst/${cuenta}`))).data();
}

async modificarCuenta(datos: Cuenta) {
const id = datos.cta_id;
delete datos.cta_id;
  return setDoc(doc(getFirestore(), `cta_mst/${id}`), datos);
}


async generaTransaccion(tipo?: number, valores?: transaccionInicial): Promise<void | null> {
  switch (tipo) {
    case 1:
      try {
       delete valores.trans_id;
        const collectionRef = collection(getFirestore(), 'trans_mst');
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

notificarEventoExitoso() {
  this.eventoExitoso.next();
}

}
 