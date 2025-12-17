/**
 * Script de Teste - Integração Grok API
 * Valida todas as funcionalidades do Grok antes do deploy
 */

import { GrokAI, GrokMessage } from './src/ai/grok-integration';

// API Key fornecida pelo CEO
const GROK_API_KEY = 'xai-FsFDu5JJBSSIQMIVmv3QFaWCIptNwUh05KXxnQ8QoE2e2K5KKi';

async function testGrokIntegration() {
  console.log('🚀 INICIANDO TESTES DE INTEGRAÇÃO GROK\n');
  console.log('=' .repeat(60));

  const grok = new GrokAI(GROK_API_KEY);
  let testsPassados = 0;
  let testsFalhados = 0;

  // ========================================
  // TESTE 1: Chat Básico
  // ========================================
  console.log('\n📝 TESTE 1: Chat Básico com Grok');
  console.log('-'.repeat(60));
  
  try {
    const messages: GrokMessage[] = [
      {
        role: 'system',
        content: 'Você é um assistente especializado em automação hospitalar.'
      },
      {
        role: 'user',
        content: 'Olá! Você está funcionando corretamente?'
      }
    ];

    const response = await grok.chat(messages);
    
    if (response.success && response.content) {
      console.log('✅ PASSOU - Chat básico funcionando');
      console.log('Resposta:', response.content.substring(0, 150) + '...');
      testsPassados++;
    } else {
      console.log('❌ FALHOU - Chat básico não funcionou');
      console.log('Erro:', response.error);
      testsFalhados++;
    }
  } catch (error: any) {
    console.log('❌ FALHOU - Exceção no chat básico');
    console.log('Erro:', error.message);
    testsFalhados++;
  }

  // ========================================
  // TESTE 2: Reasoning Avançado
  // ========================================
  console.log('\n🧠 TESTE 2: Reasoning Avançado');
  console.log('-'.repeat(60));
  
  try {
    const messages: GrokMessage[] = [
      {
        role: 'system',
        content: 'Você é um especialista em automação hospitalar. Use reasoning detalhado.'
      },
      {
        role: 'user',
        content: 'Preciso criar um paciente no sistema hospitalar. Quais são os passos necessários? Liste de forma estruturada.'
      }
    ];

    const response = await grok.chat(messages);
    
    if (response.success && response.content) {
      console.log('✅ PASSOU - Reasoning avançado funcionando');
      console.log('Resposta:', response.content.substring(0, 200) + '...');
      if (response.reasoning) {
        console.log('Reasoning:', response.reasoning.substring(0, 150) + '...');
      }
      testsPassados++;
    } else {
      console.log('❌ FALHOU - Reasoning não funcionou');
      console.log('Erro:', response.error);
      testsFalhados++;
    }
  } catch (error: any) {
    console.log('❌ FALHOU - Exceção no reasoning');
    console.log('Erro:', error.message);
    testsFalhados++;
  }

  // ========================================
  // TESTE 3: Code Execution (Python)
  // ========================================
  console.log('\n🐍 TESTE 3: Code Execution (Python)');
  console.log('-'.repeat(60));
  
  try {
    const pythonCode = `
import datetime

# Calcular idade de um paciente
data_nascimento = datetime.date(1982, 12, 12)
hoje = datetime.date.today()
idade = hoje.year - data_nascimento.year

print(f"Paciente nascido em {data_nascimento} tem {idade} anos")
print(f"Data de hoje: {hoje}")
`;

    const response = await grok.executeCode(pythonCode);
    
    if (response.success && response.content) {
      console.log('✅ PASSOU - Code execution funcionando');
      console.log('Resultado:', response.content);
      testsPassados++;
    } else {
      console.log('❌ FALHOU - Code execution não funcionou');
      console.log('Erro:', response.error);
      testsFalhados++;
    }
  } catch (error: any) {
    console.log('❌ FALHOU - Exceção no code execution');
    console.log('Erro:', error.message);
    testsFalhados++;
  }

  // ========================================
  // TESTE 4: Web Search
  // ========================================
  console.log('\n🔍 TESTE 4: Web Search');
  console.log('-'.repeat(60));
  
  try {
    const response = await grok.webSearch('Unimed Sul Mineira convênio hospitalar');
    
    if (response.success && response.content) {
      console.log('✅ PASSOU - Web search funcionando');
      console.log('Resultado:', response.content.substring(0, 200) + '...');
      testsPassados++;
    } else {
      console.log('❌ FALHOU - Web search não funcionou');
      console.log('Erro:', response.error);
      testsFalhados++;
    }
  } catch (error: any) {
    console.log('❌ FALHOU - Exceção no web search');
    console.log('Erro:', error.message);
    testsFalhados++;
  }

  // ========================================
  // TESTE 5: Tomada de Decisão
  // ========================================
  console.log('\n🎯 TESTE 5: Tomada de Decisão Inteligente');
  console.log('-'.repeat(60));
  
  try {
    const context = 'Preciso criar um paciente no sistema hospitalar. O sistema está na tela de login.';
    const options = [
      'Fazer login primeiro',
      'Criar paciente sem login',
      'Navegar para outra página',
      'Fechar o navegador'
    ];

    const response = await grok.decideAction(context, options);
    
    if (response.success && response.content) {
      console.log('✅ PASSOU - Tomada de decisão funcionando');
      console.log('Decisão:', response.content);
      testsPassados++;
    } else {
      console.log('❌ FALHOU - Tomada de decisão não funcionou');
      console.log('Erro:', response.error);
      testsFalhados++;
    }
  } catch (error: any) {
    console.log('❌ FALHOU - Exceção na tomada de decisão');
    console.log('Erro:', error.message);
    testsFalhados++;
  }

  // ========================================
  // TESTE 6: Cenário Real - Paciente Maria Tonha
  // ========================================
  console.log('\n👤 TESTE 6: Cenário Real - Criar Paciente Maria Tonha');
  console.log('-'.repeat(60));
  
  try {
    const messages: GrokMessage[] = [
      {
        role: 'system',
        content: 'Você é o agente COMET Hospitalar. Sua missão é criar pacientes no sistema hospitalar de forma autônoma.'
      },
      {
        role: 'user',
        content: `
Preciso criar um paciente com os seguintes dados:
- Nome: Maria Tonha Tonha Teste
- Data de Nascimento: 12/12/1982
- Convênio: Unimed Sul Mineira
- Endereço: Rua João joao joao
- Bairro: João
- Cidade: Santa Maria - RS

O sistema está na URL: https://dev.hospitalarsaude.app.br/#/dashboard/home

Quais são os passos que devo executar? Liste de forma detalhada e estruturada.
`
      }
    ];

    const response = await grok.chat(messages);
    
    if (response.success && response.content) {
      console.log('✅ PASSOU - Cenário real funcionando');
      console.log('Plano de ação:', response.content.substring(0, 300) + '...');
      testsPassados++;
    } else {
      console.log('❌ FALHOU - Cenário real não funcionou');
      console.log('Erro:', response.error);
      testsFalhados++;
    }
  } catch (error: any) {
    console.log('❌ FALHOU - Exceção no cenário real');
    console.log('Erro:', error.message);
    testsFalhados++;
  }

  // ========================================
  // RELATÓRIO FINAL
  // ========================================
  console.log('\n' + '='.repeat(60));
  console.log('📊 RELATÓRIO FINAL DOS TESTES');
  console.log('='.repeat(60));
  console.log(`✅ Testes Passados: ${testsPassados}/6`);
  console.log(`❌ Testes Falhados: ${testsFalhados}/6`);
  console.log(`📈 Taxa de Sucesso: ${Math.round((testsPassados / 6) * 100)}%`);
  console.log('='.repeat(60));

  if (testsPassados === 6) {
    console.log('\n🎉 TODOS OS TESTES PASSARAM! Integração Grok 100% funcional!');
    console.log('✅ Sistema pronto para deploy no Railway');
  } else if (testsPassados >= 4) {
    console.log('\n⚠️ INTEGRAÇÃO PARCIALMENTE FUNCIONAL');
    console.log('✅ Sistema pode ser usado com limitações');
  } else {
    console.log('\n❌ INTEGRAÇÃO COM PROBLEMAS CRÍTICOS');
    console.log('⚠️ Revisar API Key e configurações antes do deploy');
  }

  console.log('\n🔑 API Key usada:', GROK_API_KEY.substring(0, 20) + '...');
  console.log('📅 Data do teste:', new Date().toLocaleString('pt-BR'));
  console.log('\n');
}

// Executar testes
testGrokIntegration().catch(error => {
  console.error('❌ ERRO FATAL NOS TESTES:', error);
  process.exit(1);
});
