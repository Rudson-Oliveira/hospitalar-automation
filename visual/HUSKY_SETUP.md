# 🐶 Configuração do Husky - Pre-commit Hooks

## Instalação (A ser realizada posteriormente)

Para instalar e configurar o Husky no projeto, execute os seguintes comandos:

```bash
cd visual

# Instalar Husky
npm install --save-dev husky

# Inicializar Husky
npx husky init

# Criar hook de pre-commit
npx husky add .husky/pre-commit "npm run lint && npx tsc --noEmit && npm run build"

# Tornar o hook executável
chmod +x .husky/pre-commit
```

## Hook Atual (Referência)

Um script de referência foi criado em `.husky-pre-commit` que pode ser usado como base para a configuração do Husky.

## Validações Implementadas

O pre-commit hook executará as seguintes validações:

1. **ESLint**: Verifica a qualidade e o estilo do código
2. **Type Checking**: Valida a tipagem do TypeScript
3. **Build Test**: Garante que o build de produção funciona

## Nota

A instalação completa do Husky será realizada em uma etapa futura para evitar conflitos com o processo de build atual.
