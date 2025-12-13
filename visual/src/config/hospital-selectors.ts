/**
 * Hospital Selectors Configuration
 * Mapeamento de seletores CSS para o sistema hospitalar
 */

export const HOSPITAL_ROUTES = {
  // Dashboard
  dashboard: '/#/dashboard/home',
  
  // Administrativo
  administrativo: {
    base: '/#/administrativo',
    pedidos: '/#/administrativo/pedidos',
    demandas: '/#/administrativo/demandas',
    relatorios: '/#/administrativo/relatorios',
  },
  
  // Financeiro
  financeiro: {
    base: '/#/financeiro',
    compras: '/#/financeiro/compras',
    pagamentos: '/#/financeiro/pagamentos',
    orcamentos: '/#/financeiro/orcamentos',
  },
  
  // Operacional
  operacional: {
    base: '/#/operacional',
    inventario: '/#/operacional/inventario',
    estoque: '/#/operacional/estoque',
  },
  
  // Configurações
  configuracoes: {
    base: '/#/configuracoes',
    usuarios: '/#/configuracoes/usuarios',
    departamentos: '/#/configuracoes/departamentos',
  },
};

export const HOSPITAL_SELECTORS = {
  // Menu Lateral
  menu: {
    container: '.sidebar',
    items: '.sidebar a[data-menu]',
    itemByName: (name: string) => `.sidebar a[data-menu="${name}"]`,
    administrativo: '.sidebar a[data-menu="administrativo"]',
    financeiro: '.sidebar a[data-menu="financeiro"]',
    operacional: '.sidebar a[data-menu="operacional"]',
    configuracoes: '.sidebar a[data-menu="configuracoes"]',
  },
  
  // Header
  header: {
    container: '.header',
    title: '.header h1',
    userMenu: '.header .user-menu',
    logout: '.header .user-menu a[data-action="logout"]',
  },
  
  // Formulários Genéricos
  forms: {
    container: 'form',
    inputs: 'input[type="text"], input[type="number"], input[type="email"]',
    selects: 'select',
    textareas: 'textarea',
    submitBtn: 'button[type="submit"], button[data-action="submit"]',
    cancelBtn: 'button[data-action="cancel"]',
    resetBtn: 'button[type="reset"]',
  },
  
  // Pedidos de Compra
  pedidos: {
    // Botões
    novoBtn: 'button[data-action="novo-pedido"]',
    editarBtn: 'button[data-action="editar"]',
    deletarBtn: 'button[data-action="deletar"]',
    salvarBtn: 'button[data-action="salvar"]',
    
    // Campos do Formulário
    itemInput: 'input[name="item"], input[data-field="item"]',
    quantidadeInput: 'input[name="quantidade"], input[data-field="quantidade"]',
    departamentoSelect: 'select[name="departamento"], select[data-field="departamento"]',
    descricaoTextarea: 'textarea[name="descricao"]',
    
    // Tabela
    tabela: 'table.pedidos-table, table[data-table="pedidos"]',
    linhas: 'table.pedidos-table tbody tr',
    linhaById: (id: string) => `table.pedidos-table tbody tr[data-id="${id}"]`,
    
    // Modal/Dialog
    modal: '.modal-pedido, .dialog-pedido',
    modalClose: '.modal-pedido .close, .dialog-pedido .close',
  },
  
  // Demandas
  demandas: {
    // Botões
    novoBtn: 'button[data-action="nova-demanda"]',
    filtrarBtn: 'button[data-action="filtrar"]',
    limparFiltroBtn: 'button[data-action="limpar-filtro"]',
    
    // Filtros
    departamentoFilter: 'select[name="filtro-departamento"], select[data-filter="departamento"]',
    statusFilter: 'select[name="filtro-status"], select[data-filter="status"]',
    dataInicialFilter: 'input[name="filtro-data-inicial"]',
    dataFinalFilter: 'input[name="filtro-data-final"]',
    
    // Tabela
    tabela: 'table.demandas-table, table[data-table="demandas"]',
    linhas: 'table.demandas-table tbody tr',
    linhaById: (id: string) => `table.demandas-table tbody tr[data-id="${id}"]`,
  },
  
  // Relatórios
  relatorios: {
    // Botões
    gerarBtn: 'button[data-action="gerar-relatorio"]',
    exportarBtn: 'button[data-action="exportar"]',
    imprimirBtn: 'button[data-action="imprimir"]',
    
    // Seleção de Tipo
    tipoSelect: 'select[name="tipo-relatorio"], select[data-field="tipo"]',
    periodoSelect: 'select[name="periodo"], select[data-field="periodo"]',
    dataInicialInput: 'input[name="data-inicial"]',
    dataFinalInput: 'input[name="data-final"]',
    
    // Resultado
    relatorioContainer: '.relatorio-container, .relatorio-resultado',
    relatorioTabela: '.relatorio-container table',
    relatorioGrafico: '.relatorio-container .grafico',
  },
  
  // Compras (Financeiro)
  compras: {
    // Botões
    novaBtn: 'button[data-action="nova-compra"]',
    aprovarBtn: 'button[data-action="aprovar"]',
    rejeitarBtn: 'button[data-action="rejeitar"]',
    
    // Campos
    fornecedorInput: 'input[name="fornecedor"]',
    valorInput: 'input[name="valor"]',
    dataEntregaInput: 'input[name="data-entrega"]',
    
    // Tabela
    tabela: 'table.compras-table',
    linhas: 'table.compras-table tbody tr',
  },
  
  // Inventário/Estoque
  estoque: {
    // Botões
    adicionarBtn: 'button[data-action="adicionar-estoque"]',
    removerBtn: 'button[data-action="remover-estoque"]',
    atualizarBtn: 'button[data-action="atualizar"]',
    
    // Campos
    produtoInput: 'input[name="produto"]',
    quantidadeInput: 'input[name="quantidade"]',
    localizacaoInput: 'input[name="localizacao"]',
    
    // Tabela
    tabela: 'table.estoque-table',
    linhas: 'table.estoque-table tbody tr',
  },
  
  // Notificações e Alertas
  notifications: {
    container: '.notification, .alert, .toast',
    success: '.notification.success, .alert-success',
    error: '.notification.error, .alert-danger',
    warning: '.notification.warning, .alert-warning',
    info: '.notification.info, .alert-info',
    closeBtn: '.notification .close, .alert .close',
  },
  
  // Modais/Dialogs
  modals: {
    container: '.modal, .dialog',
    overlay: '.modal-overlay, .dialog-overlay',
    content: '.modal-content, .dialog-content',
    header: '.modal-header, .dialog-header',
    body: '.modal-body, .dialog-body',
    footer: '.modal-footer, .dialog-footer',
    closeBtn: '.modal .close, .dialog .close',
  },
  
  // Tabelas Genéricas
  tables: {
    container: 'table',
    header: 'table thead',
    body: 'table tbody',
    rows: 'table tbody tr',
    cells: 'table tbody tr td',
    headerCells: 'table thead th',
    pagination: '.pagination',
    pageInfo: '.page-info',
  },
  
  // Paginação
  pagination: {
    container: '.pagination',
    firstBtn: '.pagination .first',
    prevBtn: '.pagination .prev',
    nextBtn: '.pagination .next',
    lastBtn: '.pagination .last',
    pageBtn: (page: number) => `.pagination a[data-page="${page}"]`,
    currentPage: '.pagination .active',
  },
  
  // Loading/Spinner
  loading: {
    spinner: '.spinner, .loading-spinner',
    overlay: '.loading-overlay',
    text: '.loading-text',
  },
  
  // Mensagens
  messages: {
    success: '.message.success, .alert-success',
    error: '.message.error, .alert-danger',
    warning: '.message.warning, .alert-warning',
    info: '.message.info, .alert-info',
  },
};

/**
 * Função auxiliar para obter seletor com fallbacks
 */
export function getSelector(primary: string, ...fallbacks: string[]): string {
  const selectors = [primary, ...fallbacks];
  return selectors.join(', ');
}

/**
 * Função auxiliar para construir seletor de atributo
 */
export function buildAttributeSelector(
  element: string,
  attribute: string,
  value: string
): string {
  return `${element}[${attribute}="${value}"]`;
}

/**
 * Função auxiliar para construir seletor de classe
 */
export function buildClassSelector(element: string, ...classes: string[]): string {
  return `${element}.${classes.join('.')}`;
}

export default HOSPITAL_SELECTORS;
