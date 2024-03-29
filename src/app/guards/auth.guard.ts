import { Inject, Injectable, forwardRef, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  firebaseSvc = inject(forwardRef(() =>FirebaseService));
  utilSvc = inject(UtilsService);


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
   
      let usuario = localStorage.getItem('usr_mst')
   
      return new Promise((resolve) => {
        this.firebaseSvc.obtenerAutenticacion().onAuthStateChanged((auth) => {

          if(auth){
           if(usuario) resolve(true);
          }else{
            this.utilSvc.enrutar('/login');
            resolve(false);
          }

        })
      });
  }
  
}
