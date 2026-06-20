// Omnigent Global Application Controller & Router (SaaS Multi-Tenant Edition)
import { renderDashboardView } from './js/dashboard.js';
import { renderInboxView, initInbox } from './js/channels.js';
import { renderLiveTrackingView, initLiveTracking } from './js/live-tracking.js';
import { renderOrdersView, initOrders } from './js/orders.js';
import { renderAutomationView, initAutomation } from './js/automation.js';
import { renderAIAgentView, initAIAgent } from './js/ai-agent.js';
import { renderWidgetSDKView } from './js/widget-sdk.js';
import { renderAnalyticsView, initAnalytics } from './js/analytics.js';


// Global Tenant State
export const state = {
  businessId: '',
  businessName: '',
  ownerName: '',
  activeView: 'dashboard',
  visitors: [],
  chats: [],
  selectedChatId: null,
  orders: [],
  automations: [],
  aiConfig: {
    systemPrompt: "You are Omnigent AI, an assistant for our online store.",
    temperature: 0.6,
    persona: "Helpful Guide",
    autoReply: true,
  },
  analytics: {
    chatsCount: 0,
    resolvedChats: 0,
    totalSales: 0,
  }
};

// Local Database initialization
const PRESET_BUSINESSES_KEY = 'omnigent_businesses';
const CURRENT_BIZ_KEY = 'omnigent_current_business_id';

const demoState = {
  activeView: 'dashboard',
  visitors: [
    { id: "vis-1", ip: "172.56.21.9", country: "United States", city: "Los Angeles", code: "US", path: "/pricing", duration: "1m 30s", browser: "Chrome", active: true, lat: 34, lon: -118 },
    { id: "vis-2", ip: "82.165.12.98", country: "United Kingdom", city: "London", code: "GB", path: "/cart", duration: "4m 12s", browser: "Safari", active: true, lat: 51, lon: 0 },
    { id: "vis-3", ip: "103.230.104.2", country: "Bangladesh", city: "Dhaka", code: "BD", path: "/checkout", duration: "0m 45s", browser: "Edge", active: true, lat: 23, lon: 90 },
    { id: "vis-4", ip: "122.211.45.6", country: "Japan", city: "Osaka", code: "JP", path: "/products/keyboards", duration: "3m 0s", browser: "Firefox", active: true, lat: 34, lon: 135 }
  ],
  chats: [
    {
      id: "chat-sarah",
      name: "Sarah Jenkins",
      email: "sarah.j@example.com",
      channel: "whatsapp",
      location: "New York, USA",
      ip: "108.45.210.12",
      browser: "Chrome (macOS)",
      lastMessageTime: "2 mins ago",
      messages: [
        { sender: "user", text: "Hi! I ordered a premium headset yesterday but haven't received tracking yet.", time: "10:24 AM" },
        { sender: "agent", text: "Hello Sarah! Let me check that order status for you immediately.", time: "10:25 AM" },
        { sender: "user", text: "Thanks, the order number is ORD-9481.", time: "10:26 AM" }
      ],
      unread: false,
      status: "active",
      orderId: "ORD-9481"
    },
    {
      id: "chat-daisuke",
      name: "Daisuke Sato",
      email: "sato.d@example.jp",
      channel: "messenger",
      location: "Tokyo, Japan",
      ip: "210.140.10.84",
      browser: "Safari (iOS)",
      lastMessageTime: "10 mins ago",
      messages: [
        { sender: "user", text: "こんにちは! Do you ship to Tokyo?", time: "10:15 AM" },
        { sender: "agent", text: "Yes, we ship worldwide! Shipping to Tokyo usually takes 3-5 business days.", time: "10:17 AM" },
        { sender: "user", text: "Perfect! I will place an order now.", time: "10:18 AM" }
      ],
      unread: false,
      status: "active",
      orderId: "ORD-9372"
    }
  ],
  selectedChatId: 'chat-sarah',
  orders: [
    { id: "ORD-9481", customer: "Sarah Jenkins", email: "sarah.j@example.com", items: "Premium Headset x1", amount: 129.99, status: "Delivered", date: "2026-06-15" },
    { id: "ORD-9372", customer: "Daisuke Sato", email: "sato.d@example.jp", items: "Mechanical Keyboard x1", amount: 189.50, status: "Shipped", date: "2026-06-16" }
  ],
  automations: [
    { id: "auto-1", name: "Checkout Cart Abandonment", trigger: "Visitor spends > 30s on /checkout", action: "Trigger automated AI message: 'Need help checking out?'", active: true },
    { id: "auto-2", name: "Welcome Promo", trigger: "New visitor enters landing page", action: "Show chat promo: 'Use WELCOME10 for 10% off!'", active: true }
  ],
  aiConfig: {
    systemPrompt: "You are Omnigent AI, an assistant for TechStore. Help customers find their orders, guide them through checkout, and resolve support requests.",
    temperature: 0.6,
    persona: "Helpful Guide",
    autoReply: true,
  },
  analytics: {
    chatsCount: 384,
    resolvedChats: 362,
    totalSales: 8490,
  }
};

