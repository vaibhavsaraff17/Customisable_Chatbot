// Global state
let currentSession = null;
let currentConversationId = null;

// DOM elements
const navItems = document.querySelectorAll('.nav-item');
const contentSections = document.querySelectorAll('.content-section');
const loadingOverlay = document.getElementById('loading-overlay');
const toast = document.getElementById('toast');

// Initialize dashboard

document.addEventListener('DOMContentLoaded', function() {
    initializeDarkMode();
    initializeNavigation();
    initializeSessionSetup();
    initializeDocumentManagement();
    initializePromptEditor();
    initializeChatInterface();
    initializeHistory();
});

function initializeDarkMode() {
    const toggleBtn = document.getElementById('dark-mode-toggle');
    const icon = document.getElementById('dark-mode-icon');
    // Check localStorage for mode
    const savedMode = localStorage.getItem('dashboard-dark-mode');
    if (savedMode === 'dark') {
        document.body.classList.add('dark-mode');
        if (icon) { icon.classList.remove('fa-moon'); icon.classList.add('fa-sun'); }
    } else {
        document.body.classList.remove('dark-mode');
        if (icon) { icon.classList.remove('fa-sun'); icon.classList.add('fa-moon'); }
    }
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            if (icon) {
                if (isDark) {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                } else {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                }
            }
            localStorage.setItem('dashboard-dark-mode', isDark ? 'dark' : 'light');
        });
    }
}

// Navigation
function initializeNavigation() {
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.dataset.section;
            switchSection(section);
        });
    });
}

function switchSection(sectionName) {
    // Update navigation
    navItems.forEach(item => item.classList.remove('active'));
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
    
    // Update content
    contentSections.forEach(section => section.classList.remove('active'));
    document.getElementById(`${sectionName}-section`).classList.add('active');
    
    // Refresh section-specific data
    if (sectionName === 'documents' && currentSession) {
        loadDocuments();
    } else if (sectionName === 'prompts' && currentSession) {
        loadCurrentPrompt();
    } else if (sectionName === 'history' && currentSession) {
        loadConversationHistory();
    }
}

// Session Setup
function initializeSessionSetup() {
    const createForm = document.getElementById('create-session-form');
    const loadForm = document.getElementById('load-session-form');
    const sessionDropdown = document.getElementById('session-dropdown');
    const refreshBtn = document.getElementById('refresh-sessions-btn');
    
    createForm.addEventListener('submit', handleCreateSession);
    loadForm.addEventListener('submit', handleLoadSession);
    refreshBtn.addEventListener('click', handleRefreshSessions);
    
    // Load available sessions when page loads
    loadAvailableSessions();
    
    // Handle session dropdown change
    sessionDropdown.addEventListener('change', handleSessionDropdownChange);
}

async function handleRefreshSessions() {
    const refreshBtn = document.getElementById('refresh-sessions-btn');
    refreshBtn.classList.add('spinning');
    
    try {
        await loadAvailableSessions();
        showToast('Sessions list refreshed', 'success');
    } catch (error) {
        showToast('Failed to refresh sessions', 'error');
    } finally {
        refreshBtn.classList.remove('spinning');
    }
}

async function loadAvailableSessions() {
    const dropdown = document.getElementById('session-dropdown');
    const loadBtn = document.getElementById('load-session-btn');
    
    try {
        dropdown.innerHTML = '<option value="">Loading sessions...</option>';
        loadBtn.disabled = true;
        
        console.log('Fetching sessions from /api/sessions/list'); // Debug log
        const response = await fetch('/api/sessions/list');
        const data = await response.json();
        
        console.log('Sessions response:', data); // Debug log
        
        if (response.ok && data.sessions && data.sessions.length > 0) {
            dropdown.innerHTML = '<option value="">Select a session...</option>';
            
            data.sessions.forEach(session => {
                const option = document.createElement('option');
                option.value = session.session_id;
                
                // Create user-friendly display text
                const displayName = session.display_name;
                const docCount = session.documents_count;
                const status = session.vector_store_ready ? '✓' : '⚠';
                const shortId = session.short_id;
                
                option.textContent = `${displayName} (${docCount} docs) ${status} - ${shortId}`;
                option.dataset.session = JSON.stringify(session);
                
                dropdown.appendChild(option);
            });
            console.log(`Loaded ${data.sessions.length} sessions`); // Debug log
        } else if (response.ok && data.sessions && data.sessions.length === 0) {
            dropdown.innerHTML = '<option value="" disabled>No sessions found</option>';
            console.log('No sessions found in response'); // Debug log
        } else {
            dropdown.innerHTML = '<option value="" disabled>Error loading sessions</option>';
            console.error('Error response:', data); // Debug log
        }
    } catch (error) {
        console.error('Failed to load sessions:', error);
        dropdown.innerHTML = '<option value="" disabled>Failed to load sessions</option>';
    }
}

