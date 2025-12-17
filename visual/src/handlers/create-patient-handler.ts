/**
 * Handler para Criação de Paciente no Sistema Hospitalar
 * Usa Playwright para automação + Abacus.AI para decisões inteligentes
 */

import { Page } from 'playwright';

export interface PatientData {
  nome: string;
  dataNascimento: string; // formato: DD/MM/AAAA
  convenio: string;
  endereco: {
    rua: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
}

export interface CreatePatientResult {
  success: boolean;
  message: string;
  patientId?: string;
  screenshot?: string;
  steps?: string[];
  error?: string;
}

/**
 * Cria paciente no sistema Hospitalar
 */
export async function createPatient(
  page: Page,
  patientData: PatientData
): Promise<CreatePatientResult> {
  const steps: string[] = [];
  
  try {
    console.log('[CreatePatient] Iniciando criação de paciente:', patientData.nome);
    
    // Passo 1: Navegar para o sistema
    steps.push('Navegando para sistema Hospitalar');
    await page.goto('https://dev.hospitalarsaude.app.br/#/dashboard/home', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    console.log('[CreatePatient] Página carregada');
    
    // Passo 2: Verificar se está logado
    steps.push('Verificando autenticação');
    const isLoggedIn = await page.evaluate(() => {
      return !document.querySelector('input[type="email"]');
    });
    
    if (!isLoggedIn) {
      steps.push('⚠️  Login necessário - aguardando login manual');
      console.log('[CreatePatient] Login necessário');
      
      // Aguardar 30 segundos para login manual
      await page.waitForTimeout(30000);
    }
    
    // Passo 3: Navegar para cadastro de pacientes
    steps.push('Navegando para cadastro de pacientes');
    
    // Tentar encontrar menu de pacientes
    const menuPacientes = await page.locator('text=/paciente/i').first();
    if (await menuPacientes.isVisible({ timeout: 5000 }).catch(() => false)) {
      await menuPacientes.click();
      steps.push('✅ Menu pacientes clicado');
    } else {
      // Tentar URL direta
      await page.goto('https://dev.hospitalarsaude.app.br/#/dashboard/pacientes/novo', {
        waitUntil: 'networkidle'
      });
      steps.push('✅ Navegação direta para cadastro');
    }
    
    // Passo 4: Aguardar formulário carregar
    steps.push('Aguardando formulário de cadastro');
    await page.waitForTimeout(2000);
    
    // Passo 5: Preencher dados do paciente
    steps.push('Preenchendo dados do paciente');
    
    // Nome
    const nomeField = page.locator('input[name="nome"], input[placeholder*="nome" i]').first();
    if (await nomeField.isVisible({ timeout: 5000 }).catch(() => false)) {
      await nomeField.fill(patientData.nome);
      steps.push(`✅ Nome preenchido: ${patientData.nome}`);
    } else {
      steps.push('⚠️  Campo nome não encontrado');
    }
    
    // Data de Nascimento
    const dataNascField = page.locator('input[name="dataNascimento"], input[type="date"]').first();
    if (await dataNascField.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Converter DD/MM/AAAA para AAAA-MM-DD
      const [dia, mes, ano] = patientData.dataNascimento.split('/');
      const dataFormatada = `${ano}-${mes}-${dia}`;
      await dataNascField.fill(dataFormatada);
      steps.push(`✅ Data nascimento preenchida: ${patientData.dataNascimento}`);
    } else {
      steps.push('⚠️  Campo data nascimento não encontrado');
    }
    
    // Convênio
    const convenioField = page.locator('input[name="convenio"], select[name="convenio"]').first();
    if (await convenioField.isVisible({ timeout: 5000 }).catch(() => false)) {
      await convenioField.fill(patientData.convenio);
      steps.push(`✅ Convênio preenchido: ${patientData.convenio}`);
    } else {
      steps.push('⚠️  Campo convênio não encontrado');
    }
    
    // Endereço - Rua
    const ruaField = page.locator('input[name="rua"], input[name="endereco"]').first();
    if (await ruaField.isVisible({ timeout: 5000 }).catch(() => false)) {
      await ruaField.fill(patientData.endereco.rua);
      steps.push(`✅ Rua preenchida: ${patientData.endereco.rua}`);
    }
    
    // Endereço - Bairro
    const bairroField = page.locator('input[name="bairro"]').first();
    if (await bairroField.isVisible({ timeout: 5000 }).catch(() => false)) {
      await bairroField.fill(patientData.endereco.bairro);
      steps.push(`✅ Bairro preenchido: ${patientData.endereco.bairro}`);
    }
    
    // Endereço - Cidade
    const cidadeField = page.locator('input[name="cidade"]').first();
    if (await cidadeField.isVisible({ timeout: 5000 }).catch(() => false)) {
      await cidadeField.fill(patientData.endereco.cidade);
      steps.push(`✅ Cidade preenchida: ${patientData.endereco.cidade}`);
    }
    
    // Endereço - Estado
    const estadoField = page.locator('select[name="estado"], input[name="uf"]').first();
    if (await estadoField.isVisible({ timeout: 5000 }).catch(() => false)) {
      await estadoField.fill(patientData.endereco.estado);
      steps.push(`✅ Estado preenchido: ${patientData.endereco.estado}`);
    }
    
    // Passo 6: Capturar screenshot antes de salvar
    const screenshotBuffer = await page.screenshot();
    const screenshotBefore = screenshotBuffer.toString('base64');
    steps.push('✅ Screenshot capturado (antes de salvar)');
    
    // Passo 7: Salvar paciente
    steps.push('Salvando paciente');
    
    const salvarButton = page.locator('button:has-text("Salvar"), button:has-text("Cadastrar")').first();
    if (await salvarButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await salvarButton.click();
      steps.push('✅ Botão salvar clicado');
      
      // Aguardar salvamento
      await page.waitForTimeout(3000);
      
      // Verificar se salvou com sucesso
      const successMessage = await page.locator('text=/sucesso|cadastrado|salvo/i').first();
      if (await successMessage.isVisible({ timeout: 5000 }).catch(() => false)) {
        steps.push('✅ Paciente salvo com sucesso!');
        
        return {
          success: true,
          message: `Paciente ${patientData.nome} criado com sucesso!`,
          screenshot: screenshotBefore,
          steps
        };
      } else {
        steps.push('⚠️  Mensagem de sucesso não encontrada');
      }
    } else {
      steps.push('⚠️  Botão salvar não encontrado');
    }
    
    // Capturar screenshot final
    const screenshotBufferAfter = await page.screenshot();
    const screenshotAfter = screenshotBufferAfter.toString('base64');
    
    return {
      success: false,
      message: 'Formulário preenchido, mas salvamento não confirmado',
      screenshot: screenshotAfter,
      steps
    };
    
  } catch (error: any) {
    console.error('[CreatePatient] Erro:', error);
    steps.push(`❌ Erro: ${error.message}`);
    
    // Capturar screenshot do erro
    let screenshot: string | undefined;
    try {
      const screenshotBufferError = await page.screenshot();
      screenshot = screenshotBufferError.toString('base64');
    } catch (e) {
      console.error('[CreatePatient] Erro ao capturar screenshot:', e);
    }
    
    return {
      success: false,
      message: `Erro ao criar paciente: ${error.message}`,
      screenshot,
      steps,
      error: error.message
    };
  }
}
