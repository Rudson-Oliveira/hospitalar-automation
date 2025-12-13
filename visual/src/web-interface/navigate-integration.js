/**
 * Integração de Navegação Real com Playwright
 * Detecta comandos "Navegue para" e chama o endpoint /agent/navigate
 */

class NavigationManager {
  constructor() {
    this.isNavigating = false;
    this.currentUrl = null;
    this.screenshotContainer = null;
    this.initializeUI();
  }

  /**
   * Inicializa elementos da UI
   */
  initializeUI() {
    // Criar container para screenshot se não existir
    const existingContainer = document.getElementById('screenshot-container');
    if (!existingContainer) {
      const container = document.createElement('div');
      container.id = 'screenshot-container';
      container.style.cssText = `
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #0f172a;
        border-radius: 8px;
        overflow: auto;
        padding: 16px;
      `;
      
      const placeholder = document.createElement('div');
      placeholder.id = 'screenshot-placeholder';
      placeholder.style.cssText = `
        color: #94a3b8;
        text-align: center;
        font-size: 14px;
      `;
      placeholder.textContent = '📸 Screenshots de navegação aparecerão aqui';
      
      container.appendChild(placeholder);
      
      // Encontrar painel direito (visualização)
      const rightPanel = document.querySelector('[data-panel="visualization"]') || 
                        document.querySelector('.visualization-panel') ||
                        document.querySelector('.right-panel');
      
      if (rightPanel) {
        rightPanel.appendChild(container);
      } else {
        document.body.appendChild(container);
      }
      
      this.screenshotContainer = container;
    } else {
      this.screenshotContainer = existingContainer;
    }
  }

  /**
   * Detecta se a mensagem contém comando de navegação
   */
  detectNavigationCommand(message) {
    const patterns = [
      /navegue para\s+(.+)/i,
      /navegar para\s+(.+)/i,
      /abra\s+(.+)/i,
      /acesse\s+(.+)/i,
      /vá para\s+(.+)/i,
      /visite\s+(.+)/i,
      /go to\s+(.+)/i,
      /navigate to\s+(.+)/i,
      /open\s+(.+)/i,
      /visit\s+(.+)/i
    ];

    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }

    return null;
  }

  /**
   * Navega para uma URL e exibe o screenshot
   */
  async navigate(url) {
    if (this.isNavigating) {
      console.warn('[NAVIGATE] Já existe uma navegação em andamento');
      return;
    }

    this.isNavigating = true;
    this.updateStatus('🔄 Navegando para ' + url + '...');

    try {
      // Chamar endpoint
      const response = await fetch('/agent/navigate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        this.currentUrl = result.url;
        this.displayScreenshot(result);
        this.updateStatus(`✅ Navegação concluída: ${result.title}`);
      } else {
        this.updateStatus(`❌ Erro: ${result.error}`);
      }
    } catch (error) {
      console.error('[NAVIGATE] Erro:', error);
      this.updateStatus(`❌ Erro ao navegar: ${error.message}`);
    } finally {
      this.isNavigating = false;
    }
  }

  /**
   * Exibe o screenshot no container
   */
  displayScreenshot(result) {
    const container = this.screenshotContainer;
    if (!container) return;

    // Limpar container
    container.innerHTML = '';

    // Criar elemento de imagem
    const img = document.createElement('img');
    img.src = `data:image/png;base64,${result.screenshot}`;
    img.style.cssText = `
      max-width: 100%;
      max-height: 100%;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;

    // Criar info
    const info = document.createElement('div');
    info.style.cssText = `
      position: absolute;
      top: 16px;
      left: 16px;
      background: rgba(15, 23, 42, 0.9);
      color: #e2e8f0;
      padding: 12px 16px;
      border-radius: 6px;
      font-size: 12px;
      border: 1px solid #334155;
      z-index: 10;
    `;
    info.innerHTML = `
      <div><strong>URL:</strong> ${result.url}</div>
      <div><strong>Título:</strong> ${result.title}</div>
      <div><strong>Capturado:</strong> ${new Date(result.timestamp).toLocaleTimeString('pt-BR')}</div>
    `;

    // Criar wrapper com posição relativa
    const wrapper = document.createElement('div');
    wrapper.style.cssText = `
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    wrapper.appendChild(img);
    wrapper.appendChild(info);
    container.appendChild(wrapper);
  }

  /**
   * Atualiza status na UI
   */
  updateStatus(message) {
    const statusElement = document.getElementById('navigation-status') ||
                         document.querySelector('[data-status="navigation"]');
    
    if (statusElement) {
      statusElement.textContent = message;
      statusElement.style.color = message.includes('✅') ? '#10b981' : 
                                   message.includes('❌') ? '#ef4444' : 
                                   '#3b82f6';
    } else {
      console.log('[NAVIGATE]', message);
    }
  }

  /**
   * Processa mensagem do usuário
   */
  async processMessage(message) {
    const url = this.detectNavigationCommand(message);
    if (url) {
      await this.navigate(url);
      return true;
    }
    return false;
  }
}

// Exportar para uso global
window.NavigationManager = NavigationManager;

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  window.navigationManager = new NavigationManager();
  console.log('[NAVIGATE] NavigationManager inicializado');
});
