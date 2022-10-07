import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
  firstName;
  email;
  message;
  condition;
  familyName;
  select;
  constructor() { }

  ngOnInit(): void {
  }

  onSubmit() {
    const data = {
      select: this.select,
      familyName: this.familyName,
      firstName: this.firstName,
      email: this.email,
      message: this.message,
      condition: this.condition
    }
  }
}
