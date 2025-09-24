from flask import Flask, request, jsonify
from datetime import datetime
import uuid
import os 
app = Flask(__name__)

# Simple CORS handling
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# In-memory storage for issues
issues = []

# Sample data
sample_issues = [
    {
        "id": str(uuid.uuid4()),
        "title": "Fix login bug",
        "description": "Users cannot login with special characters in password",
        "status": "open",
        "priority": "high",
        "assignee": "john.doe",
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Add dark mode",
        "description": "Implement dark mode theme for better user experience",
        "status": "in-progress",
        "priority": "medium",
        "assignee": "jane.smith",
        "createdAt": "2024-01-14T09:15:00Z",
        "updatedAt": "2024-01-16T14:20:00Z"
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Update documentation",
        "description": "API documentation needs to be updated with new endpoints",
        "status": "closed",
        "priority": "low",
        "assignee": "bob.wilson",
        "createdAt": "2024-01-10T08:00:00Z",
        "updatedAt": "2024-01-18T16:45:00Z"
    }
]

issues.extend(sample_issues)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"})

@app.route('/issues', methods=['GET'])
def get_issues():
    # Get query parameters
    search = request.args.get('search', '')
    status_filter = request.args.get('status', '')
    priority_filter = request.args.get('priority', '')
    assignee_filter = request.args.get('assignee', '')
    sort_by = request.args.get('sortBy', 'updatedAt')
    sort_order = request.args.get('sortOrder', 'desc')
    page = int(request.args.get('page', 1))
    page_size = int(request.args.get('pageSize', 10))
    
    # Filter issues
    filtered_issues = issues.copy()
    
    if search:
        filtered_issues = [issue for issue in filtered_issues 
                          if search.lower() in issue['title'].lower()]
    
    if status_filter:
        filtered_issues = [issue for issue in filtered_issues 
                          if issue['status'] == status_filter]
    
    if priority_filter:
        filtered_issues = [issue for issue in filtered_issues 
                          if issue['priority'] == priority_filter]
    
    if assignee_filter:
        filtered_issues = [issue for issue in filtered_issues 
                          if issue['assignee'] == assignee_filter]
    
    # Sort issues
    reverse = sort_order == 'desc'
    filtered_issues.sort(key=lambda x: x.get(sort_by, ''), reverse=reverse)
    
    # Pagination
    total = len(filtered_issues)
    start = (page - 1) * page_size
    end = start + page_size
    paginated_issues = filtered_issues[start:end]
    
    return jsonify({
        "issues": paginated_issues,
        "total": total,
        "page": page,
        "pageSize": page_size,
        "totalPages": (total + page_size - 1) // page_size
    })

@app.route('/issues/<issue_id>', methods=['GET'])
def get_issue(issue_id):
    issue = next((issue for issue in issues if issue['id'] == issue_id), None)
    if not issue:
        return jsonify({"error": "Issue not found"}), 404
    return jsonify(issue)

@app.route('/issues', methods=['POST'])
def create_issue():
    data = request.get_json()
    
    if not data or not data.get('title'):
        return jsonify({"error": "Title is required"}), 400
    
    new_issue = {
        "id": str(uuid.uuid4()),
        "title": data['title'],
        "description": data.get('description', ''),
        "status": data.get('status', 'open'),
        "priority": data.get('priority', 'medium'),
        "assignee": data.get('assignee', ''),
        "createdAt": datetime.utcnow().isoformat() + 'Z',
        "updatedAt": datetime.utcnow().isoformat() + 'Z'
    }
    
    issues.append(new_issue)
    return jsonify(new_issue), 201

@app.route('/issues/<issue_id>', methods=['PUT'])
def update_issue(issue_id):
    issue = next((issue for issue in issues if issue['id'] == issue_id), None)
    if not issue:
        return jsonify({"error": "Issue not found"}), 404
    
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    # Update fields
    for key in ['title', 'description', 'status', 'priority', 'assignee']:
        if key in data:
            issue[key] = data[key]
    
    issue['updatedAt'] = datetime.utcnow().isoformat() + 'Z'
    
    return jsonify(issue)
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))  # Use Render's port if available
    app.run(host='0.0.0.0', port=port, debug=True)