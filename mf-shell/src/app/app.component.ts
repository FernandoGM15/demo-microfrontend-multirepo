import { Component, OnInit } from '@angular/core';
import PubSub from 'pubsub-js';

interface ICommonProduct {
  name: string;
  email: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'mf-shell';
  count = 0;
  private _users: ICommonProduct[] = []

  ngOnInit(): void {
    PubSub.subscribe('users', (msg, data) => {
      this._users.push(data as ICommonProduct);
      this.count++;
      localStorage.setItem('users', JSON.stringify(this._users));
    })
  }
}
