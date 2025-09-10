import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Account } from '../models/account.model';
import { LoginDetails } from '../models/logindetails.model';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';


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
    this.http.post<Account>("http://localhost:8070/accounts/", account).subscribe({
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

    this.http.post<{token: string}>('http://localhost:8070/accounts/login', this.loginDetails).subscribe({
      next: (res) => {
        localStorage.setItem("token", res.token)
        this.router.navigate(["map"])
      },
      error: (err: HttpErrorResponse) => {
        if(err.status === 400)
          this.loginErrorMessage = "Bad request!";
        if(err.status === 404)
          this.loginErrorMessage = "Account was not find!"
      }
    })

    // this.http.post<any>(`http://localhost:8080/auth/login`, this.loginDetails).subscribe({
    //   next: (res) =>{
    //     this.loginErrorMessage = '';
    //     this.loginDetails.email = '';
    //     this.loginDetails.password = '';
    //     // console.log(res);
    //     localStorage.setItem("jwt", res.accessToken);

    //     const token = res.accessToken;
    //     const decodedToken = jwtDecode(token);
    //     console.log("OVAJ SE LOGUJEEEEEE");
    //     console.log(decodedToken);
    //     const userRole = (decodedToken as any).role;
    //     console.log('User role:', userRole);
    //     if(userRole == 'ROLE_ADMIN'){
    //       this.router.navigate(["admin-homepage"])
    //     }else{
    //       this.router.navigate(["home"])
    //     }
    //     this.authService.login(userRole)
    //   },
    //   error: (err: HttpErrorResponse) =>{
    //     if(err.status == 404)
    //       this.loginErrorMessage = "Account with this email doesnt exist.";
    //     if(err.status == 401)
    //       this.loginErrorMessage = "The password is not correct.";
    //      if(err.status == 406 ){
    //       this.loginErrorMessage = "You are not acitvate account.";
    //       this.sendCodeAgain = true;
    //      }
    //      localStorage.clear();
    //   }
    // })
  }

}
function jwtDecode(token: any) {
  throw new Error('Function not implemented.');
}