function initDatabase() {
  const DB_VERSION_KEY = 'omnigent_db_saas_v2';
  if (!localStorage.getItem(DB_VERSION_KEY)) {
    localStorage.clear();
    localStorage.setItem(DB_VERSION_KEY, 'true');
  }

  let list = localStorage.getItem(PRESET_BUSINESSES_KEY);
  let businesses = [];
  if (list) {
    try {
      businesses = JSON.parse(list);
    } catch (e) {
      businesses = [];
    }
  }
  
  if (!Array.isArray(businesses)) {
    businesses = [];
  }
  
  const hasTechstore = businesses.some(b => b.id === 'biz-techstore' || b.email === 'admin@techstore.com');
  if (!hasTechstore) {
    const techstore = {
      id: "biz-techstore",
      name: "TechStore",
      ownerName: "John Doe",
      email: "admin@techstore.com",
      password: "admin123",
      primaryColor: "#0071e3",
      industry: "ecommerce",
      state: demoState
    };
    businesses.unshift(techstore);
    localStorage.setItem(PRESET_BUSINESSES_KEY, JSON.stringify(businesses));
  }
}

// Authentication View Controller
function showView(viewName) {
  const landing = document.getElementById('landing-view');
  const auth = document.getElementById('auth-view');
  const app = document.getElementById('app');

  landing.style.display = 'none';
  auth.style.display = 'none';
  app.style.display = 'none';

  if (viewName === 'landing') {
    landing.style.display = 'flex';
  } else if (viewName === 'auth') {
    auth.style.display = 'flex';
  } else if (viewName === 'app') {
    app.style.display = 'flex';
  }
}

// Switch auth tabs
function setAuthTab(tabName) {
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');

  if (tabName === 'login') {
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
    formLogin.style.display = 'flex';
    formRegister.style.display = 'none';
  } else {
    tabLogin.classList.remove('active');
    tabRegister.classList.add('active');
    formLogin.style.display = 'none';
    formRegister.style.display = 'flex';
  }
}

// Save dynamic business state to LocalStorage
export function saveCurrentBusinessState() {
  const currentBizId = sessionStorage.getItem(CURRENT_BIZ_KEY);
  if (!currentBizId) return;

  const businesses = JSON.parse(localStorage.getItem(PRESET_BUSINESSES_KEY) || '[]');
  const index = businesses.findIndex(b => b.id === currentBizId);
  if (index !== -1) {
    businesses[index].state = {
      activeView: state.activeView,
      visitors: state.visitors,
      chats: state.chats,
      selectedChatId: state.selectedChatId,
      orders: state.orders,
      automations: state.automations,
      aiConfig: state.aiConfig,
      analytics: state.analytics
    };
    localStorage.setItem(PRESET_BUSINESSES_KEY, JSON.stringify(businesses));
  }
}

