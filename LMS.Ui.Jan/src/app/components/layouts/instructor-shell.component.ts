import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-instructor-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="shell">
      <aside class="sidebar instructor">
        <div class="brand">Instructor</div>
        <nav>
          <a routerLink="/instructor/dashboard" routerLinkActive="active">Dashboard</a>
          <a routerLink="/instructor/my-courses" routerLinkActive="active">MyCourses</a>
          <a routerLink="/instructor/my-assignments" routerLinkActive="active">MyAssignments</a>
          <a routerLink="/instructor/submissions" routerLinkActive="active">Submissions</a>
        </nav>
        <div class="user-box" *ngIf="user">
          <div class="name">{{ user.firstName }} {{ user.lastName }}</div>
          <div class="email">{{ user.email }}</div>
          <button (click)="logout()">Logout</button>
        </div>
      </aside>
      <main class="content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .shell { display: grid; grid-template-columns: 260px 1fr; min-height: 100vh; background: #f7f8fb; }
    .sidebar { padding: 24px 18px; color: #fff; display: flex; flex-direction: column; gap: 18px; }
    .sidebar.instructor { background: linear-gradient(180deg, #11998e 0%, #38ef7d 100%); }
    .brand { font-size: 22px; font-weight: 700; letter-spacing: 0.5px; }
    nav { display: flex; flex-direction: column; gap: 10px; }
    nav a { padding: 12px 14px; border-radius: 10px; color: #fff; text-decoration: none; font-weight: 600; transition: background 0.2s, transform 0.1s; }
    nav a:hover { background: rgba(255,255,255,0.15); transform: translateX(4px); }
    nav a.active { background: rgba(255,255,255,0.25); }
    .user-box { margin-top: auto; background: rgba(255,255,255,0.15); padding: 14px; border-radius: 12px; }
    .user-box .name { font-weight: 700; }
    .user-box .email { font-size: 12px; opacity: 0.85; }
    .user-box button { margin-top: 10px; width: 100%; padding: 10px; border: none; border-radius: 8px; background: rgba(255,255,255,0.25); color: #fff; font-weight: 700; cursor: pointer; }
    .user-box button:hover { background: rgba(255,255,255,0.35); }
    .content { padding: 28px; }
    @media (max-width: 900px) { .shell { grid-template-columns: 1fr; } .sidebar { flex-direction: row; overflow-x: auto; } .user-box { display: none; } }
  `]
})
export class InstructorShellComponent implements OnInit{
  user :any = null;
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.user = this.authService.getUser();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
