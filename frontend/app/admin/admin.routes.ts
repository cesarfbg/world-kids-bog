import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { AdminComponent } from './admin.component';
import { AccountPreferencesComponent } from './pages/account-preferences/account-preferences.component';
import { NewUserComponent } from './pages/user/new-user/new-user.component';
import { LoginGuard } from './guards/login.guard';
import { UserListComponent } from './pages/user/user-list/user-list.component';
import { AccountProfileComponent } from './pages/account-profile/account-profile.component';

const adminRoutes: Routes = [
    {
        path: 'admin',
        children: [
            {
                path: '',
                component: AdminComponent,
                canActivate: [ LoginGuard ],
                children: [
                    { path: 'inicio', component: DashboardComponent, data: { title: 'Inicio' } },
                    { path: 'preferencias', component: AccountPreferencesComponent, data: { title: 'Preferencias de usuario' } },
                    { path: 'perfil', component: AccountProfileComponent, data: { title: 'Perfil de usuario' } },
                    { path: 'nuevo-usuario', component: NewUserComponent, data: { title: 'Nuevo usuario' } },
                    { path: 'ver-usuarios', component: UserListComponent, data: { title: 'Lista de usuarios' } },
                    { path: '', redirectTo: 'inicio', pathMatch: 'full'}
                ]
            },
            { path: 'login', component: LoginComponent }
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule]
})

export class AdminRoutingModule {}