// Load dynamic business state & colors into app state
function loadBusinessSession(bizId) {
  const businesses = JSON.parse(localStorage.getItem(PRESET_BUSINESSES_KEY) || '[]');
  const biz = businesses.find(b => b.id === bizId);
  if (!biz) return false;

  // Load basic business profile details
  state.businessId = biz.id;
  state.businessName = biz.name;
  state.ownerName = biz.ownerName;

  // Load specific items state
  const bizState = biz.state || {
    activeView: 'dashboard',
    visitors: [],
    chats: [],
    selectedChatId: null,
    orders: [],
    automations: [],
    aiConfig: {
      systemPrompt: `You are Omnigent AI, an assistant for ${biz.name}. Help customers navigate our storefront, check order statuses, and answers queries.`,
      temperature: 0.6,
      persona: "Helpful Guide",
      autoReply: true,
    },
    analytics: { chatsCount: 0, resolvedChats: 0, totalSales: 0 }
  };

  // Sync state object properties (preserving live modules reference)
  Object.assign(state, bizState);

  // Set business custom brand primary color
  const color = biz.primaryColor || '#0071e3';
  state.primaryColor = color;
  document.documentElement.style.setProperty('--color-primary', color);

  // Sync sidebar agent details
  const avatar = document.getElementById('sidebar-agent-avatar');
  const name = document.getElementById('sidebar-agent-name');
  const bizName = document.getElementById('sidebar-business-name');

  if (avatar) {
    const initials = biz.ownerName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
    avatar.innerHTML = `${initials}<div class="agent-status-dot"></div>`;
    avatar.style.background = color;
  }
  if (name) name.textContent = biz.ownerName;
  if (bizName) bizName.textContent = biz.name;

  return true;
}

// Handle login submissions
function handleLogin(email, password) {
  const businesses = JSON.parse(localStorage.getItem(PRESET_BUSINESSES_KEY) || '[]');
  const biz = businesses.find(b => b.email.toLowerCase() === email.toLowerCase() && b.password === password);
  if (biz) {
    sessionStorage.setItem(CURRENT_BIZ_KEY, biz.id);
    loadBusinessSession(biz.id);
    showView('app');
    renderActiveView();
    startSimulation();
    showLiveToast(`🔐 Successfully signed in as <strong>${biz.name}</strong>!`);
    return true;
  } else {
    showLiveToast("❌ Invalid email or password. Try again.");
    return false;
  }
}

// Handle registration submissions
function handleRegister(name, ownerName, industry, primaryColor, email, password) {
  const businesses = JSON.parse(localStorage.getItem(PRESET_BUSINESSES_KEY) || '[]');
  const exists = businesses.some(b => b.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    showLiveToast("⚠️ A business with this email address is already registered.");
    return false;
  }

  const newBizId = `biz-${Date.now()}`;
  const newBiz = {
    id: newBizId,
    name: name,
    ownerName: ownerName,
    email: email,
    password: password,
    primaryColor: primaryColor,
    industry: industry,
    state: {
      activeView: 'dashboard',
      visitors: [
        { id: "vis-1", ip: "192.168.1.50", country: "United States", city: "San Francisco", code: "US", path: "/", duration: "0m 10s", browser: "Chrome", active: true, lat: 37, lon: -122 },
        { id: "vis-2", ip: "46.12.89.200", country: "Germany", city: "Munich", code: "DE", path: "/pricing", duration: "1m 15s", browser: "Firefox", active: true, lat: 48, lon: 11 }
      ],
      chats: [
        {
          id: "chat-welcome",
          name: "Welcome Guest",
          email: "customer@company.com",
          channel: "widget",
          location: "San Francisco, USA",
          ip: "192.168.1.50",
          browser: "Chrome",
          lastMessageTime: "Just now",
          messages: [
            { sender: "user", text: "Hello! What integrations do you offer?", time: "Just now" }
          ],
          unread: true,
          status: "active",
          orderId: null
        }
      ],
      selectedChatId: 'chat-welcome',
      orders: [],
      automations: [
        { id: "auto-1", name: "Out of Office Agent", trigger: "Message arrives between 8PM - 8AM", action: "Auto-reply with scheduling calendar link", active: false }
      ],
      aiConfig: {
        systemPrompt: `You are Omnigent AI, a helpful virtual assistant representing ${name}. Answer visitor questions in a friendly, professional manner.`,
        temperature: 0.6,
        persona: "Friendly Assistant",
        autoReply: true,
      },
      analytics: {
        chatsCount: 1,
        resolvedChats: 0,
        totalSales: 0,
      }
    }
  };

  businesses.push(newBiz);
  localStorage.setItem(PRESET_BUSINESSES_KEY, JSON.stringify(businesses));
  sessionStorage.setItem(CURRENT_BIZ_KEY, newBizId);
  loadBusinessSession(newBizId);
  showView('app');
  renderActiveView();
  startSimulation();
  showLiveToast(`🎉 Business <strong>${name}</strong> registered and launched!`);
  return true;
}

