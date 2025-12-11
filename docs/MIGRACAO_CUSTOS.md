# Estratégia de Migração e Redução de Custos

## 1. Análise de Custo Atual vs. Futuro

A transição para uma solução proprietária visa eliminar custos recorrentes de licenciamento SaaS, trocando-os por custos controlados de infraestrutura e consumo de API.

| Categoria | Modelo Atual (SaaS Terceirizado) | Modelo Futuro (Proprietário) | Economia Estimada |
| :--- | :--- | :--- | :--- |
| **Plataforma de Chat** | R$ X.XXX / mês (por usuário) | R$ 0 (Software Próprio) | 100% (Licença) |
| **Automação (RPA)** | R$ X.XXX / mês (Licenças) | R$ 0 (Playwright Open Source) | 100% |
| **Infraestrutura** | Incluso no SaaS | ~R$ 200-500 / mês (VPS/Cloud) | Novo Custo |
| **IA / LLM** | Não incluso ou Cobrado à parte | Pague-pelo-uso (OpenAI/Anthropic) | Variável (Controle Total) |
| **WhatsApp API** | Markup sobre o custo oficial | Custo Oficial (Meta/Twilio) direto | ~30-50% |

## 2. Estratégia de "Estrangulamento" (Strangler Fig Pattern)

Não faremos uma virada de chave abrupta ("Big Bang"). Utilizaremos o padrão de estrangulamento para substituir o sistema antigo gradualmente.

1.  **Interceptação:** Colocamos o novo sistema na frente das requisições.
2.  **Coexistência:**
    *   Novos canais (ex: Instagram) entram direto no sistema novo.
    *   Canais críticos (WhatsApp Principal) continuam no antigo até a Fase 2.
3.  **Substituição Modular:**
    *   Mês 1: Migrar automação de relatórios (já feito).
    *   Mês 2: Migrar atendimento de E-mail.
    *   Mês 3: Migrar WhatsApp de departamentos menores.
    *   Mês 4: Migrar WhatsApp Principal e cancelar contrato antigo.

## 3. Mitigação de Riscos

*   **Risco:** Queda do servidor próprio.
    *   *Mitigação:* Arquitetura em nuvem com redundância e backup automático.
*   **Risco:** Bloqueio do WhatsApp.
    *   *Mitigação:* Uso estrito da API Oficial (BSP) e respeito às janelas de 24h da Meta.
*   **Risco:** Alucinação da IA.
    *   *Mitigação:* Implementação rigorosa do RAG (só responde o que está no documento) e camada de verificação humana para temas sensíveis.

## 4. Benefícios Intangíveis (Além do Custo)

*   **Propriedade dos Dados:** O hospital é dono de 100% do histórico de conversas e dados dos pacientes, sem depender de terceiros.
*   **Personalização Infinita:** Não ficamos reféns do roadmap da empresa de software. Se precisarmos de uma integração nova amanhã, nós construímos.
*   **Valorização do Ativo:** O software desenvolvido torna-se um ativo de propriedade intelectual do hospital.
