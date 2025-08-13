// dashboard-payments.js - Script para o Dashboard de Pagamentos BBP

class PaymentsDashboard {
  constructor() {
    this.paymentsData = [
      {
        id: 1,
        description: "IPTU 2023",
        entity: "Prefeitura",
        dueDate: "15/03/2023",
        amount: 1250.00,
        status: "pending",
        type: "tax"
      },
      {
        id: 2,
        description: "Energia Elétrica",
        entity: "Light",
        dueDate: "10/03/2023",
        amount: 350.50,
        status: "paid",
        type: "bill"
      }
    ];
    
    this.initElements();
    this.setupEventListeners();
    this.renderPayments();
  }
  
  initElements() {
    this.menuToggle = document.querySelector('.menu-toggle');
    this.addPaymentBtn = document.querySelector('.dashboard-header .btn');
    this.payAllBtn = document.querySelector('.payment-total .btn');
    this.typeFilter = document.querySelectorAll('.filter-select')[0];
    this.statusFilter = document.querySelectorAll('.filter-select')[1];
    this.paymentsList = document.querySelector('.payments-list');
    this.totalAmountElement = document.querySelector('.total-amount');
  }
  
  setupEventListeners() {
    // Menu toggle
    this.menuToggle.addEventListener('click', () => this.toggleMenu());
    
    // Adicionar pagamento
    this.addPaymentBtn.addEventListener('click', () => this.addPayment());
    
    // Pagar todos
    this.payAllBtn.addEventListener('click', () => this.payAllPending());
    
    // Filtros
    this.typeFilter.addEventListener('change', () => this.filterPayments());
    this.statusFilter.addEventListener('change', () => this.filterPayments());
  }
  
  toggleMenu() {
    console.log('Menu lateral seria aberto aqui em uma implementação completa');
    // Implementação real abriria/fecharia um menu lateral
  }
  
  addPayment() {
    const description = prompt("Descrição do pagamento:");
    if (!description) return;
    
    const entity = prompt("Entidade:");
    if (!entity) return;
    
    const dueDate = prompt("Data de vencimento (DD/MM/AAAA):");
    if (!dueDate) return;
    
    const amount = parseFloat(prompt("Valor:"));
    if (isNaN(amount)) return;
    
    const type = prompt("Tipo (Imposto/Conta):")?.toLowerCase() || "bill";
    
    const newPayment = {
      id: this.paymentsData.length + 1,
      description,
      entity,
      dueDate,
      amount,
      status: "pending",
      type: type.includes("imposto") ? "tax" : "bill"
    };
    
    this.paymentsData.push(newPayment);
    this.renderPayments();
    alert("Pagamento adicionado com sucesso!");
  }
  
  payAllPending() {
    const totalPending = this.calculateTotalPending();
    
    if (totalPending <= 0) {
      alert("Não há pagamentos pendentes!");
      return;
    }
    
    if (confirm(`Deseja pagar todos os itens pendentes no valor total de R$ ${totalPending.toFixed(2)}?`)) {
      this.paymentsData.forEach(payment => {
        if (payment.status === 'pending') {
          payment.status = 'paid';
        }
      });
      
      this.renderPayments();
      alert("Todos os pagamentos foram realizados com sucesso!");
    }
  }
  
  filterPayments() {
    const typeValue = this.typeFilter.value.toLowerCase();
    const statusValue = this.statusFilter.value.toLowerCase();
    
    document.querySelectorAll('.payment-item').forEach(item => {
      const paymentId = parseInt(item.dataset.id);
      const payment = this.paymentsData.find(p => p.id === paymentId);
      let show = true;
      
      if (typeValue !== 'todos os tipos') {
        if (typeValue === 'imposto' && payment.type !== 'tax') show = false;
        if (typeValue === 'conta' && payment.type !== 'bill') show = false;
      }
      
      if (statusValue !== 'todos os status') {
        if (statusValue === 'pendente' && payment.status !== 'pending') show = false;
        if (statusValue === 'pago' && payment.status !== 'paid') show = false;
      }
      
      item.style.display = show ? 'grid' : 'none';
    });
  }
  
  calculateTotalPending() {
    return this.paymentsData.reduce((sum, payment) => {
      return payment.status === 'pending' ? sum + payment.amount : sum;
    }, 0);
  }
  
  renderPayments() {
    // Salva elementos fixos
    const header = this.paymentsList.querySelector('.payments-header');
    const total = this.paymentsList.querySelector('.payment-total');
    
    // Limpa a lista
    this.paymentsList.innerHTML = '';
    this.paymentsList.appendChild(header);
    
    // Adiciona os itens
    this.paymentsData.forEach(payment => {
      const item = document.createElement('div');
      item.className = 'payment-item';
      item.dataset.id = payment.id;
      
      item.innerHTML = `
        <div>${payment.description}</div>
        <div>${payment.entity}</div>
        <div>${payment.dueDate}</div>
        <div class="payment-status status-${payment.status}">
          ${payment.status === 'pending' ? 'Pendente' : 'Pago'}
        </div>
        <div class="payment-actions">
          <button class="action-btn ${payment.status === 'paid' ? 'disabled' : 'pay-btn'}" 
                  ${payment.status === 'paid' ? 'disabled' : ''}>
            <i class="fas ${payment.status === 'paid' ? 'fa-check' : 'fa-money-bill-wave'}"></i>
          </button>
        </div>
      `;
      
      this.paymentsList.appendChild(item);
    });
    
    // Adiciona o total de volta
    this.paymentsList.appendChild(total);
    
    // Atualiza eventos dos botões de pagar individuais
    this.setupPaymentButtons();
    
    // Atualiza o total a pagar
    this.updateTotalAmount();
  }
  
  setupPaymentButtons() {
    document.querySelectorAll('.pay-btn:not([disabled])').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const item = e.target.closest('.payment-item');
        const paymentId = parseInt(item.dataset.id);
        const payment = this.paymentsData.find(p => p.id === paymentId);
        
        if (confirm(`Deseja pagar ${payment.description} no valor de R$ ${payment.amount.toFixed(2)}?`)) {
          payment.status = 'paid';
          this.renderPayments();
          alert("Pagamento realizado com sucesso!");
        }
      });
    });
  }
  
  updateTotalAmount() {
    const totalPending = this.calculateTotalPending();
    
    this.totalAmountElement.textContent = 
      `R$ ${totalPending.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
      
    this.payAllBtn.style.display = totalPending > 0 ? 'inline-flex' : 'none';
  }
}

// Inicializa o dashboard quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  new PaymentsDashboard();
});