// Router View Renderer
export function renderActiveView() {
  const container = document.getElementById('view-content');
  if (!container) return;

  const viewTitle = document.getElementById('view-title');
  if (viewTitle) {
    viewTitle.textContent = getFriendlyViewName(state.activeView);
  }

  // Clear previous contents
  container.innerHTML = '';

  // Render view templates
  switch (state.activeView) {
    case 'dashboard':
      renderDashboardView(container);
      break;
    case 'inbox':
      renderInboxView(container);
      initInbox();
      break;
    case 'live-map':
      renderLiveTrackingView(container);
      initLiveTracking();
      break;
    case 'orders':
      renderOrdersView(container);
      initOrders();
      break;
    case 'automation':
      renderAutomationView(container);
      initAutomation();
      break;
    case 'ai-agent':
      renderAIAgentView(container);
      initAIAgent();
      break;
    case 'widget-sdk':
      renderWidgetSDKView(container);
      break;
    case 'analytics':
      renderAnalyticsView(container);
      initAnalytics();
      break;
    default:
      container.innerHTML = `<div>View ${state.activeView} not found.</div>`;
  }

  // Highlight active sidebar navigation item
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(nav => {
    if (nav.getAttribute('data-view') === state.activeView) {
      nav.classList.add('active');
    } else {
      nav.classList.remove('active');
    }
  });

  // Sync Global topbar indicators
  updateTopbarCounters();
}

function getFriendlyViewName(view) {
  const names = {
    dashboard: "Dashboard Overview",
    inbox: "Unified Omni-Channel Inbox",
    'live-map': "Real-time Visitor Tracker",
    orders: "Order Management System",
    automation: "Workflow Automation Rules",
    'ai-agent': "AI Agent Prompt Configurator",
    'widget-sdk': "Web SDK & Chat Integration",
    analytics: "Business Analytics & CSAT"
  };
  return names[view] || "Omnigent";
}

function updateTopbarCounters() {
  const topbarCount = document.getElementById('topbar-visitors-count');
  const badgeCount = document.getElementById('live-visitors-badge');
  const unreadBadge = document.getElementById('unread-chats-badge');

  if (topbarCount) topbarCount.textContent = state.visitors.length;
  if (badgeCount) badgeCount.textContent = state.visitors.length;

  const unreadCount = state.chats.filter(c => c.unread).length;
  if (unreadBadge) {
    if (unreadCount > 0) {
      unreadBadge.textContent = unreadCount;
      unreadBadge.style.display = 'inline-block';
    } else {
      unreadBadge.style.display = 'none';
    }
  }
}

