const messagesArea = document.getElementById('messages-area');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

function addMessage(text, sender) {
    const div = document.createElement('div');
    div.className = `message ${sender}`;
    
    const avatar = sender === 'bot' ? '🤖' : '👤';
    
    div.innerHTML = `
        <div class="avatar">${avatar}</div>
        <div class="content"><p>${text}</p></div>
    `;
    
    messagesArea.appendChild(div);
    messagesArea.scrollTop = messagesArea.scrollHeight;
}

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    // Adicionar mensagem do usuário
    addMessage(text, 'user');
    userInput.value = '';

    // Detectar e processar comando de navegação
    if (window.navigationManager) {
        const isNavigation = await window.navigationManager.processMessage(text);
        if (isNavigation) {
            return; // Comando de navegação foi processado
        }
    }

    // Feedback visual de carregando
    const loadingId = 'loading-' + Date.now();
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message bot';
    loadingDiv.id = loadingId;
    loadingDiv.innerHTML = `
        <div class="avatar">🤖</div>
        <div class="content"><p>...</p></div>
    `;
    messagesArea.appendChild(loadingDiv);
    messagesArea.scrollTop = messagesArea.scrollHeight;

    try {
        const response = await fetch('/agent/message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: text })
        });

        const data = await response.json();
        
        // Remover loading
        document.getElementById(loadingId).remove();

        if (data.success && data.response) {
            addMessage(data.response.content, 'bot');
        } else {
            addMessage('Desculpe, tive um erro ao processar sua mensagem.', 'bot');
        }
    } catch (error) {
        document.getElementById(loadingId).remove();
        addMessage('Erro de conexão com o servidor.', 'bot');
        console.error(error);
    }
}

sendBtn.addEventListener('click', sendMessage);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
