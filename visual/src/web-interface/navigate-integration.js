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
    // Aguardar DOM estar completamente carregado
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupContainer());
    } else {
      this.setupContainer();
    }
  }

  /**
   * Configura o container de screenshot
   */
  setupContainer() {
    // Buscar container existente no HTML
    const existingContainer = document.getElementById('screenshot-container');
    
    if (existingContainer) {
      this.screenshotContainer = existingContainer;
      console.log('[NAVIGATE] Container encontrado:', existingContainer);
    } else {
      // Criar container se não existir
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
      console.log('[NAVIGATE] Container criado:', container);
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
    console.log('[NAVIGATE] Iniciando navegação para:', url);

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
      console.log('[NAVIGATE] Resposta recebida:', {
        success: result.success,
        url: result.url,
        title: result.title,
        hasScreenshot: !!result.screenshot,
        screenshotLength: result.screenshot ? result.screenshot.length : 0
      });

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
   * Exibe o screenshot no container - VERSÃO SIMPLIFICADA E ROBUSTA
   */
  displayScreenshot(result) {
    console.log('[NAVIGATE] displayScreenshot chamado');
    console.log('[NAVIGATE] Container:', this.screenshotContainer);
    console.log('[NAVIGATE] Result:', result);

    const container = this.screenshotContainer;
    
    // Validações
    if (!container) {
      console.error('[NAVIGATE] Container não encontrado!');
      return;
    }

    if (!result || !result.screenshot) {
      console.error('[NAVIGATE] Screenshot não encontrado no resultado!');
      return;
    }

    console.log('[NAVIGATE] Limpando container...');
    // Limpar container completamente
    container.innerHTML = '';
    
    // RESETAR ESTILOS DO CONTAINER para garantir que não haja interferência
    container.style.cssText = `
      width: 100%;
      height: 100%;
      display: block;
      background: #0f172a;
      border-radius: 8px;
      overflow: auto;
      padding: 0;
      position: relative;
    `;

    console.log('[NAVIGATE] Criando elementos...');
    
    // Criar imagem DIRETAMENTE no container (sem wrapper)
    const img = document.createElement('img');
    img.src = `data:image/png;base64,${result.screenshot}`;
    img.alt = `Screenshot de ${result.title}`;
    img.id = 'screenshot-image';
    img.style.cssText = `
      width: 100%;
      height: auto;
      display: block;
      margin: 0;
      padding: 0;
    `;

    // Log quando a imagem carregar
    img.onload = () => {
      console.log('[NAVIGATE] ✅ Imagem carregada com sucesso!');
      console.log('[NAVIGATE] Dimensões naturais:', img.naturalWidth, 'x', img.naturalHeight);
      console.log('[NAVIGATE] Dimensões renderizadas:', img.width, 'x', img.height);
    };

    // Log se houver erro ao carregar
    img.onerror = (error) => {
      console.error('[NAVIGATE] ❌ Erro ao carregar imagem:', error);
      container.innerHTML = '<div style="color: red; padding: 20px;">Erro ao carregar screenshot</div>';
    };

    // Criar info overlay
    const info = document.createElement('div');
    info.id = 'screenshot-info';
    info.style.cssText = `
      position: absolute;
      top: 16px;
      left: 16px;
      background: rgba(15, 23, 42, 0.95);
      color: #e2e8f0;
      padding: 12px 16px;
      border-radius: 6px;
      font-size: 12px;
      border: 1px solid #334155;
      z-index: 1000;
      max-width: 300px;
      pointer-events: none;
    `;
    info.innerHTML = `
      <div><strong>URL:</strong> ${result.url}</div>
      <div><strong>Título:</strong> ${result.title}</div>
      <div><strong>Capturado:</strong> ${new Date(result.timestamp).toLocaleTimeString('pt-BR')}</div>
    `;

    console.log('[NAVIGATE] Adicionando elementos ao DOM...');
    container.appendChild(img);
    container.appendChild(info);
    
    console.log('[NAVIGATE] ✅ Screenshot exibido com sucesso!');
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
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.navigationManager = new NavigationManager();
    console.log('[NAVIGATE] NavigationManager inicializado');
  });
} else {
  window.navigationManager = new NavigationManager();
  console.log('[NAVIGATE] NavigationManager inicializado');
}
