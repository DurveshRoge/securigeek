import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IssueService } from '../../services/issue.service';
import { Issue } from '../../models/issue.model';

@Component({
  selector: 'app-issue-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './issue-detail.component.html',
  styleUrls: ['./issue-detail.component.css']
})
export class IssueDetailComponent implements OnInit {
  issue: Issue | null = null;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private issueService: IssueService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadIssue(id);
    }
  }

  loadIssue(id: string): void {
    this.loading = true;
    this.issueService.getIssue(id).subscribe({
      next: (issue: Issue) => {
        this.issue = issue;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading issue:', error);
        this.error = 'Issue not found';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/issues']);
  }

  getStatusClass(status: string): string {
    return `status-badge status-${status}`;
  }

  getPriorityClass(priority: string): string {
    return `priority-${priority}`;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }
}