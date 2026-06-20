// @vitest-environment jsdom
import { beforeEach, describe, it, expect, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf-8');

describe('Order Manager Tests', () => {
  let appModule;
  let ordersModule;

  beforeEach(async () => {
    document.documentElement.innerHTML = html.replace('<script type="module" src="app.js"></script>', '');
    localStorage.clear();
    sessionStorage.clear();

    vi.resetModules();
    appModule = await import('../app.js');
    ordersModule = await import('../js/orders.js');
    
    // Login to populate base state
    sessionStorage.setItem('omnigent_current_business_id', 'biz-techstore');
    window.dispatchEvent(new window.Event('DOMContentLoaded'));
  });

  it('should render the order management view with default order records', () => {
    const contentContainer = document.getElementById('view-content');
    ordersModule.renderOrdersView(contentContainer);
    ordersModule.initOrders();

    // Verify view has table headers and rows
    const rows = document.querySelectorAll('#orders-table-rows tr');
    expect(rows.length).toBe(2); // Two demo orders
    expect(rows[0].cells[0].textContent).toBe('ORD-9481');
    expect(rows[1].cells[0].textContent).toBe('ORD-9372');
  });

  it('should filter orders by status selection', () => {
    const contentContainer = document.getElementById('view-content');
    ordersModule.renderOrdersView(contentContainer);
    ordersModule.initOrders();

    const statusFilter = document.getElementById('order-status-filter');
    expect(statusFilter).toBeDefined();

    // Filter by Shipped
    statusFilter.value = 'Shipped';
    statusFilter.dispatchEvent(new window.Event('change'));

    const rows = document.querySelectorAll('#orders-table-rows tr');
    expect(rows.length).toBe(1);
    expect(rows[0].cells[0].textContent).toBe('ORD-9372');
  });

  it('should search orders by keyword query', () => {
    const contentContainer = document.getElementById('view-content');
    ordersModule.renderOrdersView(contentContainer);
    ordersModule.initOrders();

    const searchInput = document.getElementById('order-search-input');
    expect(searchInput).toBeDefined();

    // Search for "Sarah"
    searchInput.value = 'Sarah';
    searchInput.dispatchEvent(new window.Event('input'));

    const rows = document.querySelectorAll('#orders-table-rows tr');
    expect(rows.length).toBe(1);
    expect(rows[0].cells[1].textContent).toBe('Sarah Jenkins');
  });

  it('should successfully cycle order fulfillment stage on button click', () => {
    const contentContainer = document.getElementById('view-content');
    ordersModule.renderOrdersView(contentContainer);
    ordersModule.initOrders();

    const firstRowToggle = document.querySelector('.btn-status-toggle');
    expect(firstRowToggle).toBeDefined();

    // ORD-9481 is originally "Delivered"
    expect(appModule.state.orders[0].status).toBe('Delivered');

    // Click to cycle status: Delivered -> Refunded
    firstRowToggle.dispatchEvent(new window.Event('click'));
    expect(appModule.state.orders[0].status).toBe('Refunded');

    // Verify DOM badge updated
    const statusBadge = document.querySelector('#orders-table-rows tr td span.badge');
    expect(statusBadge.textContent).toBe('Refunded');
  });

  it('should simulate creating a new customer order', () => {
    const contentContainer = document.getElementById('view-content');
    ordersModule.renderOrdersView(contentContainer);
    ordersModule.initOrders();

    const prevOrderCount = appModule.state.orders.length;
    const initialSales = appModule.state.analytics.totalSales;

    // Trigger open modal
    const openBtn = document.getElementById('btn-create-order-trigger');
    const modal = document.getElementById('create-order-modal');
    openBtn.dispatchEvent(new window.Event('click'));
    expect(modal.style.display).toBe('flex');

    // Fill form and submit
    document.getElementById('new-order-cust').value = 'Alice Cooper';
    document.getElementById('new-order-email').value = 'alice@cooper.com';
    document.getElementById('new-order-item').value = 'Premium Headset x1'; // $129.99

    const submitBtn = document.getElementById('btn-submit-order-form');
    submitBtn.dispatchEvent(new window.Event('click'));

    // Modal should close and order list updated
    expect(modal.style.display).toBe('none');
    expect(appModule.state.orders.length).toBe(prevOrderCount + 1);
    expect(appModule.state.orders[0].customer).toBe('Alice Cooper');
    expect(appModule.state.orders[0].amount).toBe(129.99);

    // Sales analytics updated
    expect(appModule.state.analytics.totalSales).toBe(initialSales + 129.99);
  });
});
