# Estruturação do Banco de Conhecimento (RAG & Vector DB)

## 1. O Conceito de "Memória Institucional"
Para que a IA seja útil e segura (sem alucinações), ela precisa de acesso a uma base de dados verificada. O Banco de Conhecimento é onde transformamos documentos estáticos em inteligência acionável.

## 2. Arquitetura de Dados (RAG - Retrieval-Augmented Generation)

### 2.1. Ingestão de Dados (O que entra?)
O sistema aceitará múltiplos formatos que serão convertidos para texto puro e depois vetorizados:
*   **PDFs:** Protocolos médicos, manuais de convênios, tabelas de preços.
*   **DOCX:** Contratos, modelos de documentos.
*   **HTML:** Páginas do site do hospital, notícias da intranet.
*   **TXT/MD:** Notas técnicas, logs de conversas passadas (para aprendizado).

### 2.2. Processamento (Pipeline ETL)
1.  **Extração:** O texto é extraído do arquivo original.
2.  **Chunking (Fragmentação):** O texto é quebrado em pedaços menores (ex: 500 tokens) com sobreposição (overlap) para manter o contexto.
3.  **Embedding:** Cada pedaço é convertido em um vetor numérico (uma lista de números que representa o significado semântico) usando modelos como OpenAI `text-embedding-3-small` ou modelos locais (HuggingFace).
4.  **Armazenamento:** Os vetores são salvos no **ChromaDB** (ou PGVector).

## 3. Estrutura de Coleções (Organização)

Não misturaremos todos os dados. O banco será segmentado em "Coleções" para garantir que o Agente Financeiro não responda com dados clínicos.

| Coleção | Conteúdo Típico | Acesso Permitido |
| :--- | :--- | :--- |
| `protocolos_medicos` | Diretrizes de triagem, sintomas, procedimentos | Agente de Triagem |
| `financeiro_convenios` | Tabelas de preços, regras de carência, contratos | Agente Financeiro |
| `rh_interno` | Manuais de conduta, benefícios, escalas | Agente de RH |
| `historico_atendimentos` | Logs anonimizados de conversas de sucesso | Todos (Treinamento) |

## 4. Fluxo de Consulta (Como a IA usa?)

1.  **Pergunta:** Usuário pergunta: *"O convênio X cobre o exame Y?"*
2.  **Busca Semântica:** O sistema converte a pergunta em vetor e busca no ChromaDB os 3 trechos de texto mais parecidos semanticamente na coleção `financeiro_convenios`.
3.  **Contexto:** O sistema recupera: *"Trecho A: O convênio X cobre Y com carência de 30 dias..."*
4.  **Geração:** O LLM recebe: *"Com base APENAS no Trecho A, responda à pergunta do usuário"*.
5.  **Resposta Segura:** *"Sim, cobre, mas verifiquei aqui que existe uma carência de 30 dias."*

## 5. Manutenção e Atualização
*   **Interface de Gestão:** Uma tela no painel administrativo onde gestores podem fazer upload de novos PDFs.
*   **Re-indexação Automática:** Ao subir um novo "Tabela de Preços 2026", o sistema automaticamente arquiva a antiga e indexa a nova em segundos.
