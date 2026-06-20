// @vitest-environment jsdom
import { beforeEach, describe, it, expect, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf-8');

describe('Unified Inbox Tests', () => {
  let appModule;
  let channelsModule;

  beforeEach(async () => {
    document.documentElement.innerHTML = html.replace('<script type="module" src="app.js"></script>', '');
    localStorage.clear();
    sessionStorage.clear();

    vi.resetModules();
    appModule = await import('../app.js');
    channelsModule = await import('../js/channels.js');
    
    // Login to populate base state
    sessionStorage.setItem('omnigent_current_business_id', 'biz-techstore');
    window.dispatchEvent(new window.Event('DOMContentLoaded'));
  });

  it('should render conversations and select first thread by default', () => {
    const contentContainer = document.getElementById('view-content');
    channelsModule.renderInboxView(contentContainer);
    channelsModule.initInbox();

    // Verify conversation items are rendered
    const items = document.querySelectorAll('.chat-item');
    expect(items.length).toBe(2); // Sarah Jenkins & Daisuke Sato
    expect(items[0].classList.contains('active')).toBe(true); // Default active
    expect(document.querySelector('.chat-header-name').textContent).toBe('Sarah Jenkins');
  });

  it('should filter conversation list using search input', () => {
    const contentContainer = document.getElementById('view-content');
    channelsModule.renderInboxView(contentContainer);
    channelsModule.initInbox();

    const searchInput = document.getElementById('inbox-search-input');
    expect(searchInput).toBeDefined();

    // Search for Daisuke
    searchInput.value = 'Daisuke';
    searchInput.dispatchEvent(new window.Event('input'));

    const items = document.querySelectorAll('.chat-item');
    expect(items.length).toBe(1);
    expect(items[0].querySelector('.chat-item-name').textContent).toBe('Daisuke Sato');
  });

  it('should switch selected conversation threads on click', () => {
    const contentContainer = document.getElementById('view-content');
    channelsModule.renderInboxView(contentContainer);
    channelsModule.initInbox();

    const items = document.querySelectorAll('.chat-item');
    expect(appModule.state.selectedChatId).toBe('chat-sarah');

    // Click second item (Daisuke Sato)
    items[1].dispatchEvent(new window.Event('click'));

    expect(appModule.state.selectedChatId).toBe('chat-daisuke');
    expect(document.querySelector('.chat-header-name').textContent).toBe('Daisuke Sato');
  });

  it('should send an agent reply, render it, and keep event listeners active', () => {
    const contentContainer = document.getElementById('view-content');
    channelsModule.renderInboxView(contentContainer);
    channelsModule.initInbox();

    const activeChat = appModule.state.chats.find(c => c.id === appModule.state.selectedChatId);
    const initialMsgCount = activeChat.messages.length;

    // Type a reply and send it
    const textbox = document.getElementById('chat-message-textbox');
    const sendBtn = document.getElementById('chat-send-btn');
    expect(textbox).toBeDefined();
    expect(sendBtn).toBeDefined();

    textbox.value = 'Your order is processed.';
    sendBtn.dispatchEvent(new window.Event('click'));

    // Check message appended in state and rendered in DOM
    expect(activeChat.messages.length).toBe(initialMsgCount + 1);
    expect(activeChat.messages[activeChat.messages.length - 1].text).toBe('Your order is processed.');

    const bubbleText = document.querySelectorAll('.message-bubble.outgoing .message-content');
    expect(bubbleText[bubbleText.length - 1].textContent).toBe('Your order is processed.');

    // CRITICAL: Verify conversation sidebar is NOT destroyed and still has threads clickable
    const items = document.querySelectorAll('.chat-item');
    expect(items.length).toBe(2);

    // Clicking second item should switch thread successfully (proving event listeners are retained)
    items[1].dispatchEvent(new window.Event('click'));
    expect(appModule.state.selectedChatId).toBe('chat-daisuke');
  });

  it('should trigger logistics status updates and link orders in sidebar', () => {
    const contentContainer = document.getElementById('view-content');
    channelsModule.renderInboxView(contentContainer);
    channelsModule.initInbox();

    // Target chat-sarah linked to ORD-9481 (original status: Delivered)
    const activeChat = appModule.state.chats[0];
    const linkedOrder = appModule.state.orders.find(o => o.id === activeChat.orderId);
    expect(linkedOrder.status).toBe('Delivered');

    // Mark as refund
    const refundBtn = document.getElementById('btn-refund-order');
    expect(refundBtn).toBeDefined();
    refundBtn.dispatchEvent(new window.Event('click'));

    expect(linkedOrder.status).toBe('Refunded');
  });
});
