# 🖥️ apolo-frontend - Painel de Gerenciamento de Chamados

![Next.js](https://img.shields.io/badge/Next.js-14.0+-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript)
![React](https://img.shields.io/badge/React-18.2+-61DAFB?logo=react)

Frontend moderno para visualização e gerenciamento de chamados, integrado com o backend apolo-IA.

## 🚀 Início Rápido

# Clone o repositório
git clone https://github.com/Apolo-API-6-DSM/apolo-frontend

cd apolo-frontend

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev ou npm run start

📂 Estrutura do Projeto
```text
apolo-frontend/
├── app/
│   ├── chamados/               # Páginas de chamados
│   │   ├── page.tsx            # Listagem principal
│   │   └── [id]/page.tsx       # Detalhes do chamado
│   ├── importacao/             # Página de importação
│   ├── layout.tsx              # Layout principal
│   └── page.tsx                # Homepage
├── public/                     # Assets estáticos
│   └── favicon.ico             # Ícone do site
├── src/
│   ├── Components/             # Componentes reutilizáveis
│   ├── services/               # API services
│   └── types/                  # Tipos TypeScript
├── next.config.ts              # Configuração do Next
├── globals.css                 # Estilos globais
└── package.json                # Dependências