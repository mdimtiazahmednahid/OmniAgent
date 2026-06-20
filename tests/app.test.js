// @vitest-environment jsdom
import { beforeEach, describe, it, expect, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf-8');

describe('App Controller & Authentication Tests', () => {
  let appModule;

  beforeEach(async () => {
    // Reset DOM
    document.documentElement.innerHTML = html.replace('<script type="module" src="app.js"></script>', '');
    
    // Clear mock storages
    localStorage.clear();
    sessionStorage.clear();

    // Import app module dynamically to ensure DOM is ready
    vi.resetModules();
    appModule = await import('../app.js');
    
    // Dispatch DOMContentLoaded to trigger initApp
    window.dispatchEvent(new window.Event('DOMContentLoaded'));
  });

  it('should initialize database with demo TechStore business', () => {
    const businesses = JSON.parse(localStorage.getItem('omnigent_businesses'));
    expect(businesses).toBeInstanceOf(Array);
    expect(businesses.length).toBeGreaterThanOrEqual(1);
    expect(businesses[0].id).toBe('biz-techstore');
  });

  it('should successfully handle login for preset business', () => {
    // Initial view should be landing
    expect(document.getElementById('landing-view').style.display).not.toBe('none');
    expect(document.getElementById('app').style.display).toBe('none');

    // Attempt login
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const loginForm = document.getElementById('form-login');

    if (emailInput && passwordInput && loginForm) {
      emailInput.value = 'admin@techstore.com';
      passwordInput.value = 'admin123';
      
      // Simulate form submit
      loginForm.dispatchEvent(new window.Event('submit'));
    }

    // Verify session state and views
    expect(sessionStorage.getItem('omnigent_current_business_id')).toBe('biz-techstore');
    expect(document.getElementById('app').style.display).toBe('flex');
    expect(document.getElementById('landing-view').style.display).toBe('none');
  });

  it('should prevent login with invalid credentials', () => {
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const loginForm = document.getElementById('form-login');

    if (emailInput && passwordInput && loginForm) {
      emailInput.value = 'wrong@email.com';
      passwordInput.value = 'wrongpassword';
      loginForm.dispatchEvent(new window.Event('submit'));
    }

    // Verify login failed
    expect(sessionStorage.getItem('omnigent_current_business_id')).toBeNull();
    expect(document.getElementById('app').style.display).toBe('none');
  });

  it('should successfully register a new business', () => {
    // Switch to register tab
    const tabRegister = document.getElementById('tab-register');
    if (tabRegister) {
      tabRegister.dispatchEvent(new window.Event('click'));
    }

    const bizName = document.getElementById('register-biz-name');
    const ownerName = document.getElementById('register-owner-name');
    const email = document.getElementById('register-email');
    const password = document.getElementById('register-password');
    const registerForm = document.getElementById('form-register');

    if (bizName && ownerName && email && password && registerForm) {
      bizName.value = 'New Cafe';
      ownerName.value = 'Alice Smith';
      email.value = 'alice@newcafe.com';
      password.value = 'cafe123';
      registerForm.dispatchEvent(new window.Event('submit'));
    }

    // Verify new business registered and logged in
    const currentBizId = sessionStorage.getItem('omnigent_current_business_id');
    expect(currentBizId).toBeDefined();
    expect(currentBizId).toContain('biz-');
    
    const businesses = JSON.parse(localStorage.getItem('omnigent_businesses'));
    const registeredBiz = businesses.find(b => b.id === currentBizId);
    expect(registeredBiz).toBeDefined();
    expect(registeredBiz.name).toBe('New Cafe');
    expect(registeredBiz.ownerName).toBe('Alice Smith');
  });

  it('should switch active view and sync sidebar navigation classes', () => {
    // Login first
    sessionStorage.setItem('omnigent_current_business_id', 'biz-techstore');
    window.dispatchEvent(new window.Event('DOMContentLoaded'));

    const inboxNav = document.querySelector('.nav-item[data-view="inbox"]');
    expect(inboxNav).toBeDefined();

    // Click inbox navigation link
    inboxNav.dispatchEvent(new window.Event('click'));

    // State activeView should be updated
    expect(appModule.state.activeView).toBe('inbox');
    expect(inboxNav.classList.contains('active')).toBe(true);

    // Other views (e.g. dashboard) should not be active
    const dashNav = document.querySelector('.nav-item[data-view="dashboard"]');
    expect(dashNav.classList.contains('active')).toBe(false);
  });

  it('should sign out successfully and return to landing page', () => {
    // Login
    sessionStorage.setItem('omnigent_current_business_id', 'biz-techstore');
    window.dispatchEvent(new window.Event('DOMContentLoaded'));

    expect(document.getElementById('app').style.display).toBe('flex');

    // Click logout button
    const logoutBtn = document.getElementById('btn-logout');
    expect(logoutBtn).toBeDefined();
    logoutBtn.dispatchEvent(new window.Event('click'));

    // Verify logout
    expect(sessionStorage.getItem('omnigent_current_business_id')).toBeNull();
    expect(document.getElementById('landing-view').style.display).not.toBe('none');
    expect(document.getElementById('app').style.display).toBe('none');
  });
});
