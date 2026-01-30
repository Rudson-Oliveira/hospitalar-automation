<#
.SYNOPSIS
    Iniciador do Sistema Autonomo - Hospitalar Saude
.DESCRIPTION
    Inicia todos os componentes do sistema autonomo hospitalar
    com verificacao de dependencias e failover automatico
#>

param(
    [switch]$StartHub,
    [switch]$ConfigureBackups,
    [switch]$CheckAll,
    [switch]$Full
)

$ErrorActionPreference = "Continue"
$scriptDir = $PSScriptRoot

Write-Host @"
============================================
  HOSPITALAR SAUDE - SISTEMA AUTONOMO
  Inicializacao com Redundancia Total
============================================
"@ -ForegroundColor Cyan

function Test-DockerRunning {
    try {
        $result = docker info 2>$null
        return $?
    } catch { return $false }
}

function Test-ServiceOnline {
    param([string]$Url, [string]$Name)
    try {
        $response = Invoke-WebRequest -Uri $Url -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
        Write-Host "  [OK] $Name" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "  [OFFLINE] $Name" -ForegroundColor Red
        return $false
    }
}

function Start-DockerContainers {
    Write-Host "`nVerificando containers Docker..." -ForegroundColor Yellow
    
    if (-not (Test-DockerRunning)) {
        Write-Host "Docker nao esta rodando. Iniciando..." -ForegroundColor Yellow
        Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
        Start-Sleep -Seconds 30
    }
    
    # Verificar e iniciar containers
    $containers = @("hospitalar_db", "hospitalar_backend")
    foreach ($container in $containers) {
        $status = docker inspect -f '{{.State.Running}}' $container 2>$null
        if ($status -ne "true") {
            Write-Host "Iniciando $container..." -ForegroundColor Yellow
            docker start $container
        } else {
            Write-Host "  [OK] $container ja esta rodando" -ForegroundColor Green
        }
    }
}

function Test-AllServices {
    Write-Host "`nVerificando servicos..." -ForegroundColor Yellow
    
    $services = @{
        "VisionAI" = "http://localhost:3020"
        "Backend" = "http://localhost:3001/health"
        "Ollama" = "http://localhost:11434/api/tags"
        "Jan AI" = "http://localhost:1337/v1/models"
    }
    
    $online = 0
    foreach ($svc in $services.GetEnumerator()) {
        if (Test-ServiceOnline -Url $svc.Value -Name $svc.Key) { $online++ }
    }
    
    Write-Host "`nServicos online: $online/$($services.Count)" -ForegroundColor $(if ($online -eq $services.Count) { "Green" } else { "Yellow" })
    return $online
}

function Start-HubCentral {
    Write-Host "`nIniciando Hub Central Hibrido..." -ForegroundColor Yellow
    $hubScript = Join-Path $scriptDir "hub-central-hibrido.py"
    
    if (Test-Path $hubScript) {
        Start-Process -FilePath "python" -ArgumentList $hubScript -WindowStyle Minimized
        Write-Host "Hub Central iniciado em background" -ForegroundColor Green
    } else {
        Write-Host "Hub Central nao encontrado: $hubScript" -ForegroundColor Red
    }
}

function Configure-AutoBackup {
    Write-Host "`nConfigurando backup automatico..." -ForegroundColor Yellow
    $backupScript = Join-Path $scriptDir "agendar-backup.ps1"
    
    if (Test-Path $backupScript) {
        & $backupScript
    } else {
        Write-Host "Script de agendamento nao encontrado" -ForegroundColor Red
    }
}

# Execucao Principal
Write-Host "`n[1/4] Verificando Docker e Containers" -ForegroundColor Cyan
Start-DockerContainers

Write-Host "`n[2/4] Verificando Servicos" -ForegroundColor Cyan
$servicesOnline = Test-AllServices

if ($StartHub -or $Full) {
    Write-Host "`n[3/4] Iniciando Hub Central" -ForegroundColor Cyan
    Start-HubCentral
}

if ($ConfigureBackups -or $Full) {
    Write-Host "`n[4/4] Configurando Backups Automaticos" -ForegroundColor Cyan
    Configure-AutoBackup
}

Write-Host @"

============================================
  SISTEMA AUTONOMO INICIALIZADO
============================================
Status: $(if ($servicesOnline -ge 2) { "OPERACIONAL" } else { "DEGRADADO" })
Data: $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')

Para monitoramento continuo, execute:
  python hub-central-hibrido.py

Para backup manual:
  .\backup-completo.ps1
============================================
"@ -ForegroundColor $(if ($servicesOnline -ge 2) { "Green" } else { "Yellow" })
