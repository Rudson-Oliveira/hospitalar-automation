/**
 * Teste LOCAL SIMPLIFICADO - Criação de Paciente
 * Usando JavaScript puro para evitar problemas de TypeScript
 */

const { chromium } = require('playwright');

async function testLocal() {
  console.log('='.repeat(80));
  console.log('🧪 TESTE LOCAL - Handler V3 com Logs Detalhados');
  console.log('='.repeat(80));
  
  const browser = await chromium.launch({
    headless: true // Headless mode (sem interface gráfica)
  });
  
  const page = await browser.newPage();
  
  console.log('\n📋 Dados do paciente:');
  const patientData = {
    nome: "TESTE LOCAL MANUS",
    cidade: "Pouso Alegre",
    convenio: "UNIMED SUL MINEIRA"
  };
  console.log(JSON.stringify(patientData, null, 2));
  
  try {
    console.log('\n🚀 Passo 1: Navegando para sistema Hospitalar...');
    await page.goto('https://dev.hospitalarsaude.app.br/#/dashboard/pacientes/pacientes', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    console.log('✅ Página carregada');
    await page.waitForTimeout(2000);
    
    console.log('\n🔍 Passo 2: Procurando botão com múltiplos seletores...');
    
    const selectors = [
      'button:has-text("PACIENTE")',
      '//button[contains(text(), "PACIENTE")]',
      'text=PACIENTE',
      'button:has-text("ADICIONAR")',
      '//button[contains(text(), "ADICIONAR")]'
    ];
    
    let addButton = null;
    let selectorUsed = '';
    
    for (const selector of selectors) {
      console.log(`  Tentando seletor: ${selector}`);
      try {
        const locator = page.locator(selector).first();
        const isVisible = await locator.isVisible({ timeout: 5000 }).catch(() => false);
        
        if (isVisible) {
          addButton = locator;
          selectorUsed = selector;
          console.log(`  ✅ ENCONTRADO com: ${selector}`);
          break;
        } else {
          console.log(`  ❌ Não visível`);
        }
      } catch (e) {
        console.log(`  ❌ Erro: ${e.message}`);
      }
    }
    
    if (!addButton) {
      console.log('\n❌ NENHUM SELETOR FUNCIONOU!');
      console.log('\n🔍 Vamos listar TODOS os botões da página:');
      
      const allButtons = await page.locator('button').all();
      console.log(`\nTotal de botões encontrados: ${allButtons.length}`);
      
      for (let i = 0; i < Math.min(allButtons.length, 20); i++) {
        const text = await allButtons[i].textContent().catch(() => 'N/A');
        const isVisible = await allButtons[i].isVisible().catch(() => false);
        console.log(`  ${i + 1}. "${text}" (visível: ${isVisible})`);
      }
      
      throw new Error('Botão não encontrado com nenhum seletor');
    }
    
    console.log(`\n✅ Passo 3: Clicando no botão (seletor: ${selectorUsed})...`);
    await addButton.click();
    console.log('✅ Botão clicado');
    await page.waitForTimeout(2000);
    
    console.log('\n🔍 Passo 4: Aguardando modal...');
    const modal = page.locator('text=Novo Paciente').first();
    const modalVisible = await modal.isVisible({ timeout: 10000 }).catch(() => false);
    
    if (modalVisible) {
      console.log('✅ Modal aberto!');
      
      console.log('\n📝 Passo 5: Preenchendo formulário...');
      
      // Nome
      console.log('  Preenchendo nome...');
      await page.locator('#inputName').fill(patientData.nome);
      console.log('  ✅ Nome preenchido');
      
      // Cidade (opcional)
      if (patientData.cidade) {
        console.log('  Preenchendo cidade...');
        await page.locator('#inputCidade').fill(patientData.cidade);
        console.log('  ✅ Cidade preenchida');
      }
      
      // Convênio
      console.log('  Preenchendo convênio...');
      const convenioField = page.locator('#inputConvenio');
      await convenioField.fill('UNIMED');
      await convenioField.click();
      await page.waitForTimeout(1000);
      
      // Aguardar dropdown
      const dropdown = page.locator('mat-option').first();
      const dropdownVisible = await dropdown.isVisible({ timeout: 5000 }).catch(() => false);
      
      if (dropdownVisible) {
        console.log('  ✅ Dropdown apareceu');
        await dropdown.click();
        console.log('  ✅ Convênio selecionado');
      } else {
        console.log('  ⚠️  Dropdown não apareceu');
      }
      
      await page.waitForTimeout(1000);
      
      console.log('\n💾 Passo 6: Salvando...');
      const saveButton = page.locator('button:has-text("SALVAR")').first();
      await saveButton.click();
      console.log('✅ Botão SALVAR clicado');
      
      await page.waitForTimeout(3000);
      
      console.log('\n' + '='.repeat(80));
      console.log('✅ ✅ ✅ TESTE CONCLUÍDO COM SUCESSO! ✅ ✅ ✅');
      console.log('='.repeat(80));
      
    } else {
      console.log('❌ Modal não apareceu');
    }
    
  } catch (error) {
    console.error('\n❌ ERRO:', error.message);
    console.error(error.stack);
  } finally {
    console.log('\n⏸️  Aguardando 10 segundos para você ver o resultado...');
    await page.waitForTimeout(10000);
    await browser.close();
  }
}

testLocal().catch(console.error);
