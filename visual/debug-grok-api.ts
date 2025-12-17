/**
 * Debug Script - Verificar resposta detalhada da API Grok
 */

import axios from 'axios';

const GROK_API_KEY = 'xai-FsFDu5JJBSSIQMIVmv3QFaWCIptNwUh05KXxnQ8QoE2e2K5KKi';
const GROK_API_URL = 'https://api.x.ai/v1';

async function debugGrokAPI() {
  console.log('🔍 DEBUG - Testando API Grok\n');
  
  // Teste 1: Verificar modelo disponível
  console.log('📝 Teste 1: Chat simples com grok-beta');
  try {
    const response = await axios.post(
      `${GROK_API_URL}/chat/completions`,
      {
        model: 'grok-beta',
        messages: [
          {
            role: 'user',
            content: 'Hello! Are you working?'
          }
        ],
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${GROK_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Sucesso com grok-beta!');
    console.log('Resposta:', JSON.stringify(response.data, null, 2));
  } catch (error: any) {
    console.log('❌ Erro com grok-beta');
    console.log('Status:', error.response?.status);
    console.log('Erro:', error.response?.data || error.message);
  }

  console.log('\n' + '-'.repeat(60) + '\n');

  // Teste 2: Verificar modelo grok-2-latest
  console.log('📝 Teste 2: Chat simples com grok-2-latest');
  try {
    const response = await axios.post(
      `${GROK_API_URL}/chat/completions`,
      {
        model: 'grok-2-latest',
        messages: [
          {
            role: 'user',
            content: 'Hello! Are you working?'
          }
        ],
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${GROK_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Sucesso com grok-2-latest!');
    console.log('Resposta:', JSON.stringify(response.data, null, 2));
  } catch (error: any) {
    console.log('❌ Erro com grok-2-latest');
    console.log('Status:', error.response?.status);
    console.log('Erro:', error.response?.data || error.message);
  }

  console.log('\n' + '-'.repeat(60) + '\n');

  // Teste 3: Listar modelos disponíveis
  console.log('📝 Teste 3: Listar modelos disponíveis');
  try {
    const response = await axios.get(
      `${GROK_API_URL}/models`,
      {
        headers: {
          'Authorization': `Bearer ${GROK_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Modelos disponíveis:');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error: any) {
    console.log('❌ Erro ao listar modelos');
    console.log('Status:', error.response?.status);
    console.log('Erro:', error.response?.data || error.message);
  }

  console.log('\n' + '-'.repeat(60) + '\n');

  // Teste 4: Verificar API Key
  console.log('📝 Teste 4: Verificar API Key');
  console.log('API Key:', GROK_API_KEY.substring(0, 20) + '...');
  console.log('Tamanho:', GROK_API_KEY.length, 'caracteres');
  console.log('Prefixo:', GROK_API_KEY.substring(0, 4));
}

debugGrokAPI().catch(error => {
  console.error('❌ ERRO FATAL:', error);
});
