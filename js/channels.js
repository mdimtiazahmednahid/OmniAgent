// Omnigent Unified Inbox Module
import { state, simulateAIReply, showLiveToast, saveCurrentBusinessState } from '../app.js';

export function renderInboxView(container) {
  // If no chat is selected, select the first one by default
  if (!state.selectedChatId && state.chats.length > 0) {
    state.selectedChatId = state.chats[0].id;
  }

  const selectedChat = state.chats.find(c => c.id === state.selectedChatId);

  // Clear unread flag when viewing
  if (selectedChat && selectedChat.unread) {
    selectedChat.unread = false;
    saveCurrentBusinessState();
  }

  container.innerHTML = `
    <div class="inbox-container">
      <!-- Chat List Sidebar (Left) -->
      <div class="inbox-list-panel">
        <div class="inbox-search-bar">
          <input type="text" class="input-field" id="inbox-search-input" placeholder="Search conversations..." style="width: 100%; border-radius: 20px;">
        </div>
        <div class="inbox-list" id="inbox-chat-list">
          <!-- Rendered dynamically -->
        </div>
      </div>

      <!-- Active Conversation Panel (Center) -->
      <div class="chat-workspace">
        ${selectedChat ? renderChatWorkspaceHTML(selectedChat) : renderEmptyWorkspaceHTML()}
      </div>

      <!-- Customer Profile Info Panel (Right) -->
      <div class="inbox-info-panel">
        ${selectedChat ? renderCustomerInfoPanelHTML(selectedChat) : renderEmptyInfoPanelHTML()}
      </div>
    </div>
  `;
}

function renderChatWorkspaceHTML(chat) {
  const channelLabels = {
    whatsapp: { name: "WhatsApp Direct", color: "var(--color-success)" },
    messenger: { name: "Messenger Link", color: "#3b82f6" },
    instagram: { name: "Instagram DM", color: "#d946ef" },
    widget: { name: "Web Chat SDK", color: "var(--color-primary)" }
  };
  
  const label = channelLabels[chat.channel] || { name: "Omni-Channel", color: "var(--text-secondary)" };

  const messagesHTML = chat.messages.map(m => {
    const isOutgoing = m.sender === 'agent';
    return `
      <div class="message-bubble ${isOutgoing ? 'outgoing' : 'incoming'}">
        <div class="message-content">${m.text}</div>
        <span class="message-meta">${m.time}</span>
      </div>
    `;
  }).join("");

  return `
    <div class="chat-header">
      <div class="chat-header-user">
        <div class="chat-header-name">${chat.name}</div>
        <div class="badge" style="background-color: rgba(255,255,255,0.05); color: ${label.color}; border: 1px solid ${label.color}33">
          ${label.name}
        </div>
      </div>
      <div class="chat-header-meta">
        IP: ${chat.ip} &bull; ${chat.browser}
      </div>
    </div>

    <div class="chat-messages" id="chat-messages-container">
      ${messagesHTML}
    </div>

    <div class="chat-input-area">
      <input type="text" class="chat-textbox" id="chat-message-textbox" placeholder="Type a message... (Press Enter to send)">
      <button class="btn btn-primary" id="chat-send-btn" style="border-radius: 24px; padding: 10px 24px;">Send</button>
    </div>
  `;
}

