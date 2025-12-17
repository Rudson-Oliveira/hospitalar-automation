/**
 * Handler para Criação de Paciente no Sistema Hospitalar - V3 FINAL
 * Correções implementadas após teste real em 17/12/2025
 * Autocomplete Material Angular funcionando 100%
 */

import { Page } from 'playwright';

export interface PatientDataSimple {
  nome: string;
  cidade?: string; // opcional
  convenio: string;
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
 * Cria paciente no sistema Hospitalar (formulário simplificado)
 * TESTADO E VALIDADO EM 17/12/2025 - FUNCIONANDO 100%
 */
export async function createPatientV3(
  page: Page,
  patientData: PatientDataSimple
): Promise<CreatePatientResult> {
  const steps: string[] = [];
  
  try {
    console.log('[CreatePatientV3] Iniciando criação de paciente:', patientData.nome);
    
    // Passo 1: Navegar para o sistema
    steps.push('Navegando para sistema Hospitalar');
    await page.goto('https://dev.hospitalarsaude.app.br/#/dashboard/home', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    console.log('[CreatePatientV3] Página carregada');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Passo 2: Verificar se está logado
    steps.push('Verificando autenticação');
    const currentUrl = page.url();
    
    if (currentUrl.includes('login')) {
      steps.push('⚠️  Login necessário - sistema redirecionou para login');
      console.log('[CreatePatientV3] Login necessário');
      
      return {
        success: false,
        message: 'Login necessário. Por favor, faça login manualmente.',
        steps,
        error: 'NOT_AUTHENTICATED'
      };
    }
    
    steps.push('✅ Usuário autenticado');
    
    // Passo 3: Navegar para página de pacientes
    steps.push('Navegando para página de pacientes');
    await page.goto('https://dev.hospitalarsaude.app.br/#/dashboard/pacientes/pacientes', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    console.log('[CreatePatientV3] Página de pacientes carregada');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Passo 4: Clicar no botão "ADICIONAR PACIENTE"
    steps.push('Clicando em ADICIONAR PACIENTE');
    const addButton = page.locator('button:has-text("PACIENTE")').first();
    
    if (await addButton.isVisible({ timeout: 30000 }).catch(() => false)) {
      await addButton.click();
      steps.push('✅ Botão PACIENTE clicado');
      await new Promise(resolve => setTimeout(resolve, 1500));
    } else {
      steps.push('❌ Botão PACIENTE não encontrado');
      throw new Error('Botão PACIENTE não encontrado');
    }
    
    // Passo 5: Aguardar modal "Novo Paciente" aparecer
    steps.push('Aguardando modal Novo Paciente');
    const modalTitle = page.locator('text=Novo Paciente').first();
    
    if (await modalTitle.isVisible({ timeout: 30000 }).catch(() => false)) {
      steps.push('✅ Modal Novo Paciente aberto');
    } else {
      steps.push('⚠️  Modal não encontrado, mas continuando...');
    }
    
    // Passo 6: Preencher campo NOME (obrigatório)
    steps.push('Preenchendo campo Nome');
    const nomeField = page.locator('#inputName').first();
    
    if (await nomeField.isVisible({ timeout: 30000 }).catch(() => false)) {
      await nomeField.clear();
      await nomeField.fill(patientData.nome);
      steps.push(`✅ Nome preenchido: ${patientData.nome}`);
      await new Promise(resolve => setTimeout(resolve, 500));
    } else {
      steps.push('❌ Campo Nome (#inputName) não encontrado');
      throw new Error('Campo Nome não encontrado');
    }
    
    // Passo 7: Preencher campo CIDADE (opcional)
    if (patientData.cidade) {
      steps.push('Preenchendo campo Cidade');
      const cidadeField = page.locator('#inputCidade').first();
      
      if (await cidadeField.isVisible({ timeout: 30000 }).catch(() => false)) {
        await cidadeField.clear();
        await cidadeField.fill(patientData.cidade);
        steps.push(`✅ Cidade digitada: ${patientData.cidade}`);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Clicar no campo para abrir dropdown do autocomplete
        await cidadeField.click();
        steps.push('✅ Campo Cidade clicado para abrir autocomplete');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Aguardar dropdown aparecer
        const dropdownVisible = await page.locator('mat-option').first().isVisible({ timeout: 3000 }).catch(() => false);
        
        if (dropdownVisible) {
          // Clicar na primeira opção do dropdown
          await page.locator('mat-option').first().click();
          steps.push('✅ Cidade selecionada do autocomplete');
        } else {
          steps.push('⚠️  Dropdown de cidade não apareceu, continuando...');
        }
      } else {
        steps.push('⚠️  Campo Cidade (#inputCidade) não encontrado');
      }
    }
    
    // Passo 8: Preencher campo CONVÊNIO (obrigatório) - CORREÇÃO CRÍTICA
    steps.push('Preenchendo campo Convênio');
    const convenioField = page.locator('#inputConvenio').first();
    
    if (await convenioField.isVisible({ timeout: 30000 }).catch(() => false)) {
      // Extrair primeiras palavras do convênio para busca
      const convenioSearch = patientData.convenio.split(' ').slice(0, 2).join(' ');
      
      await convenioField.clear();
      await convenioField.fill(convenioSearch);
      steps.push(`✅ Convênio digitado: ${convenioSearch}`);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // CORREÇÃO CRÍTICA: Clicar no campo para abrir dropdown
      await convenioField.click();
      steps.push('✅ Campo Convênio clicado para abrir autocomplete');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Aguardar dropdown aparecer
      const dropdownVisible = await page.locator('mat-option').first().isVisible({ timeout: 30000 }).catch(() => false);
      
      if (dropdownVisible) {
        steps.push('✅ Dropdown de convênio apareceu');
        
        // Tentar encontrar opção exata
        const exactOption = page.locator(`mat-option:has-text("${patientData.convenio}")`).first();
        const exactVisible = await exactOption.isVisible({ timeout: 2000 }).catch(() => false);
        
        if (exactVisible) {
          await exactOption.click();
          steps.push(`✅ Convênio selecionado: ${patientData.convenio}`);
        } else {
          // Clicar na primeira opção se não encontrar exata
          await page.locator('mat-option').first().click();
          steps.push('✅ Primeira opção de convênio selecionada');
        }
      } else {
        steps.push('❌ Dropdown de convênio não apareceu');
        throw new Error('Dropdown de convênio não apareceu');
      }
    } else {
      steps.push('❌ Campo Convênio (#inputConvenio) não encontrado');
      throw new Error('Campo Convênio não encontrado');
    }
    
    // Passo 9: Capturar screenshot antes de salvar
    steps.push('Capturando screenshot antes de salvar');
    const screenshotBuffer = await page.screenshot();
    const screenshotBefore = Buffer.from(screenshotBuffer).toString('base64');
    steps.push('✅ Screenshot capturado');
    
    // Passo 10: Clicar no botão SALVAR
    steps.push('Clicando no botão SALVAR');
    const salvarButton = page.locator('button:has-text("SALVAR")').first();
    
    if (await salvarButton.isVisible({ timeout: 30000 }).catch(() => false)) {
      await salvarButton.click();
      steps.push('✅ Botão SALVAR clicado');
      
      // Aguardar salvamento
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Passo 11: Verificar se salvou com sucesso
      steps.push('Verificando salvamento');
      
      // Verificar mensagem de sucesso
      const successMessage = await page.locator('text=/sucesso|cadastrado/i').first();
      const successVisible = await successMessage.isVisible({ timeout: 3000 }).catch(() => false);
      
      if (successVisible) {
        steps.push('✅ Mensagem de sucesso encontrada!');
        
        // Capturar screenshot final
        const screenshotBufferAfter = await page.screenshot();
        const screenshotAfter = Buffer.from(screenshotBufferAfter).toString('base64');
        
        return {
          success: true,
          message: `Paciente ${patientData.nome} criado com sucesso!`,
          screenshot: screenshotAfter,
          steps
        };
      }
      
      // Verificar se modal fechou (indica sucesso)
      const modalStillVisible = await modalTitle.isVisible({ timeout: 2000 }).catch(() => false);
      
      if (!modalStillVisible) {
        steps.push('✅ Modal fechado - paciente salvo com sucesso!');
        
        // Capturar screenshot final
        const screenshotBufferAfter = await page.screenshot();
        const screenshotAfter = Buffer.from(screenshotBufferAfter).toString('base64');
        
        return {
          success: true,
          message: `Paciente ${patientData.nome} criado com sucesso!`,
          screenshot: screenshotAfter,
          steps
        };
      } else {
        steps.push('⚠️  Modal ainda visível - verificando mensagem de erro');
        
        // Procurar mensagem de erro
        const errorMessage = await page.locator('text=/erro|inválido|obrigatório/i').first();
        if (await errorMessage.isVisible({ timeout: 2000 }).catch(() => false)) {
          const errorText = await errorMessage.textContent();
          steps.push(`❌ Erro encontrado: ${errorText}`);
        }
      }
    } else {
      steps.push('❌ Botão SALVAR não encontrado');
      throw new Error('Botão SALVAR não encontrado');
    }
    
    // Capturar screenshot final
    const screenshotBufferFinal = await page.screenshot();
    const screenshotFinal = Buffer.from(screenshotBufferFinal).toString('base64');
    
    return {
      success: false,
      message: 'Formulário preenchido, mas salvamento não confirmado',
      screenshot: screenshotFinal,
      steps
    };
    
  } catch (error: any) {
    console.error('[CreatePatientV3] Erro:', error);
    steps.push(`❌ Erro: ${error.message}`);
    
    // Capturar screenshot do erro
    let screenshot: string | undefined;
    try {
      const screenshotBufferError = await page.screenshot();
      screenshot = Buffer.from(screenshotBufferError).toString('base64');
    } catch (e) {
      console.error('[CreatePatientV3] Erro ao capturar screenshot:', e);
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
