# 📊 Meus Investimentos (PWA)

Aplicativo web simples e intuitivo para acompanhar seus investimentos. Permite cadastrar categorias (ex.: Ações, FIIs, Renda Fixa), somar valores, visualizar a distribuição em um gráfico de pizza e usar offline como PWA.

## 🚀 Visão Geral
- Interface leve, responsiva e moderna
- Persistência local com `localStorage`
- Gráfico de distribuição por categoria com Chart.js + DataLabels
- PWA: funciona offline e pode ser instalado no celular/desktop

## ✨ Funcionalidades
- **Adicionar investimento**: categoria + valor em R$
- **Listar investimentos** com total por item e ações de remoção
- **Gráfico de pizza** com percentuais por categoria
- **Persistência** automática no navegador
- **Offline-First** com Service Worker e cache de assets

## 🧱 Tecnologias
- **Frontend**: HTML, CSS, JavaScript puro
- **Gráficos**: Chart.js + chartjs-plugin-datalabels (CDN)
- **PWA**: `manifest.json` + `sw.js` (Service Worker)
- **Armazenamento**: `localStorage`

## 📁 Estrutura
```
Investimento/
├─ index.html        # Estrutura e registros do SW + import de Chart.js
├─ style.css         # Estilo responsivo e moderno
├─ script.js         # Lógica: CRUD local, gráfico, formatação
├─ manifest.json     # Config PWA (nome e cores)
├─ sw.js             # Cache de assets e modo offline
```

## ▶️ Como executar localmente
1. Baixe/clonar este diretório.
2. Abra o arquivo `index.html` no navegador.
3. Opcional (recomendado para PWA): servir com um servidor HTTP estático.
   - Exemplos:
     - Node: `npx serve` ou `npx http-server`
     - Python 3: `python -m http.server 8080`
   - Abra `http://localhost:8080` (ou porta exibida).

Observação: alguns navegadores só ativam Service Worker/PWA quando servido via HTTP(s).

## 📦 PWA (instalação e offline)
- O `manifest.json` define nome e cores.
- O `sw.js` faz cache de:
  - `/`, `/index.html`, `/style.css`, `/script.js`
  - CDNs de Chart.js e DataLabels
  - Google Fonts (Inter)
- Após abrir o app uma vez online, ele funciona offline.
- Para instalar, use "Adicionar à tela inicial" no navegador suportado.

## 🧠 Como usar
1. Preencha **Categoria** e **Valor (R$)** no formulário.
2. Clique em **Adicionar Investimento**.
3. Veja a lista atualizada e a distribuição no gráfico.
4. Para remover um item, clique no ícone de lixeira.

Os dados ficam salvos no seu navegador (localStorage). Não há backend.

## ⚙️ Detalhes de implementação
- `script.js`
  - Carrega investimentos do `localStorage` em `DOMContentLoaded`
  - Funções: `loadInvestments()`, `saveInvestments()`, `updateUI()`, `addInvestment()`, `deleteInvestment()`, `updateChart()`
  - Formata moeda no input `#value` em tempo real (pt-BR)
  - Agrega valores por categoria para o gráfico
- `sw.js`
  - Estratégia simples: cache estático na instalação e resposta do cache quando disponível
  - Limpeza de caches antigos no `activate`
- `index.html`
  - Registra o Service Worker
  - Importa Chart.js e o plugin DataLabels por CDN

## 🚢 Deploy
- Qualquer host estático funciona: GitHub Pages, Netlify, Vercel, Cloudflare Pages, etc.
- Garanta que os caminhos do `sw.js`, `manifest.json` e assets sejam servidos na raiz do site ou ajuste as URLs conforme a estrutura do seu host.
- Em GitHub Pages (user/organization site), os caminhos absolutos `/` podem precisar virar relativos. Alternativas:
  - Ajustar `start_url` no `manifest.json`
  - Revisar `ASSETS_TO_CACHE` em `sw.js` para caminhos relativos

## 🔧 Personalização
- Cores e estilos: edite variáveis CSS em `style.css` (`:root`)
- Paleta do gráfico: ajuste `backgroundColor` no dataset em `script.js`
- Ícone do favicon: definido inline como emoji em `index.html` (pode trocar por arquivo)

## 🔒 Privacidade
- Os dados ficam somente no dispositivo do usuário (`localStorage`).
- Não há envio para servidores externos.

## 🛣️ Roadmap (ideias)
- Edição de itens
- Totalizador geral e por categoria
- Exportar/Importar JSON
- Suporte a múltiplas carteiras
- Backup em nuvem (opcional)

## 📄 Licença
Este projeto pode ser usado livremente para fins pessoais e educacionais. Se desejar, adicione um arquivo `LICENSE` (ex.: MIT).
