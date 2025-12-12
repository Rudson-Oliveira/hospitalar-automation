(function() {
    // Estilos CSS para o menu
    const style = document.createElement('style');
    style.textContent = `
        #global-nav-menu {
            position: fixed;
            top: 1rem;
            right: 1rem;
            display: flex;
            gap: 0.5rem;
            z-index: 9999;
            font-family: sans-serif;
        }
        .nav-btn {
            background: rgba(31, 41, 55, 0.9);
            color: #e5e7eb;
            border: 1px solid #374151;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            text-decoration: none;
            font-size: 0.875rem;
            font-weight: 500;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            backdrop-filter: blur(4px);
        }
        .nav-btn:hover {
            background: #374151;
            color: white;
            transform: translateY(-1px);
        }
        .nav-btn.active {
            background: #2563eb;
            border-color: #3b82f6;
            color: white;
        }
        .nav-icon {
            font-size: 1.1em;
        }
    `;
    document.head.appendChild(style);

    // Criar container do menu
    const nav = document.createElement('div');
    nav.id = 'global-nav-menu';

    // Definição dos links
    const links = [
        { href: '/', icon: '📈', text: 'Dashboard', role: 'admin' },
        { href: '/copilot', icon: '🤖', text: 'Copilot', role: 'all' },
        { href: '/autonomy', icon: '📊', text: 'Metrics', role: 'admin' },
        { href: '/settings', icon: '⚙️', text: 'Settings', role: 'admin' },
        { href: '/onboarding', icon: '🎓', text: 'Help', role: 'all' }
    ];

    // Simulação de role (em produção viria do auth)
    // Por padrão assume admin em dev, mas pode ser configurado
    const userRole = localStorage.getItem('user_role') || 'admin';

    links.forEach(link => {
        if (link.role === 'admin' && userRole !== 'admin') return;

        const a = document.createElement('a');
        a.href = link.href;
        a.className = `nav-btn ${window.location.pathname === link.href ? 'active' : ''}`;
        a.innerHTML = `<span class="nav-icon">${link.icon}</span> <span>${link.text}</span>`;
        nav.appendChild(a);
    });

    document.body.appendChild(nav);
})();
