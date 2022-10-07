import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  firstName;
  email;
  message;
  condition;
  constructor() { }

  ngOnInit(): void {
  }

  onSubmit() {
    const data = {
      firstName: this.firstName,
      email: this.email,
      message: this.message,
      condition: this.condition
    }

  }

}