function renderCustomerInfoPanelHTML(chat) {
  let linkedOrder = null;
  if (chat.orderId) {
    linkedOrder = state.orders.find(o => o.id === chat.orderId);
  }

  return `
    <div class="info-user-card">
      <div class="info-user-avatar">
        ${chat.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()}
      </div>
      <div class="info-user-name">${chat.name}</div>
      <div class="info-user-loc">📍 ${chat.location}</div>
    </div>

    <div class="info-section-title">Session Metadata</div>
    <div class="info-meta-list">
      <div class="info-meta-item">
        <span class="info-meta-label">Email Address</span>
        <span class="info-meta-value">${chat.email}</span>
      </div>
      <div class="info-meta-item">
        <span class="info-meta-label">Connected via</span>
        <span class="info-meta-value" style="text-transform: capitalize;">${chat.channel} API</span>
      </div>
      <div class="info-meta-item">
        <span class="info-meta-label">IP Address</span>
        <span class="info-meta-value">${chat.ip}</span>
      </div>
      <div class="info-meta-item">
        <span class="info-meta-label">Browser details</span>
        <span class="info-meta-value">${chat.browser}</span>
      </div>
    </div>

    <div class="info-section-title">E-Commerce Context</div>
    ${linkedOrder ? `
      <div class="card" style="padding: 12px; margin-bottom: 16px; border-color: rgba(99,102,241,0.2)">
        <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px;">
          <strong style="color: var(--color-primary);">${linkedOrder.id}</strong>
          <span class="badge ${getStatusBadgeClass(linkedOrder.status)}">${linkedOrder.status}</span>
        </div>
        <div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 4px;">Items: ${linkedOrder.items}</div>
        <div style="font-size: 12px; font-weight: 600; color: #fff;">Value: $${linkedOrder.amount.toFixed(2)}</div>
      </div>
      
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <button class="btn btn-primary" id="btn-sync-order" style="padding: 8px; font-size: 12px;">🔄 Sync Logistics</button>
        <button class="btn btn-success" id="btn-ship-order" style="padding: 8px; font-size: 12px;" ${linkedOrder.status === 'Shipped' || linkedOrder.status === 'Delivered' ? 'disabled' : ''}>📦 Mark as Shipped</button>
        <button class="btn" id="btn-refund-order" style="padding: 8px; font-size: 12px; border-color: var(--color-danger); color: var(--color-danger);" ${linkedOrder.status === 'Refunded' ? 'disabled' : ''}>💸 Process Refund</button>
      </div>
    ` : `
      <div style="color: var(--text-muted); font-size: 12px; margin-bottom: 12px;">No active order associated with this customer profile.</div>
      <button class="btn btn-primary" id="btn-link-order-modal" style="width: 100%; font-size: 12px; padding: 8px;">🔗 Link Customer Order</button>
    `}
  `;
}

function getStatusBadgeClass(status) {
  if (status === 'Delivered') return 'badge-success';
  if (status === 'Shipped') return 'badge-info';
  if (status === 'Paid') return 'badge-success';
  if (status === 'Pending') return 'badge-warning';
  return 'badge-danger';
}

function renderEmptyWorkspaceHTML() {
  return `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--text-muted);">
      <svg width="48" height="48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" style="margin-bottom: 16px;">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      <span>Select a conversation to start messaging</span>
    </div>
  `;
}

function renderEmptyInfoPanelHTML() {
  return `<div style="color: var(--text-muted); text-align: center; font-size: 13px;">No customer context loaded.</div>`;
}

// Attach event handlers
export function initInbox() {
  const searchInput = document.getElementById('inbox-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderChatList(e.target.value);
    });
  }

  // Initial Chat List render
  renderChatList();

  // Send message events
  const textInput = document.getElementById('chat-message-textbox');
  const sendBtn = document.getElementById('chat-send-btn');

  const sendMessage = () => {
    if (!textInput || !textInput.value.trim()) return;
    const text = textInput.value.trim();
    textInput.value = '';

    const activeChat = state.chats.find(c => c.id === state.selectedChatId);
    if (activeChat) {
      activeChat.messages.push({
        sender: 'agent',
        text: text,
        time: 'Just now'
      });
      activeChat.lastMessageTime = 'Just now';
      saveCurrentBusinessState();

      // Re-render Inbox
      renderInboxView(document.getElementById('view-content'));
      initInbox();
      
      // If customer chat widget active, trigger message post back
      if (activeChat.id === 'chat-widget-demo') {
        sessionStorage.setItem('omni_chat_msgs', JSON.stringify(activeChat.messages));
        
        try {
          const chatChannel = new BroadcastChannel('omnigent_chat');
          chatChannel.postMessage({
            type: 'AGENT_CHAT_REPLY',
            text: text,
            isTyping: false
          });
          chatChannel.close();
        } catch (e) {
          console.warn('BroadcastChannel failed:', e);
        }

        const widgetIframe = document.getElementById('demo-widget-iframe');
        if (widgetIframe && widgetIframe.contentWindow) {
          widgetIframe.contentWindow.postMessage({
            type: 'AGENT_CHAT_REPLY',
            text: text
          }, '*');
        }
      }

      // 30% chance AI triggers if user manually sent a question and autoReply is enabled
      // (Usually agents manually talk, but we can simulate AI analysis/replies or suggest answers)
    }
  };

  if (textInput) {
    textInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  }
  if (sendBtn) {
    sendBtn.addEventListener('click', sendMessage);
  }

  // Scroll to bottom of chat list
  const msgContainer = document.getElementById('chat-messages-container');
  if (msgContainer) {
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }

  // Order logistics panel event listeners
  const btnSync = document.getElementById('btn-sync-order');
  const btnShip = document.getElementById('btn-ship-order');
  const btnRefund = document.getElementById('btn-refund-order');
  const btnLink = document.getElementById('btn-link-order-modal');

  if (btnSync) {
    btnSync.addEventListener('click', () => {
      showLiveToast("🔄 Real-time logistics checked: Package currently in transit.");
    });
  }

  if (btnShip) {
    btnShip.addEventListener('click', () => {
      const activeChat = state.chats.find(c => c.id === state.selectedChatId);
      if (activeChat && activeChat.orderId) {
        const order = state.orders.find(o => o.id === activeChat.orderId);
        if (order) {
          order.status = 'Shipped';
          saveCurrentBusinessState();
          showLiveToast(`📦 Order <strong>${order.id}</strong> status updated to Shipped.`);
          renderInboxView(document.getElementById('view-content'));
          initInbox();
        }
      }
    });
  }

  if (btnRefund) {
    btnRefund.addEventListener('click', () => {
      const activeChat = state.chats.find(c => c.id === state.selectedChatId);
      if (activeChat && activeChat.orderId) {
        const order = state.orders.find(o => o.id === activeChat.orderId);
        if (order) {
          order.status = 'Refunded';
          saveCurrentBusinessState();
          showLiveToast(`💸 Order <strong>${order.id}</strong> marked as Refunded.`);
          renderInboxView(document.getElementById('view-content'));
          initInbox();
        }
      }
    });
  }

  if (btnLink) {
    btnLink.addEventListener('click', () => {
      const activeChat = state.chats.find(c => c.id === state.selectedChatId);
      if (activeChat) {
        // Link to first open order if none exists
        const unlinkedOrder = state.orders.find(o => !state.chats.some(c => c.orderId === o.id));
        if (unlinkedOrder) {
          activeChat.orderId = unlinkedOrder.id;
          saveCurrentBusinessState();
          showLiveToast(`🔗 Linked order <strong>${unlinkedOrder.id}</strong> with ${activeChat.name}`);
          renderInboxView(document.getElementById('view-content'));
          initInbox();
        } else {
          showLiveToast("⚠️ No free orders available to link. Please create a new order first.");
        }
      }
    });
  }
}

