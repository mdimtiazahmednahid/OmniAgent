// Omnigent Order Management View Module
import { state, showLiveToast, saveCurrentBusinessState } from '../app.js';

export function renderOrdersView(container) {
  container.innerHTML = `
    <!-- Top Action Cards -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
      <div class="stat-pill" style="padding: 10px 16px;">
        <span>Fulfillment Sync: <strong style="color: var(--color-success)">Connected to Shopify/Stripe</strong></span>
      </div>
      <button class="btn btn-primary" id="btn-create-order-trigger">➕ Create Simulated Order</button>
    </div>

    <!-- Orders Filter Section -->
    <div class="card" style="padding: 16px; margin-bottom: 24px; display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
      <input type="text" class="input-field" id="order-search-input" placeholder="Search Order ID or Customer..." style="width: 280px; margin-bottom: 0;">
      
      <select class="select-field" id="order-status-filter" style="width: 160px;">
        <option value="ALL">All Statuses</option>
        <option value="Pending">Pending</option>
        <option value="Paid">Paid</option>
        <option value="Shipped">Shipped</option>
        <option value="Delivered">Delivered</option>
        <option value="Refunded">Refunded</option>
      </select>
    </div>

    <!-- Orders Table Card -->
    <div class="card orders-table-card">
      <table class="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Email</th>
            <th>Items Ordered</th>
            <th>Amount</th>
            <th>Fulfillment</th>
            <th>Order Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody id="orders-table-rows">
          <!-- Rendered dynamically -->
        </tbody>
      </table>
    </div>

    <!-- Create Order Modal overlay -->
    <div id="create-order-modal" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); z-index: 2000; align-items: center; justify-content: center;">
      <div class="card" style="width: 450px; background-color: var(--bg-surface); padding: 32px; border-radius: 12px; box-shadow: var(--shadow-lg);">
        <h3 style="margin-bottom: 20px; font-weight: 600;">Simulate New Customer Order</h3>
        
        <div class="input-group">
          <label class="input-label">Customer Full Name</label>
          <input type="text" class="input-field" id="new-order-cust" placeholder="Alice Smith">
        </div>

        <div class="input-group">
          <label class="input-label">Email Address</label>
          <input type="email" class="input-field" id="new-order-email" placeholder="alice@example.com">
        </div>

        <div class="input-group">
          <label class="input-label">Product Item</label>
          <select class="select-field" id="new-order-item">
            <option value="Premium Headset x1">Premium Headset ($129.99)</option>
            <option value="Mechanical Keyboard x1">Mechanical Keyboard ($189.50)</option>
            <option value="Ergonomic Desk Chair x1">Ergonomic Desk Chair ($349.00)</option>
            <option value="USB-C Multi-Hub x2">USB-C Multi-Hub ($98.00)</option>
          </select>
        </div>

        <div style="display: flex; gap: 16px; margin-top: 24px; justify-content: flex-end;">
          <button class="btn" id="btn-close-order-modal">Cancel</button>
          <button class="btn btn-primary" id="btn-submit-order-form">Create Order</button>
        </div>
      </div>
    </div>
  `;
}

