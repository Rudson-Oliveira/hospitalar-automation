import { UserLevel } from './user-profiler';

export class ContextHelper {
  private userLevel: UserLevel;

  constructor() {
    this.userLevel = (localStorage.getItem('USER_LEVEL') as UserLevel) || 'BEGINNER_TOTAL';
    this.init();
  }

  private init() {
    if (this.userLevel === 'BEGINNER_TOTAL' || this.userLevel === 'BEGINNER') {
      this.injectTooltips();
    }
  }

  private injectTooltips() {
    // Seleciona elementos que precisam de explicação
    const elements = document.querySelectorAll('[data-help]');

    elements.forEach((el) => {
      const helpText = el.getAttribute('data-help');
      if (!helpText) return;

      // Cria o ícone de ajuda
      const icon = document.createElement('span');
      icon.className = 'ml-2 text-blue-400 cursor-help hover:text-blue-300 transition';
      icon.innerHTML = '<i class="fas fa-question-circle"></i>';
      
      // Tooltip Container
      const tooltip = document.createElement('div');
      tooltip.className = 'absolute z-50 hidden bg-gray-900 border border-blue-500 text-white p-4 rounded-lg shadow-xl w-64 text-sm';
      tooltip.innerHTML = `
        <div class="flex items-start gap-3">
          <i class="fas fa-info-circle text-2xl text-blue-500"></i>
          <div>
            <p class="font-bold mb-1">Para que serve isso?</p>
            <p class="text-gray-300">${helpText}</p>
          </div>
        </div>
        <div class="mt-2 text-xs text-gray-500 text-right">Clique para fechar</div>
      `;

      // Posicionamento (Simples)
      // Em produção usaríamos Popper.js ou Floating UI
      
      icon.onclick = (e) => {
        e.stopPropagation();
        const rect = icon.getBoundingClientRect();
        tooltip.style.top = `${rect.bottom + 10}px`;
        tooltip.style.left = `${rect.left}px`;
        tooltip.classList.remove('hidden');
      };

      tooltip.onclick = () => tooltip.classList.add('hidden');

      // Adiciona ao DOM
      el.appendChild(icon);
      document.body.appendChild(tooltip);
    });
  }
}
