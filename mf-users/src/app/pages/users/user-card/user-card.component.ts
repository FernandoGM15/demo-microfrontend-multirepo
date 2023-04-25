import { Component, Input } from '@angular/core';
import PubSub from 'pubsub-js';


export interface UserI {
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
}
@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent {
  @Input() user!: UserI;

  onAdd() {
    PubSub.publish('users', this.user);
  }
}
