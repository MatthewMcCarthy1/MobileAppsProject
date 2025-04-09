import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'main',
    loadComponent: () => import('../pages/main-load-in-page/main.page').then((m) => m.MainPage),
  },
  {
    path: 'login',
    loadComponent: () => import('../pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () => import('../pages/register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'home',
    loadComponent: () => import('../pages/home/home.page').then(m => m.HomePage)
  },
  {
    path: 'ask',
    loadComponent: () => import('../pages/ask/ask.page').then(m => m.AskPage)
  },
  {
    path: 'profile',
    loadComponent: () => import('../pages/profile/profile.page').then(m => m.ProfilePage)
  },
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full',
  },
];
