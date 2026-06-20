// Omnigent Live Visitor Tracking Module
import { state, showLiveToast, renderActiveView, saveCurrentBusinessState } from '../app.js';

export function renderLiveTrackingView(container) {
  container.innerHTML = `
    <div class="live-dashboard-layout">
      <!-- Interactive SVG World Map Card (Left) -->
      <div class="card live-map-card">
        <h3 style="margin-bottom: 15px; font-weight: 600; font-size: 16px; display: flex; align-items: center; justify-content: space-between;">
          <span>Live Visitor Map</span>
          <span style="font-size: 12px; color: var(--text-muted); font-weight: normal;">Equirectangular Cylindrical Radar Projection</span>
        </h3>
        
        <div class="live-map-container" id="live-map-viewport">
          <!-- Stylized Sci-Fi World Map SVG -->
          <svg viewBox="0 0 800 400" class="world-map-svg">
            <defs>
              <radialGradient id="land-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#1e293b" />
                <stop offset="100%" stop-color="#0f172a" />
              </radialGradient>
              <filter id="glow-effect" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Map Grid Gridlines -->
            <g stroke="rgba(34, 50, 80, 0.3)" stroke-width="0.5">
              <!-- Latitude Lines -->
              <line x1="0" y1="50" x2="800" y2="50" />
              <line x1="0" y1="100" x2="800" y2="100" />
              <line x1="0" y1="150" x2="800" y2="150" />
              <line x1="0" y1="200" x2="800" y2="200" stroke-width="1" stroke="rgba(34, 50, 80, 0.6)" /> <!-- Equator -->
              <line x1="0" y1="250" x2="800" y2="250" />
              <line x1="0" y1="300" x2="800" y2="300" />
              <line x1="0" y1="350" x2="800" y2="350" />
              
              <!-- Longitude Lines -->
              <line x1="100" y1="0" x2="100" y2="400" />
              <line x1="200" y1="0" x2="200" y2="400" />
              <line x1="300" y1="0" x2="300" y2="400" />
              <line x1="400" y1="0" x2="400" y2="400" stroke-width="1" stroke="rgba(34, 50, 80, 0.6)" /> <!-- Prime Meridian -->
              <line x1="500" y1="0" x2="500" y2="400" />
              <line x1="600" y1="0" x2="600" y2="400" />
              <line x1="700" y1="0" x2="700" y2="400" />
            </g>

            <!-- Stylized Continental Paths (Futuristic Outlines) -->
            <g fill="var(--bg-hover)" stroke="var(--border-color)" stroke-width="1.5" opacity="0.8">
              <!-- North America -->
              <path d="M 100 80 Q 150 50 200 90 T 260 140 T 180 200 T 100 120 Z" />
              <!-- South America -->
              <path d="M 200 210 Q 230 250 250 280 T 210 370 T 170 240 Z" />
              <!-- Greenland -->
              <path d="M 280 40 Q 320 30 340 60 T 290 80 Z" />
              <!-- Africa -->
              <path d="M 370 200 Q 420 180 470 220 T 450 340 T 380 240 Z" />
              <!-- Eurasia -->
              <path d="M 360 110 Q 480 70 700 80 T 760 180 T 500 210 T 360 150 Z" />
              <!-- Australia -->
              <path d="M 640 270 Q 720 280 700 340 T 630 320 Z" />
            </g>

            <!-- Dynamic Pins Layer -->
            <g id="map-pins-layer">
              <!-- Rendered dynamically by script -->
            </g>
          </svg>
        </div>
      </div>

      <!-- Real-time Session Activity Panel (Right) -->
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div class="card" style="flex-grow: 1; display: flex; flex-direction: column;">
          <h3 style="margin-bottom: 12px; font-weight: 600; font-size: 16px;">Active Browsing Logs</h3>
          
          <div class="live-visitors-list-panel" id="live-visitors-list-container">
            <!-- Rendered dynamically -->
          </div>
        </div>
      </div>
    </div>
  `;
}

// Convert Equirectangular coordinates (lat, lon) to SVG coordinates (800x400)
function geoToSvgCoords(lat, lon) {
  // Longitude range: -180 to 180 -> X: 0 to 800 (center 400)
  const x = 400 + (lon * (800 / 360));
  // Latitude range: -90 to 90 -> Y: 400 to 0 (center 200)
  const y = 200 - (lat * (400 / 180));
  return { x, y };
}