// Crisp-like Geolocation simulator loop
let simulatorInterval = null;
function startSimulation() {
  if (simulatorInterval) {
    clearInterval(simulatorInterval);
  }

  const paths = ["/", "/pricing", "/products", "/cart", "/checkout", "/docs", "/faq"];
  const cities = [
    { city: "Berlin", country: "Germany", code: "DE", lat: 52, lon: 13 },
    { city: "Sydney", country: "Australia", code: "AU", lat: -33, lon: 151 },
    { city: "Paris", country: "France", code: "FR", lat: 48, lon: 2 },
    { city: "Toronto", country: "Canada", code: "CA", lat: 43, lon: -79 },
    { city: "Singapore", country: "Singapore", code: "SG", lat: 1, lon: 103 },
    { city: "Cape Town", country: "South Africa", code: "ZA", lat: -33, lon: 18 }
  ];
  const browsers = ["Chrome", "Safari", "Firefox", "Edge", "Chrome (Android)", "Safari (iOS)"];
  
  simulatorInterval = setInterval(() => {
    // Check if we are still authenticated, otherwise stop simulation
    const currentBizId = sessionStorage.getItem(CURRENT_BIZ_KEY);
    if (!currentBizId) {
      clearInterval(simulatorInterval);
      simulatorInterval = null;
      return;
    }

    // 35% chance a visitor changes their path
    if (Math.random() < 0.35 && state.visitors.length > 0) {
      const randomIdx = Math.floor(Math.random() * state.visitors.length);
      const visitor = state.visitors[randomIdx];
      const oldPath = visitor.path;
      const newPath = paths[Math.floor(Math.random() * paths.length)];
      
      if (oldPath !== newPath) {
        visitor.path = newPath;
        
        showLiveToast(`👤 Visitor from <strong>${visitor.city}, ${visitor.country}</strong> navigated to <code>${newPath}</code>`);
        
        // If checkout path, trigger automation if active
        if (newPath === '/checkout' && state.automations.length > 0 && state.automations[0].active) {
          setTimeout(() => {
            triggerAutomatedMessage(visitor);
          }, 1500);
        }
        
        // Save state and re-render active view
        saveCurrentBusinessState();
        if (state.activeView === 'live-map' || state.activeView === 'dashboard') {
          renderActiveView();
        }
      }
    }
    
    // 15% chance a new visitor enters the website
    if (Math.random() < 0.18 && state.visitors.length < 9) {
      const cityPick = cities[Math.floor(Math.random() * cities.length)];
      const randIp = `${Math.floor(Math.random() * 200) + 20}.${Math.floor(Math.random() * 240)}.${Math.floor(Math.random() * 240)}.${Math.floor(Math.random() * 240)}`;
      const newVis = {
        id: `vis-${Date.now()}`,
        ip: randIp,
        country: cityPick.country,
        city: cityPick.city,
        code: cityPick.code,
        path: "/",
        duration: "0m 0s",
        browser: browsers[Math.floor(Math.random() * browsers.length)],
        active: true,
        lat: cityPick.lat,
        lon: cityPick.lon
      };
      
      state.visitors.push(newVis);
      showLiveToast(`🟢 New visitor connected from <strong>${newVis.city}, ${newVis.country}</strong>`);
      
      saveCurrentBusinessState();
      if (state.activeView === 'live-map' || state.activeView === 'dashboard') {
        renderActiveView();
      }
    }

    // 12% chance an idle visitor disconnects
    if (Math.random() < 0.12 && state.visitors.length > 2) {
      const removeIdx = Math.floor(Math.random() * state.visitors.length);
      state.visitors.splice(removeIdx, 1);
      
      saveCurrentBusinessState();
      updateTopbarCounters();
      
      if (state.activeView === 'live-map' || state.activeView === 'dashboard') {
        renderActiveView();
      }
    }

    // 8% chance an omni-channel message arrives
    if (Math.random() < 0.08) {
      generateIncomingOmnichannelMessage();
    }

  }, 7000);
}

// Automation Rule Actions simulator
function triggerAutomatedMessage(visitor) {
  const existingChat = state.chats.find(c => c.ip === visitor.ip);
  if (existingChat) return; // Chat already open

  const newChat = {
    id: `chat-${visitor.id}`,
    name: `Guest Visitor #${Math.floor(Math.random() * 900) + 100}`,
    email: "unknown@visitor.com",
    channel: "widget",
    location: `${visitor.city}, ${visitor.country}`,
    ip: visitor.ip,
    browser: visitor.browser,
    lastMessageTime: "Just now",
    messages: [
      { sender: "agent", text: `🤖 [Omnigent Automation] Hi there! I noticed you are checking out. Do you need any assistance completing your order?`, time: "Just now" }
    ],
    unread: false,
    status: "active",
    orderId: null
  };

  state.chats.unshift(newChat);
  showLiveToast(`🤖 Automation rule triggered for checkout visitor from <strong>${visitor.city}</strong>`);
  
  saveCurrentBusinessState();
  if (state.activeView === 'inbox' || state.activeView === 'dashboard') {
    renderActiveView();
  }
}

