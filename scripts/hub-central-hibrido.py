#!/usr/bin/env python3
"""
Hub Central Hibrido - Sistema Autonomo Hospitalar Saude
Monitoramento, redundancia e failover automatico
"""

import requests
import subprocess
import time
import json
import logging
from datetime import datetime
from pathlib import Path
import os
import sys

# Configuracao de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('hub-central.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Configuracoes do Sistema
CONFIG = {
    'local': {
        'visionai': 'http://localhost:3020',
        'backend': 'http://localhost:3001',
        'ollama': 'http://localhost:11434',
        'jan': 'http://localhost:1337',
        'mysql_container': 'hospitalar_db'
    },
    'remote': {
        'host': '69.62.119.212',
        'user': 'root',
        'ssh_key': os.path.expanduser('~/.ssh/id_rsa_hospitalar'),
        'mysql_port': 3306
    },
    'check_interval': 30,
    'max_retries': 3,
    'backup_dir': os.path.expanduser('~/hospitalar-backups')
}

class HubCentral:
    def __init__(self):
        self.status = {}
        self.providers = ['ollama', 'jan', 'groq']
        self.current_provider = None
        Path(CONFIG['backup_dir']).mkdir(parents=True, exist_ok=True)
    
    def check_service(self, name, url, endpoint='/health'):
        """Verifica se um servico esta online"""
        try:
            if name == 'ollama':
                resp = requests.get(f"{url}/api/tags", timeout=5)
            elif name == 'jan':
                resp = requests.get(f"{url}/v1/models", timeout=5)
            else:
                resp = requests.get(f"{url}{endpoint}", timeout=5)
            
            online = resp.status_code in [200, 404]
            self.status[name] = {'online': online, 'last_check': datetime.now().isoformat()}
            return online
        except Exception as e:
            self.status[name] = {'online': False, 'error': str(e), 'last_check': datetime.now().isoformat()}
            return False
    
    def select_ai_provider(self):
        """Seleciona o melhor provedor de IA disponivel"""
        for provider in self.providers:
            if provider == 'ollama' and self.check_service('ollama', CONFIG['local']['ollama']):
                self.current_provider = 'ollama'
                logger.info("Provedor selecionado: Ollama (local)")
                return 'ollama'
            elif provider == 'jan' and self.check_service('jan', CONFIG['local']['jan']):
                self.current_provider = 'jan'
                logger.info("Provedor selecionado: Jan (local)")
                return 'jan'
            elif provider == 'groq':
                self.current_provider = 'groq'
                logger.info("Provedor selecionado: Groq (cloud)")
                return 'groq'
        return None
    
    def check_mysql_local(self):
        """Verifica MySQL local via Docker"""
        try:
            result = subprocess.run(
                ['docker', 'exec', CONFIG['local']['mysql_container'], 
                 'mysqladmin', 'ping', '-h', 'localhost'],
                capture_output=True, text=True, timeout=10
            )
            online = 'alive' in result.stdout.lower()
            self.status['mysql_local'] = {'online': online}
            return online
        except Exception as e:
            self.status['mysql_local'] = {'online': False, 'error': str(e)}
            return False
    
    def check_all_services(self):
        """Verifica todos os servicos"""
        logger.info("Iniciando verificacao de servicos...")
        
        services = [
            ('visionai', CONFIG['local']['visionai'], '/'),
            ('backend', CONFIG['local']['backend'], '/health'),
        ]
        
        for name, url, endpoint in services:
            status = self.check_service(name, url, endpoint)
            logger.info(f"{name}: {'ONLINE' if status else 'OFFLINE'}")
        
        mysql_status = self.check_mysql_local()
        logger.info(f"MySQL Local: {'ONLINE' if mysql_status else 'OFFLINE'}")
        
        ai_provider = self.select_ai_provider()
        logger.info(f"Provedor IA ativo: {ai_provider}")
        
        return self.status
    
    def run_monitoring(self):
        """Loop principal de monitoramento"""
        logger.info("Hub Central Hibrido iniciado")
        
        while True:
            try:
                self.check_all_services()
                self.save_status()
                time.sleep(CONFIG['check_interval'])
            except KeyboardInterrupt:
                logger.info("Hub Central encerrado pelo usuario")
                break
            except Exception as e:
                logger.error(f"Erro no monitoramento: {e}")
                time.sleep(5)
    
    def save_status(self):
        """Salva status atual em arquivo JSON"""
        status_file = Path(CONFIG['backup_dir']) / 'hub-status.json'
        with open(status_file, 'w') as f:
            json.dump({
                'timestamp': datetime.now().isoformat(),
                'services': self.status,
                'current_provider': self.current_provider
            }, f, indent=2)

if __name__ == '__main__':
    hub = HubCentral()
    
    if len(sys.argv) > 1 and sys.argv[1] == '--once':
        hub.check_all_services()
        print(json.dumps(hub.status, indent=2))
    else:
        hub.run_monitoring()
