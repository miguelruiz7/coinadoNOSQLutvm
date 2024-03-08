import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NoauthGuard } from './guards/noauth.guard';
import { AuthGuard } from './guards/auth.guard';

import { NavbarComponent } from './shared/components/navbar/navbar.component';
/*const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule), canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule), canActivate: [NoauthGuard]
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then( m => m.SignupPageModule), canActivate: [NoauthGuard]
  },
]; */


const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then((m) => m.LoginPageModule), 
    canActivate: [NoauthGuard]
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then( m => m.SignupPageModule), 
    canActivate: [NoauthGuard]
  },

  {
    path: '',
    component: NavbarComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadChildren: () => import('./pages/home/home.module').then((m) => m.HomePageModule), 
        canActivate: [AuthGuard]
      },
      {
        path: 'settings',
        loadChildren: () => import('./pages/settings/settings.module').then( m => m.SettingsPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'accounts',
        loadChildren: () => import('./pages/accounts/accounts.module').then( m => m.AccountsPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'categories',
        loadChildren: () => import('./pages/categories/categories.module').then( m => m.CategoriesPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'cuentasxp',
        loadChildren: () => import('./pages/cuentasxp/cuentasxp.module').then(m => m.CuentasxpPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'cuentasxc',
        loadChildren: () => import('./pages/cuentasxc/cuentasxc.module').then(m => m.CuentasxcPageModule),
        canActivate: [AuthGuard]
      }
    ],
  },
  {
    path: 'logout',
    loadChildren: () => import('./pages/logout/logout.module').then( m => m.LogoutPageModule)
  },
  {
    path: 'cuentasxp',
    loadChildren: () => import('./pages/cuentasxp/cuentasxp.module').then( m => m.CuentasxpPageModule)
  },
  {
    path: 'cuentasxc',
    loadChildren: () => import('./pages/cuentasxc/cuentasxc.module').then( m => m.CuentasxcPageModule)
  },


 
 

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
