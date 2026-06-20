// Omnigent Dashboard View Renderer
import { state } from '../app.js';

export function renderDashboardView(container) {
  // Compute analytics
  const activeChats = state.chats.length;
  const activeVisitors = state.visitors.length;
  const resolutionPct = state.analytics.resolvedChats / state.analytics.chatsCount * 100;
  
  container.innerHTML = `
    <!-- Top Stats Cards -->
    <div class="dashboard-grid">
      <div class="card card-gradient">
        <div class="card-title">
          <span>Active Chats</span>
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
        <div class="card-value">${activeChats}</div>
        <div class="card-subtext">
          <span class="trend-up">▲ 12%</span>
          <span>from yesterday</span>
        </div>
      </div>

      <div class="card card-gradient" style="--gradient-primary: linear-gradient(135deg, #10b981, #059669)">
        <div class="card-title">
          <span>Resolution Rate</span>
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
            <polyline points="16 7 22 7 22 13"></polyline>
          </svg>
        </div>
        <div class="card-value">${resolutionPct.toFixed(1)}%</div>
        <div class="card-subtext">
          <span class="trend-up">▲ 0.8%</span>
          <span>automated by AI</span>
        </div>
      </div>

      <div class="card card-gradient" style="--gradient-primary: linear-gradient(135deg, #06b6d4, #0891b2)">
        <div class="card-title">
          <span>Live Site Visitors</span>
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <div class="card-value" id="dash-live-visitors">${activeVisitors}</div>
        <div class="card-subtext">
          <span class="pulse-dot"></span>
          <span>Browsing catalog live</span>
        </div>
      </div>

      <div class="card card-gradient" style="--gradient-primary: linear-gradient(135deg, #f59e0b, #d97706)">
        <div class="card-title">
          <span>Revenue Today</span>
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
        </div>
        <div class="card-value">$${state.analytics.totalSales}</div>
        <div class="card-subtext">
          <span class="trend-up">▲ $1,240</span>
          <span>since midnight</span>
        </div>
      </div>
    </div>

    <!-- Main Grid: Charts & Activity Feed -->
    <div class="live-dashboard-layout" style="grid-template-columns: 1.6fr 1fr;">
      <!-- Message Volume Chart -->
      <div class="card">
        <h3 style="margin-bottom: 20px; font-weight: 600; font-size: 16px;">Weekly Message Volume & AI Assistance</h3>
        
        <div style="height: 280px; display: flex; align-items: flex-end; justify-content: center; position: relative;">
          <!-- SVG Premium Curve Line Chart -->
          <svg viewBox="0 0 500 250" class="world-map-svg" style="overflow: visible; width: 100%; height: 100%;">
            <defs>
              <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="var(--color-primary)" stop-opacity="0.3"/>
                <stop offset="100%" stop-color="var(--color-primary)" stop-opacity="0.0"/>
              </linearGradient>
              <linearGradient id="chart-glow-ai" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="var(--color-secondary)" stop-opacity="0.2"/>
                <stop offset="100%" stop-color="var(--color-secondary)" stop-opacity="0.0"/>
              </linearGradient>
            </defs>
            
            <!-- Grid Lines -->
            <line x1="0" y1="50" x2="500" y2="50" stroke="var(--border-color)" stroke-width="1" stroke-dasharray="4"/>
            <line x1="0" y1="110" x2="500" y2="110" stroke="var(--border-color)" stroke-width="1" stroke-dasharray="4"/>
            <line x1="0" y1="170" x2="500" y2="170" stroke="var(--border-color)" stroke-width="1" stroke-dasharray="4"/>
            <line x1="0" y1="230" x2="500" y2="230" stroke="var(--border-color)" stroke-width="1"/>
            
            <!-- Chart Area Shadows -->
            <path d="M 0 230 Q 80 120 160 140 T 320 80 T 480 60 L 500 60 L 500 230 Z" fill="url(#chart-glow)"/>
            <path d="M 0 230 Q 80 190 160 170 T 320 150 T 480 110 L 500 110 L 500 230 Z" fill="url(#chart-glow-ai)"/>

            <!-- Chart Lines -->
            <path d="M 0 230 Q 80 120 160 140 T 320 80 T 480 60" fill="none" stroke="var(--color-primary)" stroke-width="3" class="chart-path"/>
            <path d="M 0 230 Q 80 190 160 170 T 320 150 T 480 110" fill="none" stroke="var(--color-secondary)" stroke-width="2" stroke-dasharray="2" class="chart-path"/>
            
            <!-- Nodes -->
            <circle cx="160" cy="140" r="5" fill="#fff" stroke="var(--color-primary)" stroke-width="3"/>
            <circle cx="320" cy="80" r="5" fill="#fff" stroke="var(--color-primary)" stroke-width="3"/>
            <circle cx="480" cy="60" r="5" fill="#fff" stroke="var(--color-primary)" stroke-width="3"/>
            
            <circle cx="160" cy="170" r="4" fill="#fff" stroke="var(--color-secondary)" stroke-width="2"/>
            <circle cx="320" cy="150" r="4" fill="#fff" stroke="var(--color-secondary)" stroke-width="2"/>
            <circle cx="480" cy="110" r="4" fill="#fff" stroke="var(--color-secondary)" stroke-width="2"/>

            <!-- Axis Labels -->
            <text x="0" y="245" fill="var(--text-muted)" font-size="10">Mon</text>
            <text x="80" y="245" fill="var(--text-muted)" font-size="10">Tue</text>
            <text x="160" y="245" fill="var(--text-muted)" font-size="10">Wed</text>
            <text x="240" y="245" fill="var(--text-muted)" font-size="10">Thu</text>
            <text x="320" y="245" fill="var(--text-muted)" font-size="10">Fri</text>
            <text x="400" y="245" fill="var(--text-muted)" font-size="10">Sat</text>
            <text x="480" y="245" fill="var(--text-muted)" font-size="10">Sun</text>
          </svg>
        </div>

        <div style="display: flex; gap: 20px; justify-content: center; margin-top: 15px; font-size: 12px;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="width: 12px; height: 3px; background-color: var(--color-primary); display: inline-block;"></span>
            <span style="color: var(--text-secondary);">Total Messages (Omni-channel)</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="width: 12px; height: 3px; background-color: var(--color-secondary); display: inline-block; border-bottom: 2px dashed var(--color-secondary)"></span>
            <span style="color: var(--text-secondary);">AI Handled Responses</span>
          </div>
        </div>
      </div>

      <!-- Live Event Ticker -->
      <div class="card" style="display: flex; flex-direction: column;">
        <h3 style="margin-bottom: 16px; font-weight: 600; font-size: 16px; display: flex; align-items: center; justify-content: space-between;">
          <span>Live Activity Feed</span>
          <span class="badge badge-success" style="font-size: 9px;">SIMULATOR RUNNING</span>
        </h3>
        
        <div style="flex-grow: 1; display: flex; flex-direction: column; gap: 12px; overflow-y: auto; max-height: 280px;" id="dash-activity-list">
          <!-- Populated dynamically -->
          <div style="display: flex; align-items: start; gap: 10px; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.03); padding-bottom: 8px;">
            <span style="color: var(--color-success)">🟢</span>
            <div>
              <span style="color: var(--text-primary); font-weight: 500;">Active Tracker launched</span>
              <p style="color: var(--text-muted); font-size: 11px;">Just now &bull; Global Web SDK</p>
            </div>
          </div>
          <div style="display: flex; align-items: start; gap: 10px; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.03); padding-bottom: 8px;">
            <span style="color: var(--color-primary)">🤖</span>
            <div>
              <span style="color: var(--text-primary); font-weight: 500;">AI Persona synced</span>
              <p style="color: var(--text-muted); font-size: 11px;">Just now &bull; Model: Gemini 3.5 Flash</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Populate dynamic elements in the activity feed from our state variables
  const activityList = document.getElementById('dash-activity-list');
  if (activityList && state.chats.length > 0) {
    // Generate feed items based on conversations
    const itemsHTML = state.chats.map(chat => {
      let icon = "💬";
      if (chat.channel === "whatsapp") icon = "🟢";
      if (chat.channel === "messenger") icon = "🔵";
      if (chat.channel === "instagram") icon = "🟣";
      
      const lastMsg = chat.messages[chat.messages.length - 1];
      return `
        <div style="display: flex; align-items: start; gap: 10px; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.03); padding-bottom: 8px;">
          <span style="font-size: 14px;">${icon}</span>
          <div>
            <span style="color: var(--text-primary); font-weight: 500;">${chat.name}</span>
            <span style="color: var(--text-secondary);">(${chat.channel}) sent a message:</span>
            <p style="color: var(--text-muted); font-style: italic; margin-top: 2px;">"${lastMsg.text.substring(0, 50)}${lastMsg.text.length > 50 ? '...' : ''}"</p>
            <p style="color: var(--text-muted); font-size: 11px; margin-top: 2px;">${chat.lastMessageTime} &bull; ${chat.location}</p>
          </div>
        </div>
      `;
    }).join("");
    
    activityList.innerHTML = itemsHTML + activityList.innerHTML;
  }
}
