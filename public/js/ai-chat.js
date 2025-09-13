// AI Chat functionality for Ctrl+Alt+Bharat
class AIChat {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.chatHistory = [];
        this.initializeElements();
        this.setupEventListeners();
    }

    initializeElements() {
        this.chatContainer = document.querySelector('.ai-chat-container');
        this.chatMessages = document.querySelector('.ai-chat-messages');
        this.userInput = document.querySelector('.ai-user-input');
        this.sendButton = document.querySelector('.ai-send-btn');
        this.suggestedQuestions = document.querySelectorAll('.suggested-question');
        this.toggleChat = document.querySelector('.ai-toggle-chat');
        this.aiChatInterface = document.querySelector('.ai-chat-interface');
    }

    setupEventListeners() {
        // Send message on button click
        this.sendButton.addEventListener('click', () => this.handleSendMessage());
        
        // Send message on Enter key
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSendMessage();
            }
        });

        // Suggested questions
        this.suggestedQuestions.forEach(question => {
            question.addEventListener('click', (e) => {
                this.userInput.value = e.target.textContent;
                this.handleSendMessage();
            });
        });

        // Toggle chat interface
        if (this.toggleChat) {
            this.toggleChat.addEventListener('click', () => {
                this.aiChatInterface.classList.toggle('active');
            });
        }
    }

    async handleSendMessage() {
        const message = this.userInput.value.trim();
        if (!message) return;

        // Add user message to chat
        this.addMessage('user', message);
        this.userInput.value = '';
        
        try {
            // Show typing indicator
            this.showTypingIndicator();
            
            // Get AI response
            const response = await this.getAIResponse(message);
            
            // Remove typing indicator and add AI response
            this.removeTypingIndicator();
            this.addMessage('assistant', response);
            
        } catch (error) {
            console.error('Error getting AI response:', error);
            this.removeTypingIndicator();
            this.addMessage('assistant', 'Sorry, I encountered an error. Please try again later.');
        }
    }

    async getAIResponse(message) {
        try {
            // Add user message to chat history
            this.chatHistory.push({
                role: 'user',
                parts: [{ text: message }]
            });

            // Format messages for Gemini API (only keep last 5 messages for context)
            const recentMessages = this.chatHistory.slice(-5);
            const contents = recentMessages.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.parts[0].text }]
            }));

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        role: 'user',
                        parts: [{
                            text: `You are a helpful AI assistant for an Indian heritage and culture website. Answer concisely and informatively. Here's the conversation so far:\n${recentMessages.map(m => `${m.role}: ${m.parts[0].text}`).join('\n')}`
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 1,
                        topP: 0.8,
                        maxOutputTokens: 500,
                    },
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error from Gemini API:', errorData);
                throw new Error(errorData.error?.message || 'Failed to get response from AI');
            }

            const data = await response.json();
            console.log('Gemini API Response:', data);
            
            // Extract the response text from the Gemini API response
            let aiResponse = 'I\'m not sure how to respond to that.';
            try {
                // Try to extract response from the Gemini API response structure
                if (data.candidates && data.candidates[0]?.content?.parts) {
                    aiResponse = data.candidates[0].content.parts[0].text;
                } else if (data.candidates?.[0]?.content?.text) {
                    aiResponse = data.candidates[0].content.text;
                } else if (data.text) {
                    aiResponse = data.text;
                } else if (data.choices?.[0]?.text) {
                    aiResponse = data.choices[0].text;
                }
                
                // Clean up the response if needed
                aiResponse = aiResponse.trim() || 'I\'m not sure how to respond to that.';
            } catch (e) {
                console.error('Error parsing AI response:', e);
            }
            
            // Add AI response to chat history
            this.chatHistory.push({
                role: 'model',
                parts: [{ text: aiResponse }]
            });

            return aiResponse;

        } catch (error) {
            console.error('Error in getAIResponse:', error);
            throw error;
        }
    }

    addMessage(role, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ${role}-message`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'ai-message-content';
        messageContent.textContent = content;
        
        messageDiv.appendChild(messageContent);
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'ai-message assistant-message ai-typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="ai-message-content">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </div>
        `;
        this.chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
    }

    removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
}

// Initialize the chat when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Replace with your actual API key
    const GEMINI_API_KEY = 'AIzaSyD7TPvDxHmbN230eGVWDzm2qmQBI4kDF5o';
    
    // Initialize the chat
    window.aiChat = new AIChat(GEMINI_API_KEY);
});