function handleSessionDropdownChange(e) {
    const selectedValue = e.target.value;
    const sessionDetails = document.getElementById('session-details');
    const loadBtn = document.getElementById('load-session-btn');
    
    if (selectedValue) {
        const selectedOption = e.target.options[e.target.selectedIndex];
        const sessionData = JSON.parse(selectedOption.dataset.session);
        
        // Show session details
        document.getElementById('selected-docs-count').textContent = sessionData.documents_count;
        document.getElementById('selected-vector-status').textContent = 
            sessionData.vector_store_ready ? 'Ready' : 'Not Ready';
        document.getElementById('selected-created-date').textContent = 
            new Date(sessionData.created_at).toLocaleDateString();
        
        sessionDetails.style.display = 'block';
        loadBtn.disabled = false;
    } else {
        sessionDetails.style.display = 'none';
        loadBtn.disabled = true;
    }
}

async function handleCreateSession(e) {
    e.preventDefault();
    
    const userDescription = document.getElementById('user-description').value;
    const useCase = document.getElementById('use-case').value;
    
    if (!userDescription.trim()) {
        showToast('Please enter a bot description', 'error');
        return;
    }
    
    showLoading('Creating session...');
    
    try {
        const response = await fetch('/api/sessions/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_description: userDescription,
                use_case: useCase
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            currentSession = data.session_id;
            updateSessionDisplay();
            showToast('Session created successfully!', 'success');
            document.getElementById('create-session-form').reset();
            
            // Refresh the sessions dropdown
            loadAvailableSessions();
        } else {
            showToast(data.error || 'Failed to create session', 'error');
        }
    } catch (error) {
        showToast('Network error: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

async function handleLoadSession(e) {
    e.preventDefault();
    
    const sessionId = document.getElementById('session-dropdown').value;
    
    if (!sessionId) {
        showToast('Please select a session', 'error');
        return;
    }
    
    showLoading('Loading session...');
    
    try {
        const response = await fetch(`/api/sessions/${sessionId}/status`);
        const data = await response.json();
        
        if (response.ok) {
            currentSession = sessionId;
            updateSessionDisplay(data);
            showToast('Session loaded successfully!', 'success');
            document.getElementById('load-session-form').reset();
            document.getElementById('session-details').style.display = 'none';
            document.getElementById('load-session-btn').disabled = true;
        } else {
            showToast(data.error || 'Session not found', 'error');
        }
    } catch (error) {
        showToast('Network error: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

async function updateSessionDisplay(sessionData = null) {
    if (!currentSession) return;
    
    // Update session info in sidebar
    document.getElementById('session-status-text').textContent = 'Active Session';
    document.getElementById('status-indicator').classList.remove('offline');
    document.getElementById('status-indicator').classList.add('online');
    document.getElementById('session-id-display').textContent = currentSession;
    
    // Show session overview
    const overview = document.getElementById('session-overview');
    overview.style.display = 'block';
    
    // Load session data if not provided
    if (!sessionData) {
        try {
            const response = await fetch(`/api/sessions/${currentSession}/status`);
            sessionData = await response.json();
        } catch (error) {
            console.error('Failed to load session data:', error);
            return;
        }
    }
    
    // Update overview stats
    document.getElementById('documents-count').textContent = sessionData.documents_count || 0;
    document.getElementById('vector-store-status').textContent = sessionData.vector_store_ready ? 'Ready' : 'Not Ready';
    document.getElementById('prompt-status').textContent = sessionData.custom_prompt ? 'Custom' : 'Default';
    
    // Enable chat interface
    enableChatInterface();
}

// Document Management
function initializeDocumentManagement() {
    const uploadZone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('file-input');
    const refreshBtn = document.getElementById('refresh-documents');
    
    // Click to upload
    uploadZone.addEventListener('click', () => fileInput.click());
    
    // Drag and drop
    uploadZone.addEventListener('dragover', handleDragOver);
    uploadZone.addEventListener('dragleave', handleDragLeave);
    uploadZone.addEventListener('drop', handleDrop);
    
    // File input change
    fileInput.addEventListener('change', handleFileSelect);
    
    // Refresh button
    refreshBtn.addEventListener('click', loadDocuments);
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    
    const files = Array.from(e.dataTransfer.files);
    uploadFiles(files);
}

function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    uploadFiles(files);
}

async function uploadFiles(files) {
    if (!currentSession) {
        showToast('Please create or load a session first', 'error');
        return;
    }
    
    if (files.length === 0) return;
    
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    
    // Show progress
    const progressContainer = document.getElementById('upload-progress');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    progressContainer.style.display = 'block';
    progressFill.style.width = '0%';
    progressText.textContent = 'Uploading files...';
    
    try {
        // Simulate progress
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += 10;
            progressFill.style.width = progress + '%';
            if (progress >= 90) {
                clearInterval(progressInterval);
                progressText.textContent = 'Processing documents...';
            }
        }, 200);
        
        const response = await fetch(`/api/sessions/${currentSession}/documents/upload`, {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        clearInterval(progressInterval);
        progressFill.style.width = '100%';
        
        if (response.ok) {
            progressText.textContent = 'Upload complete!';
            showToast(`Uploaded ${data.uploaded_files.length} files successfully`, 'success');
            
            if (data.errors.length > 0) {
                showToast(`Some files had errors: ${data.errors.join(', ')}`, 'warning');
            }
            
            // Refresh documents list and session status
            setTimeout(() => {
                progressContainer.style.display = 'none';
                loadDocuments();
                updateSessionDisplay();
            }, 1000);
        } else {
            progressText.textContent = 'Upload failed';
            showToast(data.error || 'Upload failed', 'error');
            setTimeout(() => {
                progressContainer.style.display = 'none';
            }, 2000);
        }
    } catch (error) {
        progressContainer.style.display = 'none';
        showToast('Network error: ' + error.message, 'error');
    }
}

async function loadDocuments() {
    if (!currentSession) return;
    
    try {
        const response = await fetch(`/api/sessions/${currentSession}/documents`);
        const data = await response.json();
        
        if (response.ok) {
            displayDocuments(data.documents);
        } else {
            showToast(data.error || 'Failed to load documents', 'error');
        }
    } catch (error) {
        showToast('Network error: ' + error.message, 'error');
    }
}

function displayDocuments(documents) {
    const container = document.getElementById('documents-table');
    
    if (documents.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-folder-open"></i>
                <p>No documents uploaded yet</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = documents.map(doc => `
        <div class="document-item">
            <div class="document-info">
                <div class="document-icon">
                    <i class="fas fa-file-${getFileIcon(doc.filename)}"></i>
                </div>
                <div class="document-details">
                    <h4>${doc.filename}</h4>
                    <div class="document-meta">
                        ${formatFileSize(doc.size)} • ${formatDate(doc.upload_date)}
                    </div>
                </div>
            </div>
            <div class="document-actions">
                <button class="action-btn delete" onclick="deleteDocument('${doc.filename}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function getFileIcon(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    switch (ext) {
        case 'pdf': return 'pdf';
        case 'docx': case 'doc': return 'word';
        case 'txt': return 'alt';
        case 'json': return 'code';
        default: return 'alt';
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
}

async function deleteDocument(filename) {
    if (!confirm(`Are you sure you want to delete "${filename}"?`)) return;
    
    showLoading('Deleting document...');
    
    try {
        const response = await fetch(`/api/sessions/${currentSession}/documents/${encodeURIComponent(filename)}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast('Document deleted successfully', 'success');
            loadDocuments();
            updateSessionDisplay();
        } else {
            showToast(data.error || 'Failed to delete document', 'error');
        }
    } catch (error) {
        showToast('Network error: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

// Prompt Editor
function initializePromptEditor() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const saveBtn = document.getElementById('save-prompt');
    const testBtn = document.getElementById('test-prompt');
    const templateCards = document.querySelectorAll('.template-card');
    
    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            switchTab(tabName);
        });
    });
    
    // Save prompt
    saveBtn.addEventListener('click', saveCustomPrompt);
    
    // Test prompt
    testBtn.addEventListener('click', testCustomPrompt);
    
    // Template selection
    templateCards.forEach(card => {
        card.addEventListener('click', () => {
            const template = card.dataset.template;
            loadTemplate(template);
        });
    });
}

function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

async function loadCurrentPrompt() {
    if (!currentSession) return;
    
    try {
        const response = await fetch(`/api/sessions/${currentSession}/prompt`);
        const data = await response.json();
        
        if (response.ok) {
            document.getElementById('custom-prompt').value = data.custom_prompt || '';
        }
    } catch (error) {
        console.error('Failed to load current prompt:', error);
    }
}

async function saveCustomPrompt() {
    if (!currentSession) {
        showToast('Please create or load a session first', 'error');
        return;
    }
    
    const customPrompt = document.getElementById('custom-prompt').value.trim();
    
    if (!customPrompt) {
        showToast('Please enter a custom prompt', 'error');
        return;
    }
    
    showLoading('Saving prompt...');
    
    try {
        const response = await fetch(`/api/sessions/${currentSession}/prompt`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                custom_prompt: customPrompt
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast('Prompt saved successfully!', 'success');
            updateSessionDisplay();
        } else {
            showToast(data.error || 'Failed to save prompt', 'error');
        }
    } catch (error) {
        showToast('Network error: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

async function testCustomPrompt() {
    if (!currentSession) {
        showToast('Please create or load a session first', 'error');
        return;
    }
    
    const customPrompt = document.getElementById('custom-prompt').value.trim();
    
    if (!customPrompt) {
        showToast('Please enter a custom prompt to test', 'error');
        return;
    }
    
    // Show preview section
    const preview = document.getElementById('prompt-preview');
    preview.style.display = 'block';
    
    const responseElement = document.getElementById('preview-response');
    responseElement.innerHTML = '<span>Testing prompt...</span>';
    
    try {
        const response = await fetch(`/api/sessions/${currentSession}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'How does this work?',
                conversation_id: 'test-' + Date.now()
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            responseElement.innerHTML = `<span>${data.response}</span>`;
        } else {
            responseElement.innerHTML = `<span style="color: #e53e3e;">Error: ${data.error}</span>`;
        }
    } catch (error) {
        responseElement.innerHTML = `<span style="color: #e53e3e;">Network error: ${error.message}</span>`;
    }
}

function loadTemplate(templateName) {
    const templates = {
        study: `You are a helpful study assistant. Your role is to help students understand their course materials by:

- Explaining complex concepts in simple terms
- Providing examples and analogies
- Breaking down problems into manageable steps
- Encouraging critical thinking

Always be patient, encouraging, and thorough in your explanations. Use the provided course materials to give accurate and relevant information.`,

        support: `You are a professional customer support assistant. Your role is to:

- Provide helpful and accurate information
- Resolve customer issues efficiently
- Maintain a friendly and professional tone
- Escalate complex issues when necessary

Always be courteous, patient, and solution-focused. Use the provided documentation to give accurate answers.`,

        technical: `You are a technical documentation assistant. Your role is to:

- Provide clear technical explanations
- Help with troubleshooting and problem-solving
- Reference relevant documentation and guides
- Break down complex technical concepts

Always be precise, thorough, and technically accurate. Use the provided technical documentation to give detailed answers.`
    };
    
    const promptText = templates[templateName];
    if (promptText) {
        document.getElementById('custom-prompt').value = promptText;
        switchTab('custom');
        showToast('Template loaded successfully', 'success');
    }
}

// Chat Interface
function initializeChatInterface() {
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
    const resetChatBtn = document.getElementById('reset-chat-btn');
    
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    sendButton.addEventListener('click', sendMessage);
    
    // Reset chat button functionality
    resetChatBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to start a new conversation? This will clear the current chat.')) {
            resetChat();
        }
    });
}

function enableChatInterface() {
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
    const chatStatus = document.getElementById('chat-status');
    const resetChatBtn = document.getElementById('reset-chat-btn');
    
    chatInput.disabled = false;
    sendButton.disabled = false;
    chatInput.placeholder = 'Type your message here...';
    chatStatus.textContent = 'Ready to chat!';
    
    // Show reset chat button
    resetChatBtn.style.display = 'block';
}

function resetChat() {
    // Generate new conversation ID
    currentConversationId = null;
    
    // Clear chat messages
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = `
        <div class="welcome-message">
            <div class="bot-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <h3>New Conversation Started!</h3>
                <p>I'm ready to help you with questions based on your uploaded documents and custom instructions.</p>
            </div>
        </div>
    `;
    
    // Show notification
    showToast('New conversation started', 'success');
}

async function sendMessage() {
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value.trim();
    
    if (!message || !currentSession) return;
    
    // Clear input
    chatInput.value = '';
    
    // Add user message to chat
    addMessageToChat(message, 'user');
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        const response = await fetch(`/api/sessions/${currentSession}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                conversation_id: currentConversationId
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Update conversation ID
            currentConversationId = data.conversation_id;
            
            // Add bot response to chat
            addMessageToChat(data.response, 'bot');
        } else {
            addMessageToChat('Sorry, I encountered an error: ' + (data.error || 'Unknown error'), 'bot');
        }
    } catch (error) {
        addMessageToChat('Sorry, I encountered a network error: ' + error.message, 'bot');
    } finally {
        hideTypingIndicator();
    }
}

function addMessageToChat(message, sender) {
    const chatMessages = document.getElementById('chat-messages');
    
    // Remove welcome message if it exists
    const welcomeMessage = chatMessages.querySelector('.welcome-message');
    if (welcomeMessage) {
        welcomeMessage.remove();
    }
    
    const messageElement = document.createElement('div');
    messageElement.className = `chat-message ${sender}`;
    
    const avatar = sender === 'user' ? 
        '<div class="user-avatar"><i class="fas fa-user"></i></div>' :
        '<div class="bot-avatar"><i class="fas fa-robot"></i></div>';
    
    let formattedMessage = message;
    // If sender is bot, render Markdown
    if (sender === 'bot' && window.marked) {
        formattedMessage = marked.parse(message);
    }
    messageElement.innerHTML = `
        ${avatar}
        <div class="message-bubble ${sender}">
            ${formattedMessage}
        </div>
    `;
    
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    const chatMessages = document.getElementById('chat-messages');
    
    const typingElement = document.createElement('div');
    typingElement.className = 'chat-message bot typing-indicator';
    typingElement.innerHTML = `
        <div class="bot-avatar"><i class="fas fa-robot"></i></div>
        <div class="message-bubble bot">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(typingElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// History Management
function initializeHistory() {
    const refreshBtn = document.getElementById('refresh-history');
    const clearAllBtn = document.getElementById('clear-all-history');
    
    refreshBtn.addEventListener('click', loadConversationHistory);
    clearAllBtn.addEventListener('click', clearAllHistory);
}

async function loadConversationHistory() {
    if (!currentSession) return;
    
    try {
        const response = await fetch(`/api/sessions/${currentSession}/conversations`);
        const data = await response.json();
        
        if (response.ok) {
            displayConversationHistory(data.conversations);
        } else {
            showToast(data.error || 'Failed to load conversation history', 'error');
        }
    } catch (error) {
        showToast('Network error: ' + error.message, 'error');
    }
}

function displayConversationHistory(conversations) {
    const container = document.getElementById('conversations-list');
    
    if (conversations.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-comments"></i>
                <p>No conversations yet</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = conversations.map(conv => {
        const firstMessage = conv.messages.find(m => m.message_type === 'user');
        const lastMessage = conv.messages[conv.messages.length - 1];
        
        return `
            <div class="conversation-item" onclick="viewConversation('${conv.id}')">
                <div class="conversation-header">
                    <div class="conversation-id">${conv.id}</div>
                    <div class="conversation-date">${formatDate(lastMessage.timestamp)}</div>
                </div>
                <div class="conversation-preview">
                    ${firstMessage ? firstMessage.message.substring(0, 100) + '...' : 'No messages'}
                </div>
            </div>
        `;
    }).join('');
}

function viewConversation(conversationId) {
    // Switch to chat section and load conversation
    switchSection('chat');
    currentConversationId = conversationId;
    
    // Load conversation messages
    loadConversationMessages(conversationId);
}

async function loadConversationMessages(conversationId) {
    if (!currentSession) return;
    
    try {
        const response = await fetch(`/api/sessions/${currentSession}/conversations`);
        const data = await response.json();
        
        if (response.ok) {
            const conversation = data.conversations.find(c => c.id === conversationId);
            if (conversation) {
                displayConversationMessages(conversation.messages);
            }
        }
    } catch (error) {
        console.error('Failed to load conversation messages:', error);
    }
}

function displayConversationMessages(messages) {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = '';
    
    messages.forEach(msg => {
        addMessageToChat(msg.message, msg.message_type);
    });
}

async function clearAllHistory() {
    if (!confirm('Are you sure you want to clear all conversation history?')) return;
    
    showLoading('Clearing history...');
    
    try {
        const response = await fetch(`/api/sessions/${currentSession}/conversations`);
        const data = await response.json();
        
        if (response.ok) {
            // Delete each conversation
            for (const conv of data.conversations) {
                await fetch(`/api/sessions/${currentSession}/conversations/${conv.id}`, {
                    method: 'DELETE'
                });
            }
            
            showToast('All conversation history cleared', 'success');
            loadConversationHistory();
            
            // Clear chat interface
            const chatMessages = document.getElementById('chat-messages');
            chatMessages.innerHTML = `
                <div class="welcome-message">
                    <div class="bot-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="message-content">
                        <h3>Welcome to your AI Assistant!</h3>
                        <p>I'm ready to help you with questions based on your uploaded documents and custom instructions.</p>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        showToast('Network error: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

// Utility Functions
function showLoading(message = 'Loading...') {
    const overlay = document.getElementById('loading-overlay');
    const text = overlay.querySelector('p');
    text.textContent = message;
    overlay.classList.add('show');
}

function hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    overlay.classList.remove('show');
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const icon = toast.querySelector('.toast-icon');
    const messageElement = toast.querySelector('.toast-message');
    
    // Set message
    messageElement.textContent = message;
    
    // Set type and icon
    toast.className = `toast ${type}`;
    
    switch (type) {
        case 'success':
            icon.className = 'toast-icon fas fa-check-circle';
            break;
        case 'error':
            icon.className = 'toast-icon fas fa-exclamation-circle';
            break;
        case 'warning':
            icon.className = 'toast-icon fas fa-exclamation-triangle';
            break;
        default:
            icon.className = 'toast-icon fas fa-info-circle';
    }
    
    // Show toast
    toast.classList.add('show');
    
    // Hide after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// Add CSS for typing indicator
const style = document.createElement('style');
style.textContent = `
    .typing-dots {
        display: flex;
        gap: 4px;
        align-items: center;
    }
    
    .typing-dots span {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #667eea;
        animation: typing 1.4s infinite ease-in-out;
    }
    
    .typing-dots span:nth-child(1) {
        animation-delay: -0.32s;
    }
    
    .typing-dots span:nth-child(2) {
        animation-delay: -0.16s;
    }
    
    @keyframes typing {
        0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
        }
        40% {
            transform: scale(1);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

