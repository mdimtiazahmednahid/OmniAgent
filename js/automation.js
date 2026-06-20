// Omnigent Workflow Automation Builder View
import { state, showLiveToast, saveCurrentBusinessState } from '../app.js';

export function renderAutomationView(container) {
  container.innerHTML = `
    <!-- Top info row -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
      <div class="stat-pill" style="padding: 10px 16px;">
        <span>Rules status: <strong style="color: var(--color-success)">Active</strong> &bull; Total triggers: <strong>${state.automations.length}</strong></span>
      </div>
      <button class="btn btn-primary" id="btn-create-rule-trigger">➕ Add Automation Rule</button>
    </div>

    <!-- Visual Node Canvas Card -->
    <div class="card" style="margin-bottom: 32px; overflow: visible;">
      <h3 style="margin-bottom: 20px; font-weight: 600; font-size: 16px;">Live Visual Rule Flow: Cart Conversion Check</h3>
      
      <div class="workflow-canvas" id="workflow-canvas-viewport">
        <!-- SVG Node Connectors -->
        <svg style="position: absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; overflow:visible;">
          <!-- Left to Middle line -->
          <path d="M 195 200 C 290 200, 260 200, 350 200" class="workflow-connector-line active" />
          
          <!-- Middle to Right line -->
          <path d="M 545 200 C 620 200, 580 200, 650 200" class="workflow-connector-line active" />
        </svg>

        <!-- Node 1: Trigger -->
        <div class="workflow-node" style="border-color: var(--color-info);">
          <div class="workflow-node-header" style="color: var(--color-info);">
            <span>⚡ TRIGGER</span>
          </div>
          <div class="workflow-node-body">
            <strong>Page Visit</strong>
            <p style="font-size: 11px; margin-top: 4px; color: var(--text-muted);">User navigates path to <code>/checkout</code></p>
          </div>
        </div>

        <!-- Node 2: Logic Condition -->
        <div class="workflow-node" style="border-color: var(--color-warning);">
          <div class="workflow-node-header" style="color: var(--color-warning);">
            <span>⚖️ CONDITION</span>
          </div>
          <div class="workflow-node-body">
            <strong>Time Threshold</strong>
            <p style="font-size: 11px; margin-top: 4px; color: var(--text-muted);">Session remains active > 30 seconds</p>
          </div>
        </div>

        <!-- Node 3: Action -->
        <div class="workflow-node" style="border-color: var(--color-primary); width: 220px;">
          <div class="workflow-node-header" style="color: var(--color-primary);">
            <span>⚙️ OUTCOME ACTION</span>
          </div>
          <div class="workflow-node-body">
            <strong>AI Outreach Message</strong>
            <p style="font-size: 11px; margin-top: 4px; color: var(--text-muted);">AI initiates checkout assistant dialog flow</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Rules List -->
    <div class="card">
      <h3 style="margin-bottom: 20px; font-weight: 600; font-size: 16px;">Configured Workflow Rules</h3>
      <div style="display: flex; flex-direction: column; gap: 16px;" id="automation-rules-list">
        <!-- Rendered dynamically -->
      </div>
    </div>

    <!-- Create Rule Modal -->
    <div id="create-rule-modal" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); z-index: 2000; align-items: center; justify-content: center;">
      <div class="card" style="width: 450px; background-color: var(--bg-surface); padding: 32px; border-radius: 12px; box-shadow: var(--shadow-lg);">
        <h3 style="margin-bottom: 20px; font-weight: 600;">Add Automation Rule</h3>
        
        <div class="input-group">
          <label class="input-label">Rule Reference Title</label>
          <input type="text" class="input-field" id="new-rule-name" placeholder="Checkout Assistance">
        </div>

        <div class="input-group">
          <label class="input-label">Trigger Rule</label>
          <input type="text" class="input-field" id="new-rule-trigger" placeholder="Customer spends > 1 min on pricing page">
        </div>

        <div class="input-group">
          <label class="input-label">Action Outcome</label>
          <input type="text" class="input-field" id="new-rule-action" placeholder="Dispatch welcome promo badge text">
        </div>

        <div style="display: flex; gap: 16px; margin-top: 24px; justify-content: flex-end;">
          <button class="btn" id="btn-close-rule-modal">Cancel</button>
          <button class="btn btn-primary" id="btn-submit-rule-form">Add Rule</button>
        </div>
      </div>
    </div>
  `;
}

export function initAutomation() {
  renderRulesList();

  const trigger = document.getElementById('btn-create-rule-trigger');
  const modal = document.getElementById('create-rule-modal');
  const closeBtn = document.getElementById('btn-close-rule-modal');
  const submitBtn = document.getElementById('btn-submit-rule-form');

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
      const name = document.getElementById('new-rule-name').value.trim();
      const triggerRule = document.getElementById('new-rule-trigger').value.trim();
      const action = document.getElementById('new-rule-action').value.trim();

      if (!name || !triggerRule || !action) {
        showLiveToast("⚠️ All fields are required to formulate an automation rule.");
        return;
      }

      const newRule = {
        id: `auto-${Date.now()}`,
        name: name,
        trigger: triggerRule,
        action: action,
        active: true
      };

      state.automations.push(newRule);
      saveCurrentBusinessState();
      modal.style.display = 'none';
      showLiveToast(`🚀 Automation rule <strong>"${name}"</strong> created and compiled successfully.`);
      
      // Reset inputs & re-render
      document.getElementById('new-rule-name').value = '';
      document.getElementById('new-rule-trigger').value = '';
      document.getElementById('new-rule-action').value = '';
      
      renderRulesList();
    });
  }
}

function renderRulesList() {
  const container = document.getElementById('automation-rules-list');
  if (!container) return;

  container.innerHTML = state.automations.map(rule => {
    return `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 18px; border: 1px solid var(--border-color); border-radius: 10px; background-color: var(--bg-hover);">
        <div>
          <div style="font-weight: 600; font-size: 15px; color: #fff; display: flex; align-items: center; gap: 8px;">
            <span>🤖 ${rule.name}</span>
            <span class="badge ${rule.active ? 'badge-success' : 'badge-danger'}" style="font-size: 9px; padding: 1px 6px;">
              ${rule.active ? 'ACTIVE' : 'INACTIVE'}
            </span>
          </div>
          <div style="font-size: 13px; color: var(--text-secondary); margin-top: 6px;">
            <strong style="color: var(--color-info);">Trigger:</strong> ${rule.trigger}
          </div>
          <div style="font-size: 13px; color: var(--text-secondary); margin-top: 2px;">
            <strong style="color: var(--color-primary);">Action:</strong> ${rule.action}
          </div>
        </div>
        <div>
          <!-- Custom Switch Toggle -->
          <input type="checkbox" class="rule-toggle-switch" data-rule-id="${rule.id}" ${rule.active ? 'checked' : ''} style="width: 42px; height: 20px; cursor: pointer; accent-color: var(--color-primary);">
        </div>
      </div>
    `;
  }).join("");

  // Attach toggle listeners
  container.querySelectorAll('.rule-toggle-switch').forEach(toggle => {
    toggle.addEventListener('change', (e) => {
      const ruleId = toggle.getAttribute('data-rule-id');
      const rule = state.automations.find(r => r.id === ruleId);
      if (rule) {
        rule.active = toggle.checked;
        saveCurrentBusinessState();
        showLiveToast(`Rule <strong>"${rule.name}"</strong> is now ${rule.active ? 'Activated' : 'Suspended'}.`);
        renderRulesList();
      }
    });
  });
}
