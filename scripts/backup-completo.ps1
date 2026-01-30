<#
.SYNOPSIS
    Script de Backup Completo - Hospitalar Saude
.DESCRIPTION
    Backup automatizado de MySQL Docker, arquivos e configuracoes
    Com redundancia local e remota
#>

param(
    [string]$BackupDir = "$env:USERPROFILE\hospitalar-backups",
    [switch]$IncludeRemote,
    [switch]$Verbose
)

$ErrorActionPreference = "Stop"
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$logFile = "$BackupDir\backup-$timestamp.log"

# Configuracoes
$config = @{
    MySQLContainer = "hospitalar_db"
    MySQLUser = "root"
    MySQLPassword = "hospitalar123"
    Database = "hospitalar_saude"
    RemoteHost = "69.62.119.212"
    RemoteUser = "root"
    SSHKey = "$env:USERPROFILE\.ssh\id_rsa_hospitalar"
    ProjectPaths = @(
        "C:\projetos\hospitalar-automation",
        "C:\projetos\visionai"
    )
}

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $logEntry = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') [$Level] $Message"
    Write-Host $logEntry
    Add-Content -Path $logFile -Value $logEntry
}

function Backup-MySQLDocker {
    Write-Log "Iniciando backup MySQL Docker..."
    $backupFile = "$BackupDir\mysql\$timestamp-hospitalar.sql"
    New-Item -ItemType Directory -Force -Path "$BackupDir\mysql" | Out-Null
    
    try {
        docker exec $config.MySQLContainer mysqldump `
            -u$($config.MySQLUser) `
            -p$($config.MySQLPassword) `
            --single-transaction `
            --routines `
            --triggers `
            $config.Database > $backupFile
        
        $size = (Get-Item $backupFile).Length / 1MB
        Write-Log "Backup MySQL concluido: $([math]::Round($size, 2)) MB"
        
        # Compactar
        Compress-Archive -Path $backupFile -DestinationPath "$backupFile.zip" -Force
        Remove-Item $backupFile
        Write-Log "Backup compactado: $backupFile.zip"
        return $true
    } catch {
        Write-Log "Erro no backup MySQL: $_" "ERROR"
        return $false
    }
}

function Backup-ProjectFiles {
    Write-Log "Iniciando backup de arquivos do projeto..."
    $backupFile = "$BackupDir\files\$timestamp-projeto.zip"
    New-Item -ItemType Directory -Force -Path "$BackupDir\files" | Out-Null
    
    try {
        $tempDir = "$env:TEMP\hospitalar-backup-$timestamp"
        New-Item -ItemType Directory -Force -Path $tempDir | Out-Null
        
        foreach ($path in $config.ProjectPaths) {
            if (Test-Path $path) {
                $folderName = Split-Path $path -Leaf
                Copy-Item -Path $path -Destination "$tempDir\$folderName" -Recurse -Exclude @("node_modules", ".git", "*.log")
                Write-Log "Copiado: $path"
            }
        }
        
        Compress-Archive -Path "$tempDir\*" -DestinationPath $backupFile -Force
        Remove-Item -Path $tempDir -Recurse -Force
        
        $size = (Get-Item $backupFile).Length / 1MB
        Write-Log "Backup de arquivos concluido: $([math]::Round($size, 2)) MB"
        return $true
    } catch {
        Write-Log "Erro no backup de arquivos: $_" "ERROR"
        return $false
    }
}

function Sync-ToRemote {
    if (-not $IncludeRemote) { return }
    
    Write-Log "Sincronizando com servidor remoto..."
    try {
        $latestBackups = Get-ChildItem "$BackupDir" -Recurse -Filter "*$timestamp*"
        foreach ($file in $latestBackups) {
            scp -i $config.SSHKey $file.FullName "$($config.RemoteUser)@$($config.RemoteHost):/root/hospitalar-backups/"
            Write-Log "Enviado para remoto: $($file.Name)"
        }
        return $true
    } catch {
        Write-Log "Erro na sincronizacao remota: $_" "ERROR"
        return $false
    }
}

function Cleanup-OldBackups {
    Write-Log "Limpando backups antigos (>7 dias)..."
    $cutoff = (Get-Date).AddDays(-7)
    Get-ChildItem "$BackupDir" -Recurse -File | Where-Object { $_.LastWriteTime -lt $cutoff } | ForEach-Object {
        Remove-Item $_.FullName -Force
        Write-Log "Removido: $($_.Name)"
    }
}

# Execucao Principal
Write-Log "=== BACKUP HOSPITALAR SAUDE INICIADO ==="
New-Item -ItemType Directory -Force -Path $BackupDir | Out-Null

$results = @{
    MySQL = Backup-MySQLDocker
    Files = Backup-ProjectFiles
    Remote = if ($IncludeRemote) { Sync-ToRemote } else { $null }
}

Cleanup-OldBackups

Write-Log "=== RESUMO DO BACKUP ==="
Write-Log "MySQL: $(if ($results.MySQL) { 'OK' } else { 'FALHA' })"
Write-Log "Arquivos: $(if ($results.Files) { 'OK' } else { 'FALHA' })"
if ($IncludeRemote) { Write-Log "Remoto: $(if ($results.Remote) { 'OK' } else { 'FALHA' })" }
Write-Log "=== BACKUP CONCLUIDO ==="