// Generate Mock Omni-channel Message
function generateIncomingOmnichannelMessage() {
  const sources = [
    { channel: "whatsapp", name: "David Miller", text: "Is my refund processed for order ORD-9481?", location: "Austin, USA", mail: "david.m@example.com" },
    { channel: "messenger", name: "Elena Rostova", text: "Hey! Do you have this chair in White color?", location: "Moscow, Russia", mail: "elena.r@example.ru" },
    { channel: "instagram", name: "Lucas Dupont", text: "Sent you a DM about the partnership proposal.", location: "Paris, France", mail: "lucas@dupont.fr" }
  ];
  
  const selected = sources[Math.floor(Math.random() * sources.length)];
  const chatId = `chat-omni-${Date.now()}`;
  
  const existing = state.chats.find(c => c.name === selected.name);
  if (existing) {
    existing.messages.push({ sender: "user", text: selected.text, time: "Just now" });
    existing.unread = true;
    existing.lastMessageTime = "Just now";
  } else {
    // Generate order linking if whatsapp
    let orderId = null;
    if (selected.channel === "whatsapp" && state.orders.length > 0) {
      orderId = state.orders[0].id;
    }

    state.chats.unshift({
      id: chatId,
      name: selected.name,
      email: selected.mail,
      channel: selected.channel,
      location: selected.location,
      ip: `185.${Math.floor(Math.random()*254)}.${Math.floor(Math.random()*254)}.23`,
      browser: "Mobile Application SDK",
      lastMessageTime: "Just now",
      messages: [
        { sender: "user", text: selected.text, time: "Just now" }
      ],
      unread: true,
      status: "active",
      orderId: orderId
    });
  }

  showLiveToast(`💬 New <strong>${selected.channel.toUpperCase()}</strong> message from <strong>${selected.name}</strong>`);
  saveCurrentBusinessState();
  updateTopbarCounters();

  // Handle AI Auto Reply if enabled
  if (state.aiConfig.autoReply) {
    const chatToReply = state.chats.find(c => c.name === selected.name);
    if (chatToReply) {
      setTimeout(() => {
        simulateAIReply(chatToReply);
      }, 2000);
    }
  }

  if (state.activeView === 'inbox' || state.activeView === 'dashboard') {
    renderActiveView();
  }
}

