# Módulo Core de Automação (API/Dados)

Este módulo é responsável pela comunicação direta com o backend do sistema hospitalar via API e, futuramente, acesso direto ao banco de dados MySQL.

## Funcionalidades

- **Autenticação API:** Login via endpoint `/api/auth/login` (JWT).
- **Extração de Dados:** (Em desenvolvimento) Coleta de dados estruturados para relatórios.
- **Banco de Dados:** (Pendente) Conexão direta MySQL quando credenciais estiverem disponíveis.

## Estrutura

- `hospital_api.py`: Classe cliente principal para interação com a API.
- `auth_test.py`: Script de diagnóstico para descoberta de endpoints.
- `venv/`: Ambiente virtual Python isolado.

## Configuração

1. Crie o ambiente virtual e instale dependências:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

2. Configure o `.env` (mesmo arquivo usado pelo módulo visual pode ser linkado ou copiado):
   ```env
   HOSPITAL_URL=https://dev.hospitalarsaude.app.br
   HOSPITAL_USER=seu_usuario
   HOSPITAL_PASS=sua_senha
   ```

## Uso

```python
from hospital_api import HospitalAPI

api = HospitalAPI()
api.login()
# dados = api.get_dashboard_data()
```
