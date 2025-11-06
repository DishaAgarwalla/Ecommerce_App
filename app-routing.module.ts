import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// 🏠 Pages
import { HomeComponent } from './pages/home/home.component';
import { ShopComponent } from './pages/shop/shop.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { LoginComponent } from './pages/auth/login.component';
import { RegisterComponent } from './pages/auth/register.component';
import { ProductDetailComponent } from './pages/product/product-detail.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { OrderConfirmationComponent } from './pages/order-confirmation/order-confirmation.component';
import { SearchResultsComponent } from './pages/search-results/search-results.component';

// 🧾 Order Pages
import { OrdersComponent } from './pages/orders/orders.component';
import { OrderDetailComponent } from './pages/order-detail/order-detail.component';

// 🔐 Guards
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },             // 🏠 Default route
  { path: 'shop', component: ShopComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [AdminGuard] },
  { path: 'order-confirmation/:id', component: OrderConfirmationComponent },
  { path: 'search', component: SearchResultsComponent },

  // ✅ Orders pages
  { path: 'orders', component: OrdersComponent },
  { path: 'orders/:id', component: OrderDetailComponent },

  // 🌀 Fallback route
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
