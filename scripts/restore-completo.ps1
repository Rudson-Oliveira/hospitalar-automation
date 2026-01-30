<#
.SYNOPSIS
    Script de Restore Completo - Hospitalar Saude
.DESCRIPTION
    Restauracao de backup MySQL e arquivos do projeto
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$BackupFile,
    [string]$BackupDir = "$env:USERPROFILE\hospitalar-backups",
    [switch]$MySQLOnly,
    [switch]$FilesOnly,
    [switch]$Force
)

$ErrorActionPreference = "Stop"
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$logFile = "$BackupDir\restore-$timestamp.log"

$config = @{
    MySQLContainer = "hospitalar_db"
    MySQLUser = "root"
    MySQLPassword = "hospitalar123"
    Database = "hospitalar_saude"
}

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $logEntry = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') [$Level] $Message"
    Write-Host $logEntry
    Add-Content -Path $logFile -Value $logEntry
}

function Restore-MySQLBackup {
    param([string]$SqlFile)
    
    Write-Log "Iniciando restore MySQL..."
    
    # Descompactar se necessario
    $sqlPath = $SqlFile
    if ($SqlFile.EndsWith(".zip")) {
        $extractDir = "$env:TEMP\hospitalar-restore-$timestamp"
        Expand-Archive -Path $SqlFile -DestinationPath $extractDir -Force
        $sqlPath = Get-ChildItem $extractDir -Filter "*.sql" | Select-Object -First 1 -ExpandProperty FullName
    }
    
    try {
        # Criar backup do estado atual antes de restaurar
        if (-not $Force) {
            Write-Log "Criando backup de seguranca antes do restore..."
            $safetyBackup = "$BackupDir\mysql\pre-restore-$timestamp.sql"
            docker exec $config.MySQLContainer mysqldump `
                -u$($config.MySQLUser) -p$($config.MySQLPassword) `
                $config.Database > $safetyBackup
        }
        
        # Restaurar
        Get-Content $sqlPath | docker exec -i $config.MySQLContainer mysql `
            -u$($config.MySQLUser) -p$($config.MySQLPassword) $config.Database
        
        Write-Log "Restore MySQL concluido com sucesso"
        return $true
    } catch {
        Write-Log "Erro no restore MySQL: $_" "ERROR"
        return $false
    }
}

function Restore-ProjectFiles {
    param([string]$ZipFile)
    
    Write-Log "Iniciando restore de arquivos..."
    
    try {
        $extractDir = "$env:TEMP\hospitalar-files-$timestamp"
        Expand-Archive -Path $ZipFile -DestinationPath $extractDir -Force
        
        $folders = Get-ChildItem $extractDir -Directory
        foreach ($folder in $folders) {
            $targetPath = "C:\projetos\$($folder.Name)"
            if (Test-Path $targetPath) {
                if (-not $Force) {
                    $backupName = "$targetPath-backup-$timestamp"
                    Move-Item $targetPath $backupName
                    Write-Log "Backup criado: $backupName"
                }
            }
            Copy-Item $folder.FullName -Destination $targetPath -Recurse -Force
            Write-Log "Restaurado: $targetPath"
        }
        
        Remove-Item $extractDir -Recurse -Force
        Write-Log "Restore de arquivos concluido"
        return $true
    } catch {
        Write-Log "Erro no restore de arquivos: $_" "ERROR"
        return $false
    }
}

# Execucao Principal
Write-Log "=== RESTORE HOSPITALAR SAUDE INICIADO ==="

if (-not (Test-Path $BackupFile)) {
    Write-Log "Arquivo de backup nao encontrado: $BackupFile" "ERROR"
    exit 1
}

$results = @{}

if ($BackupFile -match "mysql|hospitalar\.sql") {
    $results.MySQL = Restore-MySQLBackup -SqlFile $BackupFile
} elseif ($BackupFile -match "projeto|files") {
    $results.Files = Restore-ProjectFiles -ZipFile $BackupFile
} else {
    Write-Log "Tipo de backup nao identificado. Use -MySQLOnly ou -FilesOnly" "WARN"
}

Write-Log "=== RESTORE CONCLUIDO ==="
$results | Format-Table -AutoSize
