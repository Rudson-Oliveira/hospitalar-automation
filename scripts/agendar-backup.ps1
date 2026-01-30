<#
.SYNOPSIS
    Agendador de Backup Automatico - Hospitalar Saude
.DESCRIPTION
    Cria tarefa agendada no Windows para executar backups automaticos
#>

param(
    [string]$TaskName = "HospitalarBackupDiario",
    [string]$Time = "02:00",
    [string]$ScriptPath = "$PSScriptRoot\backup-completo.ps1",
    [switch]$Remove,
    [switch]$RunNow
)

$ErrorActionPreference = "Stop"

function Register-BackupTask {
    Write-Host "Configurando tarefa agendada: $TaskName" -ForegroundColor Cyan
    
    # Remover tarefa existente se houver
    $existing = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
    if ($existing) {
        Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
        Write-Host "Tarefa anterior removida" -ForegroundColor Yellow
    }
    
    # Criar acao
    $action = New-ScheduledTaskAction `
        -Execute "PowerShell.exe" `
        -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$ScriptPath`""
    
    # Criar trigger diario
    $trigger = New-ScheduledTaskTrigger -Daily -At $Time
    
    # Configuracoes
    $settings = New-ScheduledTaskSettingsSet `
        -AllowStartIfOnBatteries `
        -DontStopIfGoingOnBatteries `
        -StartWhenAvailable `
        -RunOnlyIfNetworkAvailable
    
    # Registrar tarefa
    $principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -RunLevel Highest
    
    Register-ScheduledTask `
        -TaskName $TaskName `
        -Action $action `
        -Trigger $trigger `
        -Settings $settings `
        -Principal $principal `
        -Description "Backup automatico diario do sistema Hospitalar Saude"
    
    Write-Host "Tarefa criada com sucesso!" -ForegroundColor Green
    Write-Host "Horario: $Time (diariamente)" -ForegroundColor Green
    Write-Host "Script: $ScriptPath" -ForegroundColor Green
}

function Remove-BackupTask {
    Write-Host "Removendo tarefa: $TaskName" -ForegroundColor Yellow
    
    $existing = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
    if ($existing) {
        Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
        Write-Host "Tarefa removida com sucesso" -ForegroundColor Green
    } else {
        Write-Host "Tarefa nao encontrada" -ForegroundColor Red
    }
}

function Start-BackupNow {
    Write-Host "Executando backup agora..." -ForegroundColor Cyan
    Start-ScheduledTask -TaskName $TaskName
    Write-Host "Backup iniciado" -ForegroundColor Green
}

# Execucao Principal
if ($Remove) {
    Remove-BackupTask
} elseif ($RunNow) {
    Start-BackupNow
} else {
    # Verificar se script existe
    if (-not (Test-Path $ScriptPath)) {
        Write-Host "Script de backup nao encontrado: $ScriptPath" -ForegroundColor Red
        Write-Host "Certifique-se de que backup-completo.ps1 existe" -ForegroundColor Yellow
        exit 1
    }
    Register-BackupTask
}

# Mostrar status
Write-Host "`n=== TAREFAS AGENDADAS HOSPITALAR ===" -ForegroundColor Cyan
Get-ScheduledTask | Where-Object { $_.TaskName -like "Hospitalar*" } | Format-Table TaskName, State, LastRunTime -AutoSize
