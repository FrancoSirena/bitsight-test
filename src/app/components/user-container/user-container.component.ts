import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '@serv/user.service';
import { Observable } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';


@Component({
  selector: 'app-user-container',
  templateUrl: './user-container.component.html',
  styleUrls: ['./user-container.component.scss']
})
export class UserContainerComponent implements OnInit, OnDestroy {
  users: Array<any>;
  timeUntil$: Observable<string>;
  lastTry: string;
  private interval: number;
  private alive: boolean;
  constructor(private userService: UserService) {
    this.alive = true;
    this.users = new Array<any>();
    this.timeUntil$ = this.userService.time$.pipe(
      map((time: Date) => time ? time.toLocaleTimeString() : null),
      takeWhile(() => this.alive)
    );
  }

  ngOnDestroy() {
    this.alive = false;
    clearInterval(this.interval);
  }

  ngOnInit() {
    this.getUsers();
    this.interval = window.setInterval(() => this.getUsers(), 120000);
  }

  getUsers() {
    this.users = [];
    this.lastTry = (new Date()).toLocaleTimeString();
    this.userService.getUsers()
      .subscribe((response) => {
        this.users = response;
      });
  }

}
