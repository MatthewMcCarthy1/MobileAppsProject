import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { App } from '@capacitor/app';

@NgModule({
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppComponent
  ],
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    AppComponent
  ],
})
export class AppModule {}
