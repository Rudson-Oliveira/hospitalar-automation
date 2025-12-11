# Orquestrador de Automação (O Gerente)

Este módulo atua como o ponto central de controle da "Empresa Autônoma". Ele recebe comandos de alto nível e delega a execução para os agentes especializados (Visual ou Core).

## Arquitetura

O `manager.py` é a classe principal que:
1.  Recebe solicitações de tarefas (ex: "verificar status do sistema").
2.  Decide qual agente é mais adequado (API para velocidade, Visual para simulação humana).
3.  Executa os agentes em subprocessos isolados.
4.  Agrega os resultados e retorna um relatório unificado.

## Uso

```bash
# Executar verificação rápida via API
python manager.py check_system_status

# Executar teste visual completo
python manager.py visual_login_test

# Executar ciclo completo (Híbrido)
python manager.py full_report
```

## Expansão

Para adicionar novas tarefas:
1.  Implemente a lógica no agente específico (`/core` ou `/visual`).
2.  Adicione um novo `elif` no método `execute_task` do `manager.py`.
3.  Defina a lógica de orquestração (ex: tentar API primeiro, se falhar, tentar Visual).
