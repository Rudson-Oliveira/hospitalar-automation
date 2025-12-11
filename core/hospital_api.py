import requests
import os
import json
from datetime import datetime

class HospitalAPI:
    def __init__(self):
        self.base_url = os.getenv('HOSPITAL_URL', 'https://dev.hospitalarsaude.app.br')
        self.username = os.getenv('HOSPITAL_USER')
        self.password = os.getenv('HOSPITAL_PASS')
        self.token = None
        self.session = requests.Session()
        self.session.headers.update({
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        })

    def login(self):
        """Realiza login na API e armazena o token."""
        endpoint = "/api/auth/login"
        url = f"{self.base_url}{endpoint}"
        
        payload = {
            "email": self.username,
            "password": self.password
        }
        
        try:
            response = self.session.post(url, json=payload, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            # Ajustar conforme a estrutura real da resposta (token, access_token, authorization, etc)
            # Geralmente vem em 'access_token' ou 'token'
            self.token = data.get('access_token') or data.get('token')
            
            if self.token:
                self.session.headers.update({
                    "Authorization": f"Bearer {self.token}"
                })
                print(f"[{datetime.now()}] Login API realizado com sucesso.")
                return True
            else:
                print(f"[{datetime.now()}] Erro: Token não encontrado na resposta de login.")
                print("Resposta:", data)
                return False
                
        except Exception as e:
            print(f"[{datetime.now()}] Erro ao realizar login API: {e}")
            return False

    def get_dashboard_data(self):
        """Exemplo de método para buscar dados (precisa descobrir endpoints reais)."""
        if not self.token:
            if not self.login():
                return None
        
        # Endpoint hipotético - precisaremos descobrir os reais
        endpoint = "/api/dashboard" 
        url = f"{self.base_url}{endpoint}"
        
        try:
            response = self.session.get(url)
            if response.status_code == 200:
                return response.json()
            else:
                print(f"Erro ao buscar dashboard: {response.status_code}")
                return None
        except Exception as e:
            print(f"Erro na requisição: {e}")
            return None

if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv()
    
    api = HospitalAPI()
    if api.login():
        print("Teste de classe API: SUCESSO")
    else:
        print("Teste de classe API: FALHA")
