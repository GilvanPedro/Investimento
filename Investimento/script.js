// Elementos do DOM
const form = document.getElementById('investmentForm');
const list = document.getElementById('investmentList');
const ctx = document.getElementById('investmentChart').getContext('2d');

// Dados iniciais
let investments = [];

// Carregar investimentos do localStorage ao iniciar
document.addEventListener('DOMContentLoaded', () => {
  loadInvestments();
  updateUI();
});

// Inicializar o gráfico
let investmentChart = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: [],
    datasets: [{
      label: 'Meus Investimentos',
      data: [],
      backgroundColor: [
        '#4361ee', '#3f37c9', '#4895ef', '#4cc9f0', '#4895ef',
        '#560bad', '#7209b7', '#b5179e', '#f72585', '#4cc9f0'
      ],
      borderWidth: 1,
      borderColor: '#fff'
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 14
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${percentage}%)`;
          }
        }
      },
      datalabels: {
        color: '#fff',
        font: {
          weight: 'bold',
          size: 14
        },
        formatter: (value, ctx) => {
          const total = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
          const percentage = (value / total * 100).toFixed(1) + "%";
          return percentage;
        }
      }
    },
    animation: {
      animateScale: true,
      animateRotate: true
    }
  },
  plugins: [ChartDataLabels]
});

// Função para carregar investimentos do localStorage
function loadInvestments() {
  const savedInvestments = localStorage.getItem('investmentTracker');
  if (savedInvestments) {
    investments = JSON.parse(savedInvestments);
  }
}

// Função para salvar investimentos no localStorage
function saveInvestments() {
  localStorage.setItem('investmentTracker', JSON.stringify(investments));
}

// Função para atualizar a interface do usuário
function updateUI() {
  // Limpar a lista
  list.innerHTML = '';
  
  // Se não houver investimentos, mostrar mensagem
  if (investments.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.textContent = 'Nenhum investimento adicionado ainda. Adicione seu primeiro investimento acima!';
    list.appendChild(emptyState);
    return;
  }

  // Atualizar a lista de investimentos
  investments.forEach((investment, index) => {
    const li = document.createElement('li');
    li.className = 'investment-item';
    li.dataset.id = index;
    
    li.innerHTML = `
      <div class="investment-info">
        <span class="investment-category">${investment.category}</span>
        <span class="investment-value">R$ ${investment.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
      <div class="investment-actions">
        <button class="delete-btn" title="Remover investimento">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 6h18"></path>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </div>
    `;

    // Adicionar evento de exclusão
    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => deleteInvestment(index));

    list.appendChild(li);
  });

  // Atualizar o gráfico
  updateChart();
}

// Função para adicionar um novo investimento
function addInvestment(category, value) {
  if (!category || isNaN(value) || value <= 0) return false;
  
  const newInvestment = {
    id: Date.now(),
    category: category.trim(),
    value: parseFloat(value),
    date: new Date().toISOString()
  };
  
  investments.push(newInvestment);
  saveInvestments();
  updateUI();
  return true;
}

// Função para remover um investimento
function deleteInvestment(index) {
  if (index >= 0 && index < investments.length) {
    investments.splice(index, 1);
    saveInvestments();
    updateUI();
  }
}

// Função para atualizar o gráfico
function updateChart() {
  if (investments.length === 0) {
    investmentChart.data.labels = [];
    investmentChart.data.datasets[0].data = [];
    investmentChart.update();
    return;
  }

  // Agrupar investimentos por categoria
  const categoriesMap = new Map();
  
  investments.forEach(investment => {
    const category = investment.category;
    if (categoriesMap.has(category)) {
      categoriesMap.set(category, categoriesMap.get(category) + investment.value);
    } else {
      categoriesMap.set(category, investment.value);
    }
  });

  // Ordenar categorias por valor (maior para menor)
  const sortedCategories = Array.from(categoriesMap.entries())
    .sort((a, b) => b[1] - a[1]);

  const labels = sortedCategories.map(item => item[0]);
  const data = sortedCategories.map(item => item[1]);

  // Atualizar o gráfico
  investmentChart.data.labels = labels;
  investmentChart.data.datasets[0].data = data;
  investmentChart.update();
}

// Evento de envio do formulário
form.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const categoryInput = document.getElementById('category');
  const valueInput = document.getElementById('value');
  
  const category = categoryInput.value.trim();
  const value = parseFloat(valueInput.value.replace(/\./g, '').replace(',', '.'));
  
  if (addInvestment(category, value)) {
    form.reset();
    categoryInput.focus();
  } else {
    // Adicionar feedback visual para entrada inválida
    if (!category) {
      categoryInput.classList.add('error');
      setTimeout(() => categoryInput.classList.remove('error'), 1000);
    }
    if (isNaN(value) || value <= 0) {
      valueInput.classList.add('error');
      setTimeout(() => valueInput.classList.remove('error'), 1000);
    }
  }
});

// Formatar valor monetário ao digitar
document.getElementById('value').addEventListener('input', function(e) {
  let value = e.target.value.replace(/\D/g, '');
  value = (value / 100).toLocaleString('pt-BR', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  e.target.value = value;
});
