# Project Documentation Index

Welcome to the Enhanced AI Chatbot Platform documentation! This index helps you find the right documentation for your needs.

## 🚀 Getting Started

### New Users
1. **[QUICKSTART.md](QUICKSTART.md)** - Get up and running in 5 minutes
2. **[README.md](README.md)** - Main documentation and feature overview
3. **[FAQ.md](FAQ.md)** - Common questions and answers

### Developers
1. **[IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)** - Detailed implementation guide
2. **[CONTRIBUTING.md](CONTRIBUTING.md)** - How to contribute to the project
3. **API Documentation** - See README.md for API endpoints

### System Administrators
1. **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment guide
2. **[SECURITY.md](SECURITY.md)** - Security best practices
3. **Docker Setup** - See docker-compose.yml and Dockerfile

## 📚 Documentation by Topic

### Installation & Setup
- [QUICKSTART.md](QUICKSTART.md) - Quick installation
- [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) - Detailed setup
- [setup.sh](setup.sh) - Automated setup script
- [requirements.txt](requirements.txt) - Python dependencies

### Configuration
- [.env.example](.env.example) - Environment variables template
- [config.py.example](config.py.example) - Configuration template
- [gunicorn_config.py](gunicorn_config.py) - Production server config

### Usage
- [README.md](README.md) - Basic usage guide
- [FAQ.md](FAQ.md) - Frequently asked questions
- [API Documentation](#api-documentation) - REST API reference

### Development
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines
- [CHANGELOG.md](CHANGELOG.md) - Version history
- [LICENSE](LICENSE) - MIT License

### Deployment
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment strategies
- [Dockerfile](Dockerfile) - Container image definition
- [docker-compose.yml](docker-compose.yml) - Multi-container setup

### Migration
- [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) - Upgrade from v1.0 to v2.0

### Security
- [SECURITY.md](SECURITY.md) - Security policy and best practices
- [.gitignore](.gitignore) - Files excluded from version control

## 🎯 Quick Links by Role

### I'm a User
- Start here: [QUICKSTART.md](QUICKSTART.md)
- Need help? [FAQ.md](FAQ.md)
- Report issue: [GitHub Issues](https://github.com/vaibhavsaraff17/Customisable_Chatbot/issues)

### I'm a Developer
- Setup dev environment: [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)
- Want to contribute: [CONTRIBUTING.md](CONTRIBUTING.md)
- Check changes: [CHANGELOG.md](CHANGELOG.md)

### I'm a DevOps Engineer
- Deploy to production: [DEPLOYMENT.md](DEPLOYMENT.md)
- Use Docker: [docker-compose.yml](docker-compose.yml)
- Security hardening: [SECURITY.md](SECURITY.md)

### I'm Migrating
- From v1.0: [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)
- Breaking changes: [CHANGELOG.md](CHANGELOG.md)

## 📖 API Documentation

### Quick Reference

**Base URL**: `http://localhost:5002/api`

### Endpoints

#### Session Management
- `POST /sessions/create` - Create new session
- `GET /sessions/list` - List all sessions
- `GET /sessions/{id}/status` - Get session info

#### Documents
- `POST /sessions/{id}/documents/upload` - Upload files
- `GET /sessions/{id}/documents` - List documents
- `DELETE /sessions/{id}/documents/{filename}` - Delete file

#### Chat
- `POST /sessions/{id}/chat` - Send message
- `GET /sessions/{id}/conversations` - Get history
- `DELETE /sessions/{id}/conversations/{id}` - Clear history

#### Configuration
- `PUT /sessions/{id}/prompt` - Set custom instructions
- `GET /sessions/{id}/prompt` - Get instructions

#### System
- `GET /health` - Health check

For detailed API documentation, see [README.md#api-documentation](README.md#api-documentation)

## 🔍 Search Documentation

Can't find what you're looking for? Try:

1. **Search this repository**: Use GitHub's search (press `/`)
2. **Check FAQ**: [FAQ.md](FAQ.md) has common questions
3. **GitHub Issues**: Search closed issues for solutions
4. **Discussions**: [GitHub Discussions](https://github.com/vaibhavsaraff17/Customisable_Chatbot/discussions)

## 📝 Documentation Structure

```
docs/
├── README.md (you are here)       # Documentation index
├── QUICKSTART.md                  # 5-minute guide
├── README.md (root)               # Main documentation
├── IMPLEMENTATION_GUIDE.md        # Detailed setup
├── DEPLOYMENT.md                  # Production deployment
├── MIGRATION_GUIDE.md             # Version migration
├── CONTRIBUTING.md                # Contribution guide
├── CHANGELOG.md                   # Version history
├── FAQ.md                         # Common questions
├── SECURITY.md                    # Security policy
└── LICENSE                        # MIT License
```

## 🆘 Getting Help

### Self-Help Resources
1. Check [FAQ.md](FAQ.md)
2. Search [GitHub Issues](https://github.com/vaibhavsaraff17/Customisable_Chatbot/issues)
3. Read relevant documentation above

### Community Support
- **Discussions**: [GitHub Discussions](https://github.com/vaibhavsaraff17/Customisable_Chatbot/discussions)
- **Issues**: [Report bugs](https://github.com/vaibhavsaraff17/Customisable_Chatbot/issues/new)

### Direct Contact
- **Email**: vaibhav.saraff@example.com
- **Repository**: [github.com/vaibhavsaraff17/Customisable_Chatbot](https://github.com/vaibhavsaraff17/Customisable_Chatbot)

## 🤝 Contributing to Documentation

Found an error or want to improve the docs?

1. Fork the repository
2. Edit the documentation
3. Submit a pull request

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

This project and its documentation are licensed under the MIT License.
See [LICENSE](LICENSE) for details.

---

**Last Updated**: November 2, 2025
**Version**: 2.0.0
