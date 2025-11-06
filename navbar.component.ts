import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service'; // ✅ Import CartService
import { AuthService } from '../../../core/services/auth.service'; // ✅ Import AuthService

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  searchTerm = '';
  cartCount = 0; // Will auto-update from CartService
  isLoggedIn = false; // ✅ Track login status
  currentUser: any = null; // ✅ Store current user

  constructor(
    private router: Router,
    private cartService: CartService, // ✅ Inject CartService
    private authService: AuthService // ✅ Inject AuthService
  ) {}

  ngOnInit(): void {
    // ✅ Subscribe to live cart count updates
    this.cartService.count$.subscribe(count => {
      this.cartCount = count;
    });

    // ✅ Subscribe to auth status updates
    this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
      this.currentUser = user;
    });
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchTerm } });
      this.searchTerm = '';
    }
  }

  // ✅ Logout method
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
