#!/bin/bash

# Enhanced AI Chatbot Platform - Setup Script
# This script automates the installation and setup process

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${YELLOW}➜${NC} $1"
}

print_header() {
    echo ""
    echo "=================================="
    echo "$1"
    echo "=================================="
    echo ""
}

check_command() {
    if command -v $1 &> /dev/null; then
        print_success "$1 is installed"
        return 0
    else
        print_error "$1 is not installed"
        return 1
    fi
}

# Main setup
print_header "Enhanced AI Chatbot Platform Setup"

# Check Python
print_info "Checking Python installation..."
if check_command python3; then
    PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
    print_info "Python version: $PYTHON_VERSION"
else
    print_error "Python 3.8+ is required. Please install Python first."
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "app.py" ]; then
    print_error "app.py not found. Please run this script from the project root directory."
    exit 1
fi

# Create virtual environment
print_info "Creating virtual environment..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
    print_success "Virtual environment created"
else
    print_info "Virtual environment already exists"
fi

# Activate virtual environment
print_info "Activating virtual environment..."
source venv/bin/activate
print_success "Virtual environment activated"

# Upgrade pip
print_info "Upgrading pip..."
pip install --upgrade pip > /dev/null 2>&1
print_success "Pip upgraded"

# Install dependencies
print_info "Installing Python dependencies (this may take a few minutes)..."
pip install -r requirements.txt > /dev/null 2>&1
print_success "Dependencies installed"

# Create necessary directories
print_info "Creating necessary directories..."
mkdir -p vector_stores logs local_db
print_success "Directories created"

# Setup environment file
print_info "Setting up environment configuration..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    print_success ".env file created from template"
    print_info "Please edit .env file with your configuration"
else
    print_info ".env file already exists"
fi

# Check for Ollama
print_header "Checking Ollama Installation"
if check_command ollama; then
    print_success "Ollama is installed"
    
    # Check if Ollama is running
    if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
        print_success "Ollama service is running"
        
        # Check for model
        if ollama list | grep -q "llama3.2:3b"; then
            print_success "llama3.2:3b model is installed"
        else
            print_info "llama3.2:3b model not found. Pulling model..."
            print_info "This will download about 2GB of data. Please wait..."
            ollama pull llama3.2:3b
            print_success "Model downloaded successfully"
        fi
    else
        print_info "Ollama is not running. Starting Ollama..."
        print_info "You may need to run 'ollama serve' in a separate terminal"
    fi
else
    print_error "Ollama is not installed"
    print_info "Please install Ollama from: https://ollama.ai/download"
    print_info ""
    print_info "Installation commands:"
    print_info "  macOS/Linux: curl -fsSL https://ollama.ai/install.sh | sh"
    print_info "  Windows: Download from https://ollama.ai/download/windows"
fi

# Check MongoDB
print_header "Checking MongoDB Configuration"
if [ -f ".env" ]; then
    if grep -q "MONGO_URI=mongodb://" .env || grep -q "MONGO_URI=mongodb+srv://" .env; then
        print_success "MongoDB URI configured in .env"
        print_info "The app will use MongoDB for data storage"
    else
        print_info "MongoDB URI not configured"
        print_info "The app will fall back to local JSON storage"
    fi
else
    print_info "No .env file found. Please create one from .env.example"
fi

# Create sample local_db files if they don't exist
if [ ! -f "local_db/sessions.json" ]; then
    echo "[]" > local_db/sessions.json
    print_success "Created local_db/sessions.json"
fi

if [ ! -f "local_db/conversations.json" ]; then
    echo "[]" > local_db/conversations.json
    print_success "Created local_db/conversations.json"
fi

# Setup complete
print_header "Setup Complete!"

echo "Next steps:"
echo ""
echo "1. Make sure Ollama is running:"
echo "   $ ollama serve"
echo ""
echo "2. (Optional) Edit .env file with your configuration:"
echo "   $ nano .env"
echo ""
echo "3. Start the application:"
echo "   $ python app.py"
echo ""
echo "4. Open your browser to:"
echo "   http://localhost:5002"
echo ""
echo "For more information, see:"
echo "  - README.md for general documentation"
echo "  - QUICKSTART.md for quick start guide"
echo "  - IMPLEMENTATION_GUIDE.md for detailed setup"
echo ""
print_success "Happy chatting! 🤖"
