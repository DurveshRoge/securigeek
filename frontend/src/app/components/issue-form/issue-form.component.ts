import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IssueService } from '../../services/issue.service';
import { Issue, CreateIssueRequest, UpdateIssueRequest } from '../../models/issue.model';

@Component({
  selector: 'app-issue-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './issue-form.component.html',
  styleUrls: ['./issue-form.component.css']
})
export class IssueFormComponent implements OnInit {
  @Input() issue: Issue | null = null;
  @Output() issueCreated = new EventEmitter<Issue>();
  @Output() issueUpdated = new EventEmitter<Issue>();
  @Output() cancelled = new EventEmitter<void>();

  formData = {
    title: '',
    description: '',
    status: 'open',
    priority: 'medium',
    assignee: ''
  };

  submitting = false;
  error = '';

  constructor(private issueService: IssueService) {}

  ngOnInit(): void {
    if (this.issue) {
      this.formData = {
        title: this.issue.title,
        description: this.issue.description,
        status: this.issue.status,
        priority: this.issue.priority,
        assignee: this.issue.assignee
      };
    }
  }

  get isEditing(): boolean {
    return !!this.issue;
  }

  get modalTitle(): string {
    return this.isEditing ? 'Edit Issue' : 'Create New Issue';
  }

  onSubmit(): void {
    if (!this.formData.title.trim()) {
      this.error = 'Title is required';
      return;
    }

    this.submitting = true;
    this.error = '';

    if (this.isEditing && this.issue) {
      const updateData: UpdateIssueRequest = {
        title: this.formData.title,
        description: this.formData.description,
        status: this.formData.status,
        priority: this.formData.priority,
        assignee: this.formData.assignee
      };

      this.issueService.updateIssue(this.issue.id, updateData).subscribe({
        next: (updatedIssue: Issue) => {
          this.issueUpdated.emit(updatedIssue);
          this.submitting = false;
        },
        error: (error) => {
          console.error('Error updating issue:', error);
          this.error = 'Failed to update issue';
          this.submitting = false;
        }
      });
    } else {
      const createData: CreateIssueRequest = {
        title: this.formData.title,
        description: this.formData.description,
        status: this.formData.status,
        priority: this.formData.priority,
        assignee: this.formData.assignee
      };

      this.issueService.createIssue(createData).subscribe({
        next: (newIssue: Issue) => {
          this.issueCreated.emit(newIssue);
          this.submitting = false;
        },
        error: (error) => {
          console.error('Error creating issue:', error);
          this.error = 'Failed to create issue';
          this.submitting = false;
        }
      });
    }
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}