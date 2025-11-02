#!/usr/bin/env python3
"""
Test setup script for the Enhanced AI Chatbot Platform
This script helps verify that all dependencies and services are properly configured.
"""

import sys
import subprocess
import importlib
import requests
import json
from pathlib import Path

def check_python_version():
    """Check if Python version is 3.8 or higher"""
    print("Checking Python version...")
    version = sys.version_info
    if version.major == 3 and version.minor >= 8:
        print(f"✓ Python {version.major}.{version.minor}.{version.micro} is supported")
        return True
    else:
        print(f"✗ Python {version.major}.{version.minor}.{version.micro} is not supported. Please use Python 3.8+")
        return False

def check_dependencies():
    """Check if all required Python packages are installed"""
    print("\nChecking Python dependencies...")
    
    required_packages = [
        'flask',
        'flask_cors',
        'requests',
        'pymongo',
        'langchain',
        'langchain_community',
        'langchain_huggingface',
        'faiss',
        'sentence_transformers',
        'PyMuPDF',
        'pypdf',
        'docx',
        'werkzeug'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            if package == 'docx':
                importlib.import_module('docx')
            elif package == 'faiss':
                importlib.import_module('faiss')
            else:
                importlib.import_module(package)
            print(f"✓ {package}")
        except ImportError:
            print(f"✗ {package}")
            missing_packages.append(package)
    
    if missing_packages:
        print(f"\nMissing packages: {', '.join(missing_packages)}")
        print("Install them with: pip install -r requirements.txt")
        return False
    else:
        print("✓ All dependencies are installed")
        return True

def check_ollama():
    """Check if Ollama is running and has the required model"""
    print("\nChecking Ollama service...")
    
    try:
        # Check if Ollama is running
        response = requests.get("http://localhost:11434/api/tags", timeout=5)
        if response.status_code == 200:
            print("✓ Ollama service is running")
            
            # Check if llama3 model is available
            models = response.json()
            model_names = [model['name'] for model in models.get('models', [])]
            
            if any('llama3' in name for name in model_names):
                print("✓ LLaMA3 model is available")
                return True
            else:
                print("✗ LLaMA3 model not found")
                print("Install it with: ollama pull llama3")
                return False
        else:
            print("✗ Ollama service is not responding properly")
            return False
            
    except requests.exceptions.RequestException:
        print("✗ Ollama service is not running")
        print("Start it with: ollama serve")
        return False

def check_mongodb():
    """Check if MongoDB connection can be established"""
    print("\nChecking MongoDB connection...")
    
    try:
        from pymongo import MongoClient
        
        # Try to connect with a test URI (you should update this)
        test_uri = "mongodb://localhost:27017/"  # Default local MongoDB
        client = MongoClient(test_uri, serverSelectionTimeoutMS=5000)
        
        # Test the connection
        client.admin.command('ping')
        print("✓ MongoDB connection successful (local)")
        client.close()
        return True
        
    except Exception as e:
        print(f"✗ MongoDB connection failed: {e}")
        print("Please ensure MongoDB is running or update the connection string in app.py")
        return False

def check_file_structure():
    """Check if all required files are present"""
    print("\nChecking file structure...")
    
    required_files = [
        'app.py',
        'requirements.txt',
        'templates/dashboard.html',
        'static/dashboard.css',
        'static/dashboard.js'
    ]
    
    missing_files = []
    
    for file_path in required_files:
        if Path(file_path).exists():
            print(f"✓ {file_path}")
        else:
            print(f"✗ {file_path}")
            missing_files.append(file_path)
    
    if missing_files:
        print(f"\nMissing files: {', '.join(missing_files)}")
        return False
    else:
        print("✓ All required files are present")
        return True

def create_directories():
    """Create necessary directories"""
    print("\nCreating necessary directories...")
    
    directories = [
        'vector_stores',
        'static',
        'templates'
    ]
    
    for directory in directories:
        Path(directory).mkdir(exist_ok=True)
        print(f"✓ {directory}/")
    
    return True

def test_basic_functionality():
    """Test basic application functionality"""
    print("\nTesting basic functionality...")
    
    try:
        # Import the main app
        from app import app
        print("✓ App imports successfully")
        
        # Test app configuration
        if app.config.get('DEBUG'):
            print("✓ Debug mode is enabled")
        
        # Test route registration
        routes = [rule.rule for rule in app.url_map.iter_rules()]
        expected_routes = ['/', '/api/sessions/create', '/api/sessions/<session_id>/chat']
        
        for route in expected_routes:
            if any(route in r for r in routes):
                print(f"✓ Route {route} is registered")
            else:
                print(f"✗ Route {route} is missing")
                return False
        
        return True
        
    except Exception as e:
        print(f"✗ App functionality test failed: {e}")
        return False

def main():
    """Run all checks"""
    print("Enhanced AI Chatbot Platform - Setup Verification")
    print("=" * 50)
    
    checks = [
        check_python_version,
        check_file_structure,
        create_directories,
        check_dependencies,
        check_ollama,
        check_mongodb,
        test_basic_functionality
    ]
    
    results = []
    
    for check in checks:
        try:
            result = check()
            results.append(result)
        except Exception as e:
            print(f"✗ Check failed with error: {e}")
            results.append(False)
    
    print("\n" + "=" * 50)
    print("SETUP VERIFICATION SUMMARY")
    print("=" * 50)
    
    passed = sum(results)
    total = len(results)
    
    if passed == total:
        print(f"✓ All checks passed ({passed}/{total})")
        print("\nYour setup is ready! You can start the application with:")
        print("python app.py")
    else:
        print(f"✗ {total - passed} checks failed ({passed}/{total})")
        print("\nPlease fix the issues above before starting the application.")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)

