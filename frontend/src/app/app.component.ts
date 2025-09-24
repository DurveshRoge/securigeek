import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="container">
      <header style="margin-bottom: 30px;">
        <h1>Issue Tracker</h1>
      </header>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    header h1 {
      color: #333;
      font-size: 28px;
      font-weight: 600;
    }
  `]
})
export class AppComponent {
  title = 'Issue Tracker';
}