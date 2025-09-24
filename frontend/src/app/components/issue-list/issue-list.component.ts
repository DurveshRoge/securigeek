import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IssueService } from '../../services/issue.service';
import { Issue, IssuesResponse } from '../../models/issue.model';
import { IssueFormComponent } from '../issue-form/issue-form.component';

@Component({
  selector: 'app-issue-list',
  standalone: true,
  imports: [CommonModule, FormsModule, IssueFormComponent],
  templateUrl: './issue-list.component.html',
  styleUrls: ['./issue-list.component.css']
})
export class IssueListComponent implements OnInit {
  issues: Issue[] = [];
  total = 0;
  page = 1;
  pageSize = 10;
  totalPages = 0;
  
  // Filters
  search = '';
  statusFilter = '';
  priorityFilter = '';
  assigneeFilter = '';
  
  // Sorting
  sortBy = 'updatedAt';
  sortOrder: 'asc' | 'desc' = 'desc';
  
  // UI state
  showCreateForm = false;
  editingIssue: Issue | null = null;
  loading = false;

  constructor(
    private issueService: IssueService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadIssues();
  }

  loadIssues(): void {
    this.loading = true;
    this.issueService.getIssues(
      this.search || undefined,
      this.statusFilter || undefined,
      this.priorityFilter || undefined,
      this.assigneeFilter || undefined,
      this.sortBy,
      this.sortOrder,
      this.page,
      this.pageSize
    ).subscribe({
      next: (response: IssuesResponse) => {
        this.issues = response.issues;
        this.total = response.total;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading issues:', error);
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.page = 1;
    this.loadIssues();
  }

  onFilterChange(): void {
    this.page = 1;
    this.loadIssues();
  }

  onSort(column: string): void {
    if (this.sortBy === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortOrder = 'asc';
    }
    this.loadIssues();
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.loadIssues();
  }

  onRowClick(issue: Issue, event: Event): void {
    // Don't navigate if clicking on edit button
    if ((event.target as HTMLElement).closest('.edit-btn')) {
      return;
    }
    this.router.navigate(['/issues', issue.id]);
  }

  onCreateIssue(): void {
    this.showCreateForm = true;
  }

  onEditIssue(issue: Issue): void {
    this.editingIssue = issue;
  }

  onIssueCreated(issue: Issue): void {
    this.showCreateForm = false;
    this.loadIssues();
  }

  onIssueUpdated(issue: Issue): void {
    this.editingIssue = null;
    this.loadIssues();
  }

  onFormCancelled(): void {
    this.showCreateForm = false;
    this.editingIssue = null;
  }

  getSortIcon(column: string): string {
    if (this.sortBy !== column) return '';
    return this.sortOrder === 'asc' ? '↑' : '↓';
  }

  getStatusClass(status: string): string {
    return `status-badge status-${status}`;
  }

  getPriorityClass(priority: string): string {
    return `priority-${priority}`;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}