import requests
import os
from hospital_api import HospitalAPI
from dotenv import load_dotenv

# Carrega variáveis de ambiente
load_dotenv()

def discover_endpoints():
    api = HospitalAPI()
    if not api.login():
        print("Falha no login inicial. Abortando descoberta.")
        return

    print(f"Token obtido: {api.token[:20]}...")

    # Lista de endpoints comuns em sistemas hospitalares/agendamento
    # Baseado em padrões REST: recurso, recurso/id, recurso/lista
    common_endpoints = [
        "/api/dashboard",
        "/api/home",
        "/api/user",
        "/api/users/me",
        "/api/profile",
        "/api/patients",
        "/api/pacientes",
        "/api/schedules",
        "/api/agendamentos",
        "/api/appointments",
        "/api/consultas",
        "/api/doctors",
        "/api/medicos",
        "/api/units",
        "/api/unidades",
        "/api/config",
        "/api/settings"
    ]

    print("\n--- Iniciando Varredura de Endpoints ---")
    
    found_endpoints = []

    for endpoint in common_endpoints:
        url = f"{api.base_url}{endpoint}"
        try:
            # Tenta GET
            response = api.session.get(url, timeout=5)
            print(f"GET {endpoint} -> Status: {response.status_code}")
            
            if response.status_code in [200, 201]:
                print(f"   [SUCESSO] Conteúdo (início): {str(response.text)[:100]}")
                found_endpoints.append({"method": "GET", "endpoint": endpoint, "status": response.status_code})
            elif response.status_code == 405:
                print("   [Método não permitido - Talvez seja POST]")
            elif response.status_code == 403:
                print("   [Acesso Negado - Endpoint existe mas sem permissão]")
                
        except Exception as e:
            print(f"Erro ao acessar {endpoint}: {e}")

    print("\n--- Resumo da Descoberta ---")
    if found_endpoints:
        print("Endpoints Válidos Encontrados:")
        for item in found_endpoints:
            print(f" - {item['method']} {item['endpoint']}")
    else:
        print("Nenhum endpoint comum retornou 200 OK.")

if __name__ == "__main__":
    discover_endpoints()