// AI Agent response generator
export function simulateAIReply(chat) {
  const lastUserMsg = [...chat.messages].reverse().find(m => m.sender === 'user')?.text || "";
  
  let replyText = "";
  if (lastUserMsg.toLowerCase().includes("refund") || lastUserMsg.toLowerCase().includes("ord-")) {
    replyText = `Under the prompt guideline: [${state.aiConfig.persona}], I checked the order status. The refund has been successfully initiated and will appear in your bank account in 2-3 business days.`;
  } else if (lastUserMsg.toLowerCase().includes("chair") || lastUserMsg.toLowerCase().includes("white")) {
    replyText = `Yes! We do have the Ergonomic Desk Chair in White. It is currently in stock and ready to ship within 24 hours. Would you like me to send you the direct checkout link?`;
  } else if (lastUserMsg.toLowerCase().includes("ship") || lastUserMsg.toLowerCase().includes("tokyo")) {
    replyText = `Yes, we offer express global shipping! Delivery to Tokyo, Japan generally takes 3 to 5 business days, and shipping is free for orders over $150.`;
  } else {
    replyText = `Thanks for reaching out! Regarding your message ("${lastUserMsg}"), I am here to help. Could you please specify your order number or detail your inquiry so I can assist you better?`;
  }

  const newMsgObj = { sender: "agent", text: "...", time: "Typing..." };
  chat.messages.push(newMsgObj);
  
  if (state.activeView === 'inbox' && state.selectedChatId === chat.id) {
    renderActiveView(); // Render typing...
  }

  if (chat.id === 'chat-widget-demo') {
    sessionStorage.setItem('omni_chat_msgs', JSON.stringify(chat.messages));
    try {
      const chatChannel = new BroadcastChannel('omnigent_chat');
      chatChannel.postMessage({
        type: 'AGENT_CHAT_REPLY',
        text: '...',
        isTyping: true
      });
      chatChannel.close();
    } catch (e) {
      console.warn('BroadcastChannel failed:', e);
    }
  }

  let words = replyText.split(" ");
  let currentWordIdx = 0;
  let accumulatedText = "";

  const typeInterval = setInterval(() => {
    // Check if user has logged out in the middle of typing
    if (!sessionStorage.getItem(CURRENT_BIZ_KEY)) {
      clearInterval(typeInterval);
      return;
    }

    if (currentWordIdx < words.length) {
      accumulatedText += (currentWordIdx === 0 ? "" : " ") + words[currentWordIdx];
      newMsgObj.text = accumulatedText;
      currentWordIdx++;

      // Update in DOM if user is viewing this chat
      if (state.activeView === 'inbox' && state.selectedChatId === chat.id) {
        const msgContainer = document.getElementById('chat-messages-container');
        if (msgContainer) {
          const typingBubble = msgContainer.querySelector('.message-bubble:last-child .message-content');
          if (typingBubble) {
            typingBubble.textContent = accumulatedText;
          }
        }
      }

      // Sync typing with chat widget iframe
      if (chat.id === 'chat-widget-demo') {
        sessionStorage.setItem('omni_chat_msgs', JSON.stringify(chat.messages));
        try {
          const chatChannel = new BroadcastChannel('omnigent_chat');
          chatChannel.postMessage({
            type: 'AGENT_CHAT_REPLY',
            text: accumulatedText,
            isTyping: true
          });
          chatChannel.close();
        } catch (e) {}
      }
    } else {
      clearInterval(typeInterval);
      newMsgObj.time = "Just now";
      chat.lastMessageTime = "Just now";
      
      saveCurrentBusinessState();
      
      if (chat.id === 'chat-widget-demo') {
        sessionStorage.setItem('omni_chat_msgs', JSON.stringify(chat.messages));
        try {
          const chatChannel = new BroadcastChannel('omnigent_chat');
          chatChannel.postMessage({
            type: 'AGENT_CHAT_REPLY',
            text: accumulatedText,
            isTyping: false
          });
          chatChannel.close();
        } catch (e) {}
      }
      
      if (state.activeView === 'inbox') {
        renderActiveView();
      }
      showLiveToast(`🤖 AI Agent automated response sent to <strong>${chat.name}</strong>`);
    }
  }, 180);
}

// Elegant notification Toast system
export function showLiveToast(htmlContent) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'live-activity-toast';
  toast.innerHTML = `
    <div class="toast-avatar">⚡</div>
    <div class="toast-body">${htmlContent}</div>
  `;

  container.appendChild(toast);

  // Auto remove toast after 4 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 4200);
}

// Listen for iframe embedded widget messages
window.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CUSTOMER_CHAT_MESSAGE') {
    const text = event.data.text;
    
    // Find the Guest Widget Chat or create one
    let widgetChat = state.chats.find(c => c.id === 'chat-widget-demo');
    if (!widgetChat) {
      widgetChat = {
        id: 'chat-widget-demo',
        name: 'Web Store Customer',
        email: 'customer@live-widget.com',
        channel: 'widget',
        location: 'California, USA',
        ip: '74.125.19.147',
        browser: 'Chrome (Simulated)',
        lastMessageTime: 'Just now',
        messages: [],
        unread: true,
        status: 'active',
        orderId: null
      };
      state.chats.unshift(widgetChat);
    }

    widgetChat.messages.push({ sender: 'user', text: text, time: 'Just now' });
    widgetChat.unread = true;
    widgetChat.lastMessageTime = 'Just now';
    
    showLiveToast(`💬 Web Widget message: <em>"${text.substring(0, 30)}..."</em>`);
    saveCurrentBusinessState();
    updateTopbarCounters();

    // Trigger AI response if toggle is enabled
    if (state.aiConfig.autoReply) {
      setTimeout(() => {
        simulateAIReply(widgetChat);
      }, 1500);
    }

    if (state.activeView === 'inbox') {
      renderActiveView();
    }
  }
});

