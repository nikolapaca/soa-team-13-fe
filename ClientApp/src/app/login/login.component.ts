import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Account } from '../models/account.model';
import { LoginDetails } from '../models/logindetails.model';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {jwtDecode} from 'jwt-decode';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isSignDivVisiable: boolean  = true;
  isRegister: boolean = false;
  code: string = "";
  loginErrorMessage: string = "";
  addLocation: boolean = false;

  registerForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    role: new FormControl('', Validators.required)
  });


  account: Account = {
    id: '',
    username: '',
    email: '',
    password: '',
    role : '',
    blocked: false
  };
  loginDetails: LoginDetails = {
      email: '',
      password: ''
    }

  constructor(private router: Router, private http: HttpClient){}

  ngOnInit(): void {

  }

  onRegister() {    
    Object.keys(this.registerForm.controls).forEach(field => {
      const control = this.registerForm.get(field);
      if (control) {
        control.markAsTouched({ onlySelf: true });
      }
    });

    if(!this.registerForm.valid){
      return;
    }

    const account: Account = {
      id: '',
      username: this.registerForm.value.username!,
      email: this.registerForm.value.email!,
      password: this.registerForm.value.password!,
      role : this.registerForm.value.role!,
      blocked: false
    };
    this.http.post<Account>("http://localhost:8071/accounts", account).subscribe({
      next: (res) => {
        alert("Registration succesfull!");
        this.isSignDivVisiable = false;
      },
      error: (err: HttpErrorResponse) => {
        if(err.status === 400)
          alert("Bad request")
        if(err.status === 417)
          alert("Error!")
      }
    })
  }

  onLogin() {
    if(this.loginDetails.email === "" || this.loginDetails.password === ""){
      this.loginErrorMessage = "Email and password are required!"
    } 

    this.http.post<{token: string}>('http://localhost:8071/accounts/login', this.loginDetails).subscribe({
      next: (res) => {
        localStorage.setItem("token", res.token)

        if (res.token) {
          try {
            var decodedToken: any = jwtDecode(res.token);
            var role = decodedToken['role'];
            if(role === 'admin'){
              this.router.navigate(['all-accounts'])
            }
            else if(role === 'guide'){
              this.router.navigate(['tours'])
            }
            else {
              this.router.navigate(['published-tours'])
            }
          } catch (error) {
          }
        }
      },
      error: (err: HttpErrorResponse) => {
        if(err.status === 400)
          this.loginErrorMessage = "Wrong password!";
        if(err.status === 403)
          this.loginErrorMessage = "Account is blocked"
        if(err.status === 404)
          this.loginErrorMessage = "Account was not find!"
      }
    })
  }

}