export function initLiveTracking() {
  const pinsLayer = document.getElementById('map-pins-layer');
  const listContainer = document.getElementById('live-visitors-list-container');
  
  if (!pinsLayer || !listContainer) return;

  // Clear previous layers
  pinsLayer.innerHTML = '';
  listContainer.innerHTML = '';

  state.visitors.forEach(vis => {
    const coords = geoToSvgCoords(vis.lat, vis.lon);
    
    // 1. Render glowing pin on SVG map
    const pinG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    pinG.setAttribute('class', 'map-pin');
    pinG.setAttribute('data-visitor-id', vis.id);
    
    // Pulse circle
    const pulseCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    pulseCircle.setAttribute('cx', coords.x);
    pulseCircle.setAttribute('cy', coords.y);
    pulseCircle.setAttribute('r', '8');
    pulseCircle.setAttribute('fill', 'none');
    pulseCircle.setAttribute('stroke', 'var(--color-primary)');
    pulseCircle.setAttribute('stroke-width', '1.5');
    pulseCircle.setAttribute('class', 'map-pin-pulse');
    
    // Center point
    const centerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    centerCircle.setAttribute('cx', coords.x);
    centerCircle.setAttribute('cy', coords.y);
    centerCircle.setAttribute('r', '4.5');
    centerCircle.setAttribute('fill', 'var(--color-primary)');
    centerCircle.setAttribute('filter', 'url(#glow-effect)');
    
    pinG.appendChild(pulseCircle);
    pinG.appendChild(centerCircle);
    pinsLayer.appendChild(pinG);

    // Hover/Click interactivity on pins
    pinG.addEventListener('click', () => {
      highlightVisitor(vis.id);
      showLiveToast(`📍 Inspecting session: Visitor from <strong>${vis.city}, ${vis.country}</strong>`);
    });

    // 2. Render List Item card
    const isCheckout = vis.path === '/checkout';
    const pathClass = isCheckout ? 'badge-success' : (vis.path === '/cart' ? 'badge-warning' : 'badge-info');

    const item = document.createElement('div');
    item.className = 'visitor-item-card';
    item.setAttribute('id', `vis-card-${vis.id}`);
    item.innerHTML = `
      <div class="visitor-item-info">
        <span class="visitor-item-ip">
          <span style="font-size: 11px;">🌍</span>
          <span>${vis.city}, ${vis.country}</span>
        </span>
        <span class="visitor-item-country">IP: ${vis.ip} &bull; ${vis.browser}</span>
        <span class="visitor-item-path badge ${pathClass}">${vis.path}</span>
      </div>
      <div class="visitor-item-actions">
        <button class="btn btn-primary btn-takeover" data-vis-id="${vis.id}" style="padding: 6px 12px; font-size: 12px; border-radius: 6px;">
          Assist
        </button>
      </div>
    `;

    listContainer.appendChild(item);

    // Click item handler
    item.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-takeover')) return; // handled separately
      highlightVisitor(vis.id);
    });
  });

  // Attach Takeover listeners
  const takeoverBtns = listContainer.querySelectorAll('.btn-takeover');
  takeoverBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const visId = btn.getAttribute('data-vis-id');
      takeoverVisitorSession(visId);
    });
  });
}

function highlightVisitor(visId) {
  // Reset border colors in list
  const cards = document.querySelectorAll('.visitor-item-card');
  cards.forEach(c => c.style.borderColor = 'var(--border-color)');

  // Highlight active card
  const activeCard = document.getElementById(`vis-card-${visId}`);
  if (activeCard) {
    activeCard.style.borderColor = 'var(--color-primary)';
    activeCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Highlight active pin on Map (by changing stroke width/color)
  const pins = document.querySelectorAll('.map-pin');
  pins.forEach(pin => {
    const center = pin.querySelector('circle:last-child');
    if (center) center.setAttribute('fill', 'var(--color-primary)');
  });

  const activePin = document.querySelector(`.map-pin[data-visitor-id="${visId}"]`);
  if (activePin) {
    const center = activePin.querySelector('circle:last-child');
    if (center) center.setAttribute('fill', 'var(--color-secondary)');
  }
}

// Crisp takeover action
function takeoverVisitorSession(visId) {
  const visitor = state.visitors.find(v => v.id === visId);
  if (!visitor) return;

  // Check if conversation already exists for this visitor IP
  let chat = state.chats.find(c => c.ip === visitor.ip);
  if (!chat) {
    // Generate new active chat
    const chatId = `chat-takeover-${Date.now()}`;
    chat = {
      id: chatId,
      name: `Guest Visitor #${visitor.ip.split('.').pop()}`,
      email: "guest@live-tracking.com",
      channel: "widget",
      location: `${visitor.city}, ${visitor.country}`,
      ip: visitor.ip,
      browser: visitor.browser,
      lastMessageTime: "Just now",
      messages: [
        { sender: "agent", text: "Hello! I am John from Support. I noticed you are browsing our catalog. How can I help you today?", time: "Just now" }
      ],
      unread: false,
      status: "active",
      orderId: null
    };

    state.chats.unshift(chat);
  }

  // Direct to Inbox view and select chat
  state.selectedChatId = chat.id;
  state.activeView = 'inbox';
  saveCurrentBusinessState();

  // Toggle active styling in sidebar nav
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(nav => {
    nav.classList.remove('active');
    if (nav.getAttribute('data-view') === 'inbox') {
      nav.classList.add('active');
    }
  });

  showLiveToast(`🤝 Support takeover initiated with visitor from <strong>${visitor.city}</strong>`);
  renderActiveView();
}
