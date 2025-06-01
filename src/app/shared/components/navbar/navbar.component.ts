import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';



@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  constructor(
    private themeService: ThemeService,
    private authService: AuthService,
    private router: Router,
  ) {}

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  get isDarkTheme(): boolean {
    return this.themeService.currentTheme === 'dark';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}
