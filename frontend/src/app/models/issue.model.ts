export interface Issue {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  createdAt: string;
  updatedAt: string;
}

export interface IssuesResponse {
  issues: Issue[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateIssueRequest {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  assignee?: string;
}

export interface UpdateIssueRequest {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  assignee?: string;
}