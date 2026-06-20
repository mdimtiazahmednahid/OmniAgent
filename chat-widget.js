// Omnigent standalone embeddable chat widget.
(function () {
  const ROOT_ID = 'omnigent-chat-widget-root';
  const STYLE_ID = 'omnigent-chat-widget-styles';
  const STORAGE_KEY = 'omni_chat_msgs';
  const CHANNEL_NAME = 'omnigent_chat';

  if (window.__omnigentInitialized) return;
  window.__omnigentInitialized = true;

  const defaults = {
    primaryColor: '#0071e3',
    theme: 'light',
    businessName: 'TechStore',
    persona: 'Helpful Guide',
    position: 'right',
    autoResponse: true
  };

  const settings = Object.assign({}, defaults, window.omnigentSettings || {});
  const primaryColor = sanitizeColor(settings.primaryColor, defaults.primaryColor);
  let chatOpen = false;
  let messages = loadMessages();
  let broadcastChannel = null;

  function boot() {
    if (document.getElementById(ROOT_ID)) return;

    injectStyles();

    const widgetContainer = document.createElement('div');
    widgetContainer.id = ROOT_ID;
    document.body.appendChild(widgetContainer);

    const bubbleButton = document.createElement('button');
    bubbleButton.id = 'omnigent-chat-bubble';
    bubbleButton.type = 'button';
    bubbleButton.setAttribute('aria-label', 'Open chat');
    bubbleButton.innerHTML = `
      <svg aria-hidden="true" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    `;
    widgetContainer.appendChild(bubbleButton);

    const chatWindow = document.createElement('section');
    chatWindow.id = 'omnigent-chat-window';
    chatWindow.setAttribute('aria-label', 'Customer support chat');
    chatWindow.innerHTML = renderWindowHTML();
    widgetContainer.appendChild(chatWindow);

    bindEvents(bubbleButton, chatWindow);
    setupBroadcastChannel();
    renderMessages();
  }

  function renderWindowHTML() {
    const chatAgentName = settings.businessName
      ? `${settings.businessName} Assistant`
      : 'Store Support Assistant';
    const chatAgentStatus = settings.persona
      ? `Online · ${settings.persona}`
      : 'Online · AI Agent';

    return `
      <div id="omnigent-chat-header">
        <div id="omnigent-chat-agent-info">
          <div id="omnigent-chat-avatar">AI</div>
          <div>
            <div id="omnigent-chat-agent-name">${escapeHtml(chatAgentName)}</div>
            <div id="omnigent-chat-agent-status"><span id="omnigent-status-dot"></span>${escapeHtml(chatAgentStatus)}</div>
          </div>
        </div>
        <button id="omnigent-chat-close-btn" type="button" aria-label="Close chat">&times;</button>
      </div>

      <div id="omnigent-chat-messages" aria-live="polite"></div>

      <div id="omnigent-chat-suggestions">
        <button class="omni-suggest-chip" type="button">Track my order</button>
        <button class="omni-suggest-chip" type="button">Return policy</button>
        <button class="omni-suggest-chip" type="button">Talk to human</button>
      </div>

      <div id="omnigent-chat-input-container">
        <input type="text" id="omnigent-chat-input" placeholder="Ask a question..." autocomplete="off">
        <button id="omnigent-chat-send-btn" type="button" aria-label="Send message">
          <svg aria-hidden="true" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    `;
  }

  function bindEvents(bubbleButton, chatWindow) {
    const closeBtn = chatWindow.querySelector('#omnigent-chat-close-btn');
    const sendBtn = chatWindow.querySelector('#omnigent-chat-send-btn');
    const textInput = chatWindow.querySelector('#omnigent-chat-input');
    const suggestions = chatWindow.querySelector('#omnigent-chat-suggestions');

    bubbleButton.addEventListener('click', () => {
      chatOpen = !chatOpen;
      chatWindow.style.display = chatOpen ? 'flex' : 'none';
      bubbleButton.setAttribute('aria-label', chatOpen ? 'Close chat' : 'Open chat');
      if (chatOpen) {
        renderMessages();
        textInput?.focus();
      }
    });

    closeBtn?.addEventListener('click', () => {
      chatOpen = false;
      chatWindow.style.display = 'none';
      bubbleButton.setAttribute('aria-label', 'Open chat');
    });

    const handleSendTrigger = () => {
      if (!textInput || !textInput.value.trim()) return;
      sendChatMessage(textInput.value.trim());
      textInput.value = '';
    };

    textInput?.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') handleSendTrigger();
    });

    sendBtn?.addEventListener('click', handleSendTrigger);

    suggestions?.addEventListener('click', (event) => {
      const target = event.target;
      if (target instanceof HTMLElement && target.classList.contains('omni-suggest-chip')) {
        sendChatMessage(target.textContent?.trim() || '');
      }
    });

    window.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'AGENT_CHAT_REPLY') {
        handleAgentReply(event.data.text, Boolean(event.data.isTyping));
      }
    });
  }

  function sendChatMessage(text) {
    if (!text.trim()) return;

    messages.push({
      sender: 'user',
      text,
      time: 'Just now'
    });

    renderMessages();

    if (window.parent && window.parent !== window) {
      window.parent.postMessage({
        type: 'CUSTOMER_CHAT_MESSAGE',
        text
      }, '*');
    }

    if (settings.autoResponse && window.parent === window) {
      queueLocalAssistantReply(text);
    }
  }

  function queueLocalAssistantReply(text) {
    const typing = { sender: 'agent', text: 'One moment...', time: 'Typing...' };
    messages.push(typing);
    renderMessages();

    window.setTimeout(() => {
      typing.text = getFallbackReply(text);
      typing.time = 'Just now';
      renderMessages();
    }, 850);
  }

  function getFallbackReply(text) {
    const lowerText = text.toLowerCase();

    if (lowerText.includes('order') || lowerText.includes('track')) {
      return 'I can help with order tracking. Please share your order number and email address so the support team can look it up.';
    }

    if (lowerText.includes('return') || lowerText.includes('refund')) {
      return 'Returns are usually handled by the store team. Share your order number and what happened, and an agent can review it.';
    }

    if (lowerText.includes('human') || lowerText.includes('agent')) {
      return 'I can route this to a human agent. Please leave your email and a short summary of what you need.';
    }

    return `Thanks for reaching out. ${settings.businessName || 'The team'} will use this chat to help you with orders, product questions, and support requests.`;
  }

  function handleAgentReply(text, isTyping) {
    const safeText = String(text || '');
    const existingTypingIndex = messages.findIndex((message) => message.time === 'Typing...');

    if (isTyping) {
      if (existingTypingIndex !== -1) {
        messages[existingTypingIndex].text = safeText;
      } else {
        messages.push({
          sender: 'agent',
          text: safeText,
          time: 'Typing...'
        });
      }
    } else if (existingTypingIndex !== -1) {
      messages[existingTypingIndex].text = safeText;
      messages[existingTypingIndex].time = 'Just now';
    } else if (!messages.some((message) => message.sender === 'agent' && message.text === safeText && message.time === 'Just now')) {
      messages.push({
        sender: 'agent',
        text: safeText,
        time: 'Just now'
      });
    }

    renderMessages();
  }

  function renderMessages() {
    const list = document.getElementById('omnigent-chat-messages');
    if (!list) return;

    list.innerHTML = messages.map((message) => {
      const isAgent = message.sender === 'agent';
      return `
        <div class="omni-msg-row ${isAgent ? 'omni-msg-incoming' : 'omni-msg-outgoing'}">
          <div class="omni-msg-bubble">${escapeHtml(message.text)}</div>
          <span class="omni-msg-time">${escapeHtml(message.time)}</span>
        </div>
      `;
    }).join('');

    list.scrollTop = list.scrollHeight;
    saveMessages();
  }

  function setupBroadcastChannel() {
    if (!('BroadcastChannel' in window)) return;

    try {
      broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
      broadcastChannel.onmessage = (event) => {
        if (event.data && event.data.type === 'AGENT_CHAT_REPLY') {
          handleAgentReply(event.data.text, Boolean(event.data.isTyping));
        }
      };
    } catch (error) {
      broadcastChannel = null;
    }
  }

  function loadMessages() {
    const welcomeMessage = settings.businessName
      ? `Hello. I am the support assistant for ${settings.businessName}. How can I help today?`
      : 'Hello. I am the Omnigent support assistant. How can I help today?';

    try {
      const stored = window.sessionStorage?.getItem(STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : null;
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (error) {
      // Storage can be blocked in third-party contexts.
    }

    return [{ sender: 'agent', text: welcomeMessage, time: 'Just now' }];
  }

  function saveMessages() {
    try {
      window.sessionStorage?.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      // Keep the in-memory conversation if browser storage is blocked.
    }
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #${ROOT_ID}, #${ROOT_ID} * {
        box-sizing: border-box;
        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Arial, sans-serif;
      }

      #omnigent-chat-bubble {
        position: fixed;
        ${settings.position === 'left' ? 'left' : 'right'}: 24px;
        bottom: 24px;
        width: 58px;
        height: 58px;
        border: none;
        border-radius: 50%;
        background: ${primaryColor};
        box-shadow: 0 12px 32px ${primaryColor}45, 0 1px 2px rgba(0, 0, 0, 0.12);
        color: #fff;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2147483000;
        transition: transform 0.18s ease, box-shadow 0.18s ease;
      }

      #omnigent-chat-bubble:hover {
        transform: translateY(-2px) scale(1.03);
        box-shadow: 0 16px 38px ${primaryColor}55, 0 1px 2px rgba(0, 0, 0, 0.12);
      }

      #omnigent-chat-bubble svg {
        width: 25px;
        height: 25px;
      }

      #omnigent-chat-window {
        position: fixed;
        ${settings.position === 'left' ? 'left' : 'right'}: 24px;
        bottom: 96px;
        width: min(380px, calc(100vw - 32px));
        height: min(560px, calc(100vh - 128px));
        background: rgba(255, 255, 255, 0.96);
        border: 1px solid rgba(210, 210, 215, 0.86);
        border-radius: 24px;
        box-shadow: 0 28px 80px rgba(0, 0, 0, 0.18);
        color: #1d1d1f;
        display: none;
        flex-direction: column;
        overflow: hidden;
        z-index: 2147482999;
        backdrop-filter: blur(20px);
        animation: omni-slide-up 0.22s ease both;
      }

      #omnigent-chat-header {
        min-height: 76px;
        padding: 16px;
        border-bottom: 1px solid #e5e5ea;
        background: rgba(250, 250, 252, 0.92);
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-shrink: 0;
      }

      #omnigent-chat-agent-info {
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 0;
      }

      #omnigent-chat-avatar {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background: ${primaryColor};
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        font-weight: 700;
        flex-shrink: 0;
      }

      #omnigent-chat-agent-name {
        font-size: 15px;
        font-weight: 700;
        color: #1d1d1f;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 220px;
      }

      #omnigent-chat-agent-status {
        display: flex;
        align-items: center;
        gap: 5px;
        color: #6e6e73;
        font-size: 12px;
        margin-top: 2px;
      }

      #omnigent-status-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #34c759;
        box-shadow: 0 0 0 3px rgba(52, 199, 89, 0.14);
        flex-shrink: 0;
      }

      #omnigent-chat-close-btn {
        width: 34px;
        height: 34px;
        border: none;
        border-radius: 50%;
        background: #f2f2f7;
        color: #6e6e73;
        cursor: pointer;
        font-size: 22px;
        line-height: 1;
      }

      #omnigent-chat-close-btn:hover {
        color: #1d1d1f;
        background: #e5e5ea;
      }

      #omnigent-chat-messages {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        padding: 16px;
        background: #fbfbfd;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .omni-msg-row {
        display: flex;
        flex-direction: column;
        max-width: 78%;
      }

      .omni-msg-incoming {
        align-self: flex-start;
      }

      .omni-msg-outgoing {
        align-self: flex-end;
      }

      .omni-msg-bubble {
        border-radius: 18px;
        padding: 10px 13px;
        font-size: 14px;
        line-height: 1.38;
        word-break: break-word;
      }

      .omni-msg-incoming .omni-msg-bubble {
        background: #fff;
        border: 1px solid #e5e5ea;
        color: #1d1d1f;
        border-bottom-left-radius: 6px;
      }

      .omni-msg-outgoing .omni-msg-bubble {
        background: ${primaryColor};
        color: #fff;
        border-bottom-right-radius: 6px;
      }

      .omni-msg-time {
        color: #86868b;
        font-size: 10px;
        margin-top: 4px;
        padding: 0 4px;
      }

      .omni-msg-outgoing .omni-msg-time {
        align-self: flex-end;
      }

      #omnigent-chat-suggestions {
        display: flex;
        gap: 8px;
        padding: 10px 14px;
        overflow-x: auto;
        background: #fbfbfd;
        border-top: 1px solid #e5e5ea;
      }

      .omni-suggest-chip {
        border: 1px solid #d2d2d7;
        border-radius: 999px;
        background: #fff;
        color: #1d1d1f;
        cursor: pointer;
        flex-shrink: 0;
        font-size: 12px;
        font-weight: 600;
        padding: 7px 11px;
      }

      .omni-suggest-chip:hover {
        border-color: ${primaryColor};
        color: ${primaryColor};
      }

      #omnigent-chat-input-container {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 14px;
        background: rgba(250, 250, 252, 0.94);
        border-top: 1px solid #e5e5ea;
      }

      #omnigent-chat-input {
        width: 100%;
        min-width: 0;
        border: 1px solid #d2d2d7;
        border-radius: 999px;
        background: #fff;
        color: #1d1d1f;
        font-size: 14px;
        outline: none;
        padding: 11px 14px;
      }

      #omnigent-chat-input:focus {
        border-color: ${primaryColor};
        box-shadow: 0 0 0 4px ${primaryColor}1f;
      }

      #omnigent-chat-send-btn {
        width: 42px;
        height: 42px;
        border: none;
        border-radius: 50%;
        background: ${primaryColor};
        color: #fff;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      #omnigent-chat-send-btn svg {
        width: 18px;
        height: 18px;
      }

      @media (max-width: 460px) {
        #omnigent-chat-bubble {
          right: 16px;
          bottom: 16px;
        }

        #omnigent-chat-window {
          left: 12px;
          right: 12px;
          bottom: 84px;
          width: auto;
          height: min(560px, calc(100vh - 110px));
        }
      }

      @keyframes omni-slide-up {
        from {
          opacity: 0;
          transform: translateY(12px) scale(0.98);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
    `;

    document.head.appendChild(style);
  }

  function sanitizeColor(value, fallback) {
    const color = String(value || '').trim();
    if (/^#[0-9a-fA-F]{3,8}$/.test(color)) return color;
    if (/^(rgb|hsl)a?\([^)]+\)$/.test(color)) return color;
    return fallback;
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function runWhenReady() {
    if (document.body) {
      boot();
      return;
    }

    document.addEventListener('DOMContentLoaded', boot, { once: true });
  }

  runWhenReady();
})();