// App Bootstrap Init
function initApp() {
  initDatabase();
  
  // Wire up Land/Auth Navigation & Actions
  const btnLandingLogin = document.getElementById('btn-landing-login');
  const btnLandingRegister = document.getElementById('btn-landing-register');
  const btnHeroCta = document.getElementById('btn-hero-cta');
  const btnHeroDemo = document.getElementById('btn-hero-demo');
  const btnAuthBack = document.getElementById('btn-auth-back');
  const linkToRegister = document.getElementById('link-to-register');
  const linkToLogin = document.getElementById('link-to-login');
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');

  if (btnLandingLogin) btnLandingLogin.addEventListener('click', () => { showView('auth'); setAuthTab('login'); });
  if (btnLandingRegister) btnLandingRegister.addEventListener('click', () => { showView('auth'); setAuthTab('register'); });
  if (btnHeroCta) btnHeroCta.addEventListener('click', () => { showView('auth'); setAuthTab('register'); });
  if (btnHeroDemo) {
    btnHeroDemo.addEventListener('click', () => {
      // Auto login to default TechStore
      handleLogin('admin@techstore.com', 'admin123');
    });
  }
  if (btnAuthBack) btnAuthBack.addEventListener('click', () => { showView('landing'); });
  if (linkToRegister) linkToRegister.addEventListener('click', (e) => { e.preventDefault(); setAuthTab('register'); });
  if (linkToLogin) linkToLogin.addEventListener('click', (e) => { e.preventDefault(); setAuthTab('login'); });
  if (tabLogin) tabLogin.addEventListener('click', () => setAuthTab('login'));
  if (tabRegister) tabRegister.addEventListener('click', () => setAuthTab('register'));

  // Pricing Plan Clicks
  document.querySelectorAll('.btn-pricing-select').forEach(btn => {
    btn.addEventListener('click', () => {
      const plan = btn.getAttribute('data-plan');
      if (plan === 'Enterprise') {
        showLiveToast("💼 Enterprise Sales request simulated!");
      } else {
        showView('auth');
        setAuthTab('register');
        showLiveToast(`👉 Complete registration to get started on the <strong>${plan}</strong> plan!`);
      }
    });
  });

  // Wire up Auth Forms Submissions
  const formLoginSubmit = document.getElementById('form-login');
  if (formLoginSubmit) {
    formLoginSubmit.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const pass = document.getElementById('login-password').value;
      handleLogin(email, pass);
    });
  }

  const formRegisterSubmit = document.getElementById('form-register');
  if (formRegisterSubmit) {
    formRegisterSubmit.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('register-biz-name').value.trim();
      const owner = document.getElementById('register-owner-name').value.trim();
      const industry = document.getElementById('register-industry').value;
      const color = document.getElementById('register-color').value;
      const email = document.getElementById('register-email').value.trim();
      const pass = document.getElementById('register-password').value;

      handleRegister(name, owner, industry, color, email, pass);
    });
  }

  // Logout control
  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      sessionStorage.removeItem(CURRENT_BIZ_KEY);
      showView('landing');
      showLiveToast("🔒 Successfully logged out of business hub.");
    });
  }

  // Set up Nav links Click Events inside app dashboard
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');
      
      const view = item.getAttribute('data-view');
      state.activeView = view;
      saveCurrentBusinessState();
      renderActiveView();
    });
  });

  // Check initial Auth session
  const currentBizId = sessionStorage.getItem(CURRENT_BIZ_KEY);
  if (currentBizId) {
    const loaded = loadBusinessSession(currentBizId);
    if (loaded) {
      showView('app');
      renderActiveView();
      startSimulation();
      return;
    }
  }

  // Default fallback: show SaaS landing page
  showView('landing');
}

window.addEventListener('DOMContentLoaded', initApp);
