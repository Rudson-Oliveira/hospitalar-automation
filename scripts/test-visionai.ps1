# test-visionai.ps1
# Script de teste para VisionAI com sintaxe PowerShell nativa
# Criado: 2026-01-29
# Autor: Pica-Pau AI Agent

$ErrorActionPreference = "Stop"

Write-Host "=== Teste de Integração VisionAI ===" -ForegroundColor Cyan

# Configuração
$visionaiUrl = "http://localhost:3020"
$headers = @{
    "Content-Type" = "application/json"
}

# Função auxiliar para formatar JSON de resposta
function Format-JsonResponse {
    param($response)
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
}

# 1. Testar Health Endpoint
Write-Host "`n[1/6] Testando Health Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$visionaiUrl/health" -Method GET
    if ($response.StatusCode -eq 200) {
        Write-Host "✓ VisionAI está online" -ForegroundColor Green
        Write-Host "Resposta: $($response.Content)" -ForegroundColor Gray
    }
} catch {
    Write-Host "✗ VisionAI não está respondendo" -ForegroundColor Red
    Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "`nCertifique-se de que o VisionAI está rodando:" -ForegroundColor Yellow
    Write-Host "  cd C:\Users\rudpa\Documents\hospitalar\hospitalar_v2\visionai" -ForegroundColor White
    Write-Host "  npm run dev" -ForegroundColor White
    exit 1
}

# 2. Consultar Status do Sistema
Write-Host "`n[2/6] Consultando status do sistema..." -ForegroundColor Yellow
try {
    $body = @{
        query = "Status do sistema HospitaLar"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$visionaiUrl/api/query" `
        -Method POST `
        -Headers $headers `
        -Body $body
    
    Write-Host "✓ Query executada com sucesso" -ForegroundColor Green
    Write-Host "Resposta:" -ForegroundColor Gray
    Format-JsonResponse $response
} catch {
    Write-Host "⚠ Endpoint /api/query não disponível" -ForegroundColor Yellow
    Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Gray
}

# 3. Listar Agendamentos do Dia
Write-Host "`n[3/6] Consultando agendamentos do dia..." -ForegroundColor Yellow
try {
    $body = @{
        query = "Quais os agendamentos de hoje?"
        context = @{
            date = (Get-Date -Format "yyyy-MM-dd")
            user = "system"
        }
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$visionaiUrl/api/query" `
        -Method POST `
        -Headers $headers `
        -Body $body
    
    Write-Host "✓ Agendamentos consultados" -ForegroundColor Green
    Write-Host "Resposta:" -ForegroundColor Gray
    Format-JsonResponse $response
} catch {
    Write-Host "⚠ Não foi possível consultar agendamentos" -ForegroundColor Yellow
    Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Gray
}

# 4. Criar Orçamento (Comando)
Write-Host "`n[4/6] Testando criação de orçamento..." -ForegroundColor Yellow
try {
    $body = @{
        action = "criar_orcamento"
        paciente_id = 123
        items = @(
            @{
                descricao = "Consulta Médica"
                valor = 150.00
            },
            @{
                descricao = "Exame de Sangue"
                valor = 80.00
            }
        )
    } | ConvertTo-Json -Depth 10
    
    $response = Invoke-WebRequest -Uri "$visionaiUrl/api/command" `
        -Method POST `
        -Headers $headers `
        -Body $body
    
    Write-Host "✓ Comando de orçamento enviado" -ForegroundColor Green
    Write-Host "Resposta:" -ForegroundColor Gray
    Format-JsonResponse $response
} catch {
    Write-Host "⚠ Endpoint /api/command não disponível" -ForegroundColor Yellow
    Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Gray
}

# 5. Verificar Faturamento Pendente
Write-Host "`n[5/6] Verificando faturamento pendente..." -ForegroundColor Yellow
try {
    $body = @{
        query = "Status do faturamento pendente"
        filters = @{
            status = "pendente"
            date_range = @{
                start = (Get-Date).AddDays(-7).ToString("yyyy-MM-dd")
                end = (Get-Date).ToString("yyyy-MM-dd")
            }
        }
    } | ConvertTo-Json -Depth 10
    
    $response = Invoke-WebRequest -Uri "$visionaiUrl/api/query" `
        -Method POST `
        -Headers $headers `
        -Body $body
    
    Write-Host "✓ Faturamento consultado" -ForegroundColor Green
    Write-Host "Resposta:" -ForegroundColor Gray
    Format-JsonResponse $response
} catch {
    Write-Host "⚠ Não foi possível consultar faturamento" -ForegroundColor Yellow
    Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Gray
}

# 6. Obter Histórico de Interações
Write-Host "`n[6/6] Obtendo histórico de interações..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$visionaiUrl/api/history" -Method GET
    Write-Host "✓ Histórico obtido" -ForegroundColor Green
    Write-Host "Resposta:" -ForegroundColor Gray
    Format-JsonResponse $response
} catch {
    Write-Host "⚠ Endpoint /api/history não disponível" -ForegroundColor Yellow
    Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Gray
}

# Resumo
Write-Host "`n=== Teste Concluído ===" -ForegroundColor Green
Write-Host "`nPróximos passos:" -ForegroundColor Cyan
Write-Host "1. Se algum endpoint falhou, verifique se o VisionAI está rodando" -ForegroundColor White
Write-Host "2. Verifique os logs do VisionAI para detalhes de erros" -ForegroundColor White
Write-Host "3. Configure os workflows no N8N para automação" -ForegroundColor White
Write-Host "`nURLs úteis:" -ForegroundColor Cyan
Write-Host "  • VisionAI: $visionaiUrl" -ForegroundColor White
Write-Host "  • Moltbot Chat: http://127.0.0.1:18789/chat" -ForegroundColor White
Write-Host "  • Laravel: http://localhost:8888" -ForegroundColor White
Write-Host "  • Dashboard: https://hospitalarsaude.app.br" -ForegroundColor White
