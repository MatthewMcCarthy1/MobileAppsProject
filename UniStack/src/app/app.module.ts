import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppComponent // Import AppComponent as a standalone component
  ],
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth())
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
