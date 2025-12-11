import sys
import os
import json
import subprocess
from datetime import datetime

# Adiciona o diretório raiz ao path para importar módulos irmãos
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

class AutomationManager:
    def __init__(self):
        self.visual_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../visual'))
        self.core_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../core'))
        
    def log(self, message):
        print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] [GERENTE] {message}")

    def execute_task(self, task_type, parameters=None):
        """
        Recebe um tipo de tarefa e decide qual agente acionar.
        """
        self.log(f"Recebida tarefa: {task_type} com parâmetros: {parameters}")

        if task_type == "check_system_status":
            return self._run_core_check()
        elif task_type == "visual_login_test":
            return self._run_visual_login()
        elif task_type == "full_report":
            return self._run_full_report()
        else:
            self.log(f"Tarefa desconhecida: {task_type}")
            return {"status": "error", "message": "Unknown task type"}

    def _run_core_check(self):
        self.log("Delegando para Agente Core (API)...")
        # Executa script Python do Core
        try:
            # Aqui poderíamos importar a classe diretamente, mas vamos rodar como subprocesso
            # para simular isolamento de agentes
            cmd = f"cd {self.core_path} && source venv/bin/activate && python hospital_api.py"
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True, executable="/bin/bash")
            
            if result.returncode == 0:
                self.log("Agente Core reportou sucesso.")
                return {"status": "success", "agent": "core", "output": result.stdout}
            else:
                self.log("Agente Core reportou erro.")
                return {"status": "error", "agent": "core", "output": result.stderr}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    def _run_visual_login(self):
        self.log("Delegando para Agente Visual (Playwright)...")
        try:
            cmd = f"cd {self.visual_path} && npx ts-node src/index.ts"
            # Timeout maior para visual
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True, executable="/bin/bash")
            
            if "SUCESSO" in result.stdout:
                self.log("Agente Visual completou a missão.")
                return {"status": "success", "agent": "visual", "output": result.stdout}
            else:
                self.log("Agente Visual falhou ou não confirmou sucesso.")
                return {"status": "warning", "agent": "visual", "output": result.stdout + "\nErrors: " + result.stderr}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    def _run_full_report(self):
        self.log("Iniciando Relatório Completo (Híbrido)...")
        
        # 1. Checa API
        api_status = self._run_core_check()
        
        # 2. Se API ok, tenta Visual
        visual_status = {"status": "skipped"}
        if api_status["status"] == "success":
            visual_status = self._run_visual_login()
            
        return {
            "status": "completed",
            "report": {
                "api_check": api_status,
                "visual_check": visual_status
            }
        }

if __name__ == "__main__":
    # Exemplo de uso via CLI
    manager = AutomationManager()
    
    if len(sys.argv) > 1:
        task = sys.argv[1]
        manager.execute_task(task)
    else:
        print("Uso: python manager.py <task_name>")
        print("Tasks disponíveis: check_system_status, visual_login_test, full_report")