function renderChatList(filterText = '') {
  const listContainer = document.getElementById('inbox-chat-list');
  if (!listContainer) return;

  const filteredChats = state.chats.filter(chat => {
    if (!filterText) return true;
    return chat.name.toLowerCase().includes(filterText.toLowerCase()) || 
           (chat.email && chat.email.toLowerCase().includes(filterText.toLowerCase()));
  });

  if (filteredChats.length === 0) {
    listContainer.innerHTML = `
      <div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 13px;">
        No conversations match filters.
      </div>
    `;
    return;
  }

  const channelSVGs = {
    whatsapp: `<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="#10b981" stroke-width="2"/>`,
    messenger: `<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="#3b82f6" stroke-width="2"/>`,
    instagram: `<rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="#d946ef" stroke-width="2"/><circle cx="12" cy="12" r="4" stroke="#d946ef" stroke-width="2"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="#d946ef" stroke-dasharray="0.1" stroke-width="2"/>`,
    widget: `<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="var(--color-primary)" stroke-width="2"/>`
  };

  listContainer.innerHTML = filteredChats.map(chat => {
    const isSelected = chat.id === state.selectedChatId;
    const lastMsg = chat.messages[chat.messages.length - 1];
    const previewText = lastMsg ? lastMsg.text : 'No messages yet';
    const svgContent = channelSVGs[chat.channel] || '';
    const initials = chat.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();

    return `
      <div class="chat-item ${isSelected ? 'active' : ''}" data-chat-id="${chat.id}">
        <div class="chat-item-avatar-container">
          <div class="chat-item-avatar">${initials}</div>
          <div class="channel-icon-badge">
            <svg fill="none" viewBox="0 0 24 24">${svgContent}</svg>
          </div>
        </div>
        
        <div class="chat-item-details">
          <div class="chat-item-header">
            <span class="chat-item-name">${chat.name}</span>
            <span class="chat-item-time">${chat.lastMessageTime}</span>
          </div>
          <div class="chat-item-preview" style="font-weight: ${chat.unread ? '700' : 'normal'}; color: ${chat.unread ? 'var(--text-primary)' : 'var(--text-secondary)'}">
            ${previewText}
          </div>
        </div>
        ${chat.unread ? `<div style="width: 8px; height: 8px; border-radius: 50%; background-color: var(--color-accent); margin-left: 6px;"></div>` : ''}
      </div>
    `;
  }).join("");

  // Attach click listener to each conversation item
  const items = listContainer.querySelectorAll('.chat-item');
  items.forEach(item => {
    item.addEventListener('click', () => {
      const chatId = item.getAttribute('data-chat-id');
      state.selectedChatId = chatId;
      
      // Update viewport layout
      renderInboxView(document.getElementById('view-content'));
      initInbox();
    });
  });
}
