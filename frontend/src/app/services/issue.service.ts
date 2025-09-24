import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Issue, IssuesResponse, CreateIssueRequest, UpdateIssueRequest } from '../models/issue.model';

@Injectable({
  providedIn: 'root'
})
export class IssueService {
  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  getIssues(
    search?: string,
    status?: string,
    priority?: string,
    assignee?: string,
    sortBy?: string,
    sortOrder?: string,
    page?: number,
    pageSize?: number
  ): Observable<IssuesResponse> {
    let params = new HttpParams();
    
    if (search) params = params.set('search', search);
    if (status) params = params.set('status', status);
    if (priority) params = params.set('priority', priority);
    if (assignee) params = params.set('assignee', assignee);
    if (sortBy) params = params.set('sortBy', sortBy);
    if (sortOrder) params = params.set('sortOrder', sortOrder);
    if (page) params = params.set('page', page.toString());
    if (pageSize) params = params.set('pageSize', pageSize.toString());

    return this.http.get<IssuesResponse>(`${this.apiUrl}/issues`, { params });
  }

  getIssue(id: string): Observable<Issue> {
    return this.http.get<Issue>(`${this.apiUrl}/issues/${id}`);
  }

  createIssue(issue: CreateIssueRequest): Observable<Issue> {
    return this.http.post<Issue>(`${this.apiUrl}/issues`, issue);
  }

  updateIssue(id: string, issue: UpdateIssueRequest): Observable<Issue> {
    return this.http.put<Issue>(`${this.apiUrl}/issues/${id}`, issue);
  }

  checkHealth(): Observable<{status: string}> {
    return this.http.get<{status: string}>(`${this.apiUrl}/health`);
  }
}