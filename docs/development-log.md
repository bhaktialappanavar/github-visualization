# Development Log

## Day 1 — Initial Project Setup

### Completed

- Created GitHubVisualization project
- Initialized Git repository
- Created Python virtual environment
- Activated virtual environment
- Installed Django
- Installed Django REST Framework
- Installed GitPython
- Created backend directory
- Created frontend directory
- Created documentation directory
- Created initial README
- Created .gitignore
- Created documentation structure

### Technology Setup

- Python
- Django
- Django REST Framework
- GitPython
- Git

### Current Status

Initial project environment is ready.

### Next

- Create Django project
- Create analyzer application
- Verify Django backend

## Day 2 — Django Backend Setup

### Completed

- Created the Django project
- Created the `analyzer` application
- Added Django REST Framework
- Registered the `analyzer` application
- Verified Django configuration
- Successfully started the Django development server

### Backend Structure

```text
backend/
├── manage.py
├── config/
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
│
└── analyzer/
    ├── migrations/
    ├── admin.py
    ├── apps.py
    ├── models.py
    ├── tests.py
    └── views.py

## Day 3 — Git Repository Analyzer

### Completed

- Integrated GitPython with the Django project
- Created the Git repository analyzer
- Extracted commit information
- Extracted commit author and email
- Extracted commit dates and messages
- Extracted files changed per commit
- Extracted additions and deletions
- Added contributor commit statistics
- Tested the analyzer using the project repository

### Current Analyzer Output

The analyzer currently provides:

- Commit details
- Contributor statistics
- Files changed
- Lines added
- Lines deleted
- Commit date and message

### Current Status

Git repository analysis is working successfully.

### Next

- Add weekday and time-based commit analysis
- Create the Django REST API
- Return repository analysis as JSON