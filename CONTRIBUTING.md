# Contributing to Enhanced AI Chatbot Platform

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- Clear and descriptive title
- Detailed steps to reproduce the issue
- Expected behavior vs actual behavior
- Screenshots if applicable
- Environment details (OS, Python version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- Clear and descriptive title
- Detailed description of the proposed feature
- Explanation of why this enhancement would be useful
- Possible implementation approach

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following the code style guidelines
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Submit a pull request** with a clear description

## Development Setup

```bash
# Clone your fork
git clone https://github.com/yourusername/Customisable_Chatbot.git
cd Customisable_Chatbot

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Install development dependencies
pip install pytest black flake8 pylint

# Set up pre-commit hooks (optional)
pip install pre-commit
pre-commit install
```

## Code Style Guidelines

### Python

- Follow PEP 8 style guide
- Use meaningful variable and function names
- Add docstrings to all functions and classes
- Keep functions focused and concise
- Use type hints where appropriate

```python
def process_document(file_path: str) -> List[Document]:
    """
    Process a single document and return Document objects.
    
    Args:
        file_path: Path to the document file
        
    Returns:
        List of Document objects with processed content
    """
    # Implementation
```

### JavaScript

- Use ES6+ syntax
- Use camelCase for variables and functions
- Add JSDoc comments for complex functions
- Use async/await for asynchronous operations

```javascript
/**
 * Upload files to the server
 * @param {File[]} files - Array of files to upload
 * @returns {Promise<Object>} Upload response
 */
async function uploadFiles(files) {
    // Implementation
}
```

### HTML/CSS

- Use semantic HTML5 elements
- Follow BEM naming convention for CSS classes
- Ensure responsive design
- Add ARIA labels for accessibility

## Testing

### Running Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=. --cov-report=html

# Run specific test file
pytest tests/test_api.py
```

### Writing Tests

- Write unit tests for new functions
- Write integration tests for API endpoints
- Ensure tests are isolated and repeatable
- Use descriptive test names

```python
def test_create_session_returns_valid_id():
    """Test that session creation returns a valid UUID"""
    response = client.post('/api/sessions/create', json={
        'user_description': 'Test Bot',
        'use_case': 'testing'
    })
    assert response.status_code == 200
    data = response.json()
    assert 'session_id' in data
    assert len(data['session_id']) == 36  # UUID length
```

## Code Review Process

All submissions require review. The review process includes:

1. **Automated checks**: Linting, tests, and builds must pass
2. **Code quality**: Review for code style, efficiency, and maintainability
3. **Functionality**: Ensure changes work as intended
4. **Documentation**: Check that documentation is updated
5. **Testing**: Verify adequate test coverage

## Commit Messages

Follow conventional commit format:

```
type(scope): subject

body (optional)

footer (optional)
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(api): add endpoint for bulk document upload

fix(chat): resolve memory leak in conversation history

docs(readme): update installation instructions
```

## Branch Naming

Use descriptive branch names:

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

Examples:
```
feature/voice-input
fix/mongodb-connection
docs/api-documentation
refactor/session-management
```

## Documentation

Update documentation when:

- Adding new features
- Changing existing functionality
- Modifying API endpoints
- Updating configuration options

Documentation files to update:
- `README.md` - Main documentation
- `IMPLEMENTATION_GUIDE.md` - Setup and implementation details
- API documentation - Endpoint changes
- Inline code comments - Function/class documentation

## Release Process

1. Update version number in `setup.py` or `__init__.py`
2. Update `CHANGELOG.md` with changes
3. Create a pull request to `main`
4. After merge, create a release tag
5. Publish release notes on GitHub

## Questions?

Feel free to:
- Open an issue for questions
- Start a discussion on GitHub Discussions
- Contact the maintainers directly

Thank you for contributing!
