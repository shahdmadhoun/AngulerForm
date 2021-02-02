import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor() { }
  //dummy data for test
  emails = ['test@email.com' , 'admin@email.com'];
  valid(email){
    return (this.emails.includes(email));
  }
}
