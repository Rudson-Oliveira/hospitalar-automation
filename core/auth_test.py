import requests
import os
from dotenv import load_dotenv

load_dotenv()

BASE_URL = os.getenv('HOSPITAL_URL')
USERNAME = os.getenv('HOSPITAL_USER')
PASSWORD = os.getenv('HOSPITAL_PASS')

def login_api():
    # Tenta endpoints comuns de autenticação para SPAs Angular/Vue
    # Geralmente é /api/login, /api/auth/login, /oauth/token, etc.
    # Como não temos a documentação da API, vamos tentar inferir ou usar o endpoint padrão
    
    # Endpoint hipotético baseado em padrões comuns
    login_url = f"{BASE_URL}/api/login" 
    
    payload = {
        "email": USERNAME,
        "password": PASSWORD
    }
    
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    
    print(f"Tentando login via API em: {login_url}")
    
    try:
        response = requests.post(login_url, json=payload, headers=headers, timeout=10)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text[:500]}") # Mostra os primeiros 500 chars
        
        if response.status_code == 200:
            print("Login via API SUCESSO!")
            return response.json()
        elif response.status_code == 404:
            print("Endpoint não encontrado. Tentando variações...")
            return try_alternative_endpoints()
        else:
            print("Falha no login via API.")
            return None
            
    except Exception as e:
        print(f"Erro na requisição: {e}")
        return None

def try_alternative_endpoints():
    endpoints = [
        "/api/auth/login",
        "/api/v1/login",
        "/auth/login",
        "/login"
    ]
    
    payload = {
        "email": USERNAME,
        "password": PASSWORD
    }
    
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    
    for endpoint in endpoints:
        url = f"{BASE_URL}{endpoint}"
        print(f"Tentando: {url}")
        try:
            response = requests.post(url, json=payload, headers=headers, timeout=5)
            if response.status_code == 200:
                print(f"SUCESSO no endpoint: {endpoint}")
                return response.json()
        except:
            pass
            
    print("Todas as tentativas de API falharam. Será necessário inspecionar o tráfego de rede do navegador para descobrir o endpoint correto.")
    return None

if __name__ == "__main__":
    login_api()
