// Omnigent Business Analytics Dashboard Module
import { state } from '../app.js';

export function renderAnalyticsView(container) {
  container.innerHTML = `
    <!-- Analytical Summary Metrics -->
    <div class="dashboard-grid">
      <div class="card">
        <div class="card-title">Average Response Time</div>
        <div class="card-value">42 sec</div>
        <div class="card-subtext"><span class="trend-up">▼ 8.4% faster</span> vs last week</div>
      </div>
      
      <div class="card">
        <div class="card-title">First Contact Resolution</div>
        <div class="card-value">88.5%</div>
        <div class="card-subtext"><span class="trend-up">▲ 1.2%</span> from agent tools</div>
      </div>

      <div class="card">
        <div class="card-title">Omni-Channel Tickets</div>
        <div class="card-value">1,482</div>
        <div class="card-subtext"><span class="trend-up">▲ 320</span> new connections</div>
      </div>

      <div class="card">
        <div class="card-title">Customer Satisfaction (CSAT)</div>
        <div class="card-value">4.85 / 5.0</div>
        <div class="card-subtext"><span class="trend-up">▲ 0.05</span> rating score</div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="live-dashboard-layout" style="grid-template-columns: 1fr 1fr; margin-bottom: 24px;">
      <!-- Chart 1: Bar Chart of Satisfaction by Channel -->
      <div class="card">
        <h3 style="margin-bottom: 20px; font-weight: 600; font-size: 16px;">Average Customer Rating by channel</h3>
        
        <div style="height: 240px; display: flex; align-items: flex-end; justify-content: space-around; padding-bottom: 20px; position: relative;">
          <!-- SVG Bar Chart -->
          <svg viewBox="0 0 400 200" style="width: 100%; height: 100%; overflow: visible;">
            <!-- Grid Lines -->
            <line x1="0" y1="40" x2="400" y2="40" stroke="var(--border-color)" stroke-width="0.5" stroke-dasharray="4"/>
            <line x1="0" y1="80" x2="400" y2="80" stroke="var(--border-color)" stroke-width="0.5" stroke-dasharray="4"/>
            <line x1="0" y1="120" x2="400" y2="120" stroke="var(--border-color)" stroke-width="0.5" stroke-dasharray="4"/>
            <line x1="0" y1="160" x2="400" y2="160" stroke="var(--border-color)" stroke-width="0.5"/>

            <!-- Bar 1 (WhatsApp) -->
            <rect x="40" y="50" width="36" height="110" fill="url(#grad-whatsapp)" rx="6" class="chart-bar-rect"/>
            <!-- Bar 2 (Messenger) -->
            <rect x="130" y="70" width="36" height="90" fill="url(#grad-messenger)" rx="6" class="chart-bar-rect"/>
            <!-- Bar 3 (Instagram) -->
            <rect x="220" y="60" width="36" height="100" fill="url(#grad-instagram)" rx="6" class="chart-bar-rect"/>
            <!-- Bar 4 (Web SDK) -->
            <rect x="310" y="42" width="36" height="118" fill="url(#grad-widget)" rx="6" class="chart-bar-rect"/>

            <!-- Labels -->
            <text x="58" y="180" text-anchor="middle" fill="var(--text-secondary)" font-size="11">WhatsApp</text>
            <text x="148" y="180" text-anchor="middle" fill="var(--text-secondary)" font-size="11">Messenger</text>
            <text x="238" y="180" text-anchor="middle" fill="var(--text-secondary)" font-size="11">Instagram</text>
            <text x="328" y="180" text-anchor="middle" fill="var(--text-secondary)" font-size="11">Web SDK</text>

            <text x="58" y="40" text-anchor="middle" fill="#fff" font-size="10" font-weight="600">4.8</text>
            <text x="148" y="60" text-anchor="middle" fill="#fff" font-size="10" font-weight="600">4.5</text>
            <text x="238" y="50" text-anchor="middle" fill="#fff" font-size="10" font-weight="600">4.6</text>
            <text x="328" y="32" text-anchor="middle" fill="#fff" font-size="10" font-weight="600">4.9</text>

            <!-- Gradients declarations -->
            <defs>
              <linearGradient id="grad-whatsapp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#10b981"/><stop offset="100%" stop-color="#047854"/>
              </linearGradient>
              <linearGradient id="grad-messenger" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#1d4ed8"/>
              </linearGradient>
              <linearGradient id="grad-instagram" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#d946ef"/><stop offset="100%" stop-color="#a21caf"/>
              </linearGradient>
              <linearGradient id="grad-widget" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#6366f1"/><stop offset="100%" stop-color="#4338ca"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <!-- Chart 2: Channel Volume Distribution -->
      <div class="card" style="display: flex; flex-direction: column;">
        <h3 style="margin-bottom: 20px; font-weight: 600; font-size: 16px;">Channel Ticket distribution</h3>
        
        <div style="flex-grow:1; display: flex; align-items: center; justify-content: center; gap: 24px;">
          <!-- Custom SVG Doughnut Chart -->
          <svg width="150" height="150" viewBox="0 0 42 42" style="transform: rotate(-90deg);">
            <!-- Base grey circle -->
            <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--bg-hover)" stroke-width="4.5"></circle>
            
            <!-- Widget (50%) -->
            <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--color-primary)" stroke-width="4.5" stroke-dasharray="50 50" stroke-dashoffset="0"></circle>
            <!-- WhatsApp (25%) -->
            <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--color-success)" stroke-width="4.5" stroke-dasharray="25 75" stroke-dashoffset="-50"></circle>
            <!-- Messenger (15%) -->
            <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#3b82f6" stroke-width="4.5" stroke-dasharray="15 85" stroke-dashoffset="-75"></circle>
            <!-- Instagram (10%) -->
            <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#d946ef" stroke-width="4.5" stroke-dasharray="10 90" stroke-dashoffset="-90"></circle>
          </svg>

          <!-- Doughnut Legend labels -->
          <div style="display: flex; flex-direction: column; gap: 8px; font-size: 12px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="width: 10px; height: 10px; border-radius: 50%; background-color: var(--color-primary); display: inline-block;"></span>
              <span style="color: var(--text-secondary);">Web SDK (50%)</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="width: 10px; height: 10px; border-radius: 50%; background-color: var(--color-success); display: inline-block;"></span>
              <span style="color: var(--text-secondary);">WhatsApp (25%)</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="width: 10px; height: 10px; border-radius: 50%; background-color: #3b82f6; display: inline-block;"></span>
              <span style="color: var(--text-secondary);">Messenger (15%)</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="width: 10px; height: 10px; border-radius: 50%; background-color: #d946ef; display: inline-block;"></span>
              <span style="color: var(--text-secondary);">Instagram (10%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Agent Leaderboard -->
    <div class="card">
      <h3 style="margin-bottom: 16px; font-weight: 600; font-size: 16px;">Agent Performance Leaderboard</h3>
      <table class="orders-table">
        <thead>
          <tr>
            <th>Agent Name</th>
            <th>Role</th>
            <th>Chats Handled</th>
            <th>Avg Resolution Time</th>
            <th>CSAT Rating</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="font-weight: 600;">Sarah Connor</td>
            <td style="color: var(--text-secondary);">Tier 1 Support Agent</td>
            <td>412</td>
            <td>1m 12s</td>
            <td style="color: var(--color-success); font-weight: 600;">4.92 / 5.0</td>
            <td><span class="badge badge-success">Online</span></td>
          </tr>
          <tr>
            <td style="font-weight: 600;">Marcus Aurelius</td>
            <td style="color: var(--text-secondary);">Escalation Resolver</td>
            <td>182</td>
            <td>4m 45s</td>
            <td style="color: var(--color-success); font-weight: 600;">4.88 / 5.0</td>
            <td><span class="badge badge-success">Online</span></td>
          </tr>
          <tr>
            <td style="font-weight: 600;">AI Agent Copilot</td>
            <td style="color: var(--text-secondary);">Automated Bot Router</td>
            <td>854</td>
            <td>12s</td>
            <td style="color: var(--color-success); font-weight: 600;">4.81 / 5.0</td>
            <td><span class="badge badge-info">AI Active</span></td>
          </tr>
          <tr>
            <td style="font-weight: 600;">Leonidas Sparta</td>
            <td style="color: var(--text-secondary);">Fulfillment Logistics</td>
            <td>224</td>
            <td>2m 30s</td>
            <td style="color: var(--color-warning); font-weight: 600;">4.65 / 5.0</td>
            <td><span class="badge badge-warning">Away</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

export function initAnalytics() {
  // Static content, no complex interactions needed
}
