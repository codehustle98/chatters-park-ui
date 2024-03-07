import {Component, OnInit} from '@angular/core';
import {SocketService} from "../core/services/socket.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../core/services/user.service";
import {Router} from "@angular/router";
import {formatDate} from "@angular/common";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm:FormGroup;
  currentDate= new Date();

  isLoginForm:boolean=true;
  constructor(private socketService:SocketService,
              private formBuilder:FormBuilder,
              private userService:UserService,
              private router:Router) {
    this.loginForm = this.formBuilder.group({
      username : new FormControl('',[Validators.required]),
      password: new FormControl('',[Validators.required]),
      userEmail: new FormControl('',!this.isLoginForm? [Validators.required]:[],),
      gender: new FormControl('MALE',!this.isLoginForm? [Validators.required]:[]),
      dob: new FormControl('',!this.isLoginForm? [Validators.required]:[])
    });
  }

  ngOnInit(): void {

  }

  login(){
    this.userService
      .login(this.loginForm.value,this.isLoginForm)
      .subscribe((res:any) =>{
        if(res && res.headers){
          this.loginForm.reset();
          localStorage.setItem('token',res.headers.get('Authorization'));
          this.router.navigate(['/chat']);
        }
      });
  }

  get usernameControl(){
    return this.loginForm.get('username');
  }

  get passwordControl(){
    return this.loginForm.get('password');
  }

  get emailControl(){
    return this.loginForm.get('email');
  }

  get genderControl(){
    return this.loginForm.get('gender');
  }

  get dobControl(){
    return this.loginForm.get('dob');
  }

}