export function initOrders() {
  const searchInput = document.getElementById('order-search-input');
  const statusFilter = document.getElementById('order-status-filter');
  
  if (searchInput) searchInput.addEventListener('input', renderOrderRows);
  if (statusFilter) statusFilter.addEventListener('change', renderOrderRows);

  // Modal control
  const trigger = document.getElementById('btn-create-order-trigger');
  const modal = document.getElementById('create-order-modal');
  const closeBtn = document.getElementById('btn-close-order-modal');
  const submitBtn = document.getElementById('btn-submit-order-form');

  if (trigger && modal) {
    trigger.addEventListener('click', () => {
      modal.style.display = 'flex';
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  if (submitBtn && modal) {
    submitBtn.addEventListener('click', () => {
      const customer = document.getElementById('new-order-cust').value.trim();
      const email = document.getElementById('new-order-email').value.trim();
      const items = document.getElementById('new-order-item').value;
      
      if (!customer || !email) {
        showLiveToast("⚠️ Customer name and email are required fields.");
        return;
      }

      // Calculate mock prices
      const priceMap = {
        "Premium Headset x1": 129.99,
        "Mechanical Keyboard x1": 189.50,
        "Ergonomic Desk Chair x1": 349.00,
        "USB-C Multi-Hub x2": 98.00
      };
      
      const newOrder = {
        id: `ORD-${Math.floor(Math.random() * 8999) + 1000}`,
        customer: customer,
        email: email,
        items: items,
        amount: priceMap[items] || 49.99,
        status: "Paid",
        date: new Date().toISOString().split('T')[0]
      };

      state.orders.unshift(newOrder);
      modal.style.display = 'none';
      showLiveToast(`🎉 New order <strong>${newOrder.id}</strong> successfully registered for ${customer}`);
      
      // Update analytics
      state.analytics.totalSales += newOrder.amount;
      saveCurrentBusinessState();
      
      // Reset inputs & re-render
      document.getElementById('new-order-cust').value = '';
      document.getElementById('new-order-email').value = '';
      renderOrderRows();
    });
  }

  // Draw initial list
  renderOrderRows();
}

function renderOrderRows() {
  const tbody = document.getElementById('orders-table-rows');
  if (!tbody) return;

  const searchVal = document.getElementById('order-search-input')?.value.toLowerCase() || '';
  const filterVal = document.getElementById('order-status-filter')?.value || 'ALL';

  const filteredOrders = state.orders.filter(order => {
    // Search filter
    const matchesSearch = order.customer.toLowerCase().includes(searchVal) ||
                          order.id.toLowerCase().includes(searchVal) ||
                          order.email.toLowerCase().includes(searchVal);
    
    // Status filter
    const matchesStatus = filterVal === 'ALL' || order.status === filterVal;
    
    return matchesSearch && matchesStatus;
  });

  if (filteredOrders.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; color: var(--text-muted); padding: 32px;">
          No matching order records found.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filteredOrders.map(o => {
    let badgeClass = 'badge-success';
    if (o.status === 'Pending') badgeClass = 'badge-warning';
    if (o.status === 'Shipped') badgeClass = 'badge-info';
    if (o.status === 'Refunded') badgeClass = 'badge-danger';

    return `
      <tr>
        <td style="font-weight: 600; color: var(--color-primary);">${o.id}</td>
        <td>${o.customer}</td>
        <td style="color: var(--text-secondary); font-size: 13px;">${o.email}</td>
        <td>${o.items}</td>
        <td style="font-weight: 600;">$${o.amount.toFixed(2)}</td>
        <td><span class="badge ${badgeClass}">${o.status}</span></td>
        <td style="color: var(--text-muted); font-size: 13px;">${o.date}</td>
        <td>
          <button class="btn btn-status-toggle" data-order-id="${o.id}" style="padding: 4px 8px; font-size: 11px; border-radius: 4px;">
            Next Stage
          </button>
        </td>
      </tr>
    `;
  }).join("");

  // Attach status toggle listener
  tbody.querySelectorAll('.btn-status-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const orderId = btn.getAttribute('data-order-id');
      const order = state.orders.find(o => o.id === orderId);
      if (order) {
        // Simple state cycle
        const cycle = {
          'Pending': 'Paid',
          'Paid': 'Shipped',
          'Shipped': 'Delivered',
          'Delivered': 'Refunded',
          'Refunded': 'Paid'
        };
        const nextStatus = cycle[order.status] || 'Paid';
        order.status = nextStatus;
        saveCurrentBusinessState();
        showLiveToast(`🔄 Order <strong>${order.id}</strong> status cycled to <strong>${nextStatus}</strong>`);
        renderOrderRows();
      }
    });
  });
}
