import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name = '';  // we'll use this value for username
  email = '';
  password = '';
  confirmPassword = '';
  phone = '';
  address = '';
  city = '';
  state = '';
  zipCode = '';
  country = 'India';
  dateOfBirth = '';
  gender = '';

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (!this.name || !this.email || !this.password) {
      alert('Please fill in all required fields!');
      return;
    }

    // ✅ send username instead of name
    const userData = {
      username: this.name,  // 👈 backend expects this field
      email: this.email,
      password: this.password,
      phone: this.phone,
      address: this.address,
      city: this.city,
      state: this.state,
      zipCode: this.zipCode,
      country: this.country,
      dateOfBirth: this.dateOfBirth,
      gender: this.gender
    };

    this.auth.register(userData).subscribe(
      () => {
        alert('Registration successful! Please login.');
        this.router.navigate(['/auth/login']);
      },
      err => alert('Registration failed: ' + (err?.error?.message || err.message))
    );
  }
}
