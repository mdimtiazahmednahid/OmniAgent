// Omnigent AI Configurator Module
import { state, showLiveToast, saveCurrentBusinessState } from '../app.js';

export function renderAIAgentView(container) {
  container.innerHTML = `
    <div class="live-dashboard-layout" style="grid-template-columns: 1.1fr 1fr;">
      <!-- Parameter Config Card (Left) -->
      <div class="card" style="display: flex; flex-direction: column; gap: 16px;">
        <h3 style="font-weight: 600; font-size: 16px;">AI Agent Prompt Tuning</h3>
        
        <div class="input-group">
          <label class="input-label">System Instructions / Prompt</label>
          <textarea class="textarea-field" id="ai-system-prompt" rows="5" style="resize: none;">${state.aiConfig.systemPrompt}</textarea>
          <span style="font-size: 11px; color: var(--text-muted);">This dictates the behavior, rules, constraints, and tone of the AI agent responses.</span>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div class="input-group">
            <label class="input-label">Model Selection</label>
            <select class="select-field" id="ai-model-select">
              <option value="gemini-flash" selected>Gemini 3.5 Flash (Medium)</option>
              <option value="gemini-pro">Gemini 3.5 Pro (Ultra-heavy)</option>
              <option value="custom-tuned">Llama-3-Omni-Tuned (Local)</option>
            </select>
          </div>

          <div class="input-group">
            <label class="input-label">Agent Persona</label>
            <select class="select-field" id="ai-persona-select">
              <option value="Helpful Guide" ${state.aiConfig.persona === 'Helpful Guide' ? 'selected' : ''}>Helpful E-commerce Guide</option>
              <option value="Friendly Assistant" ${state.aiConfig.persona === 'Friendly Assistant' ? 'selected' : ''}>Friendly Sales Representative</option>
              <option value="Tech Resolver" ${state.aiConfig.persona === 'Tech Resolver' ? 'selected' : ''}>Strict Technical Support</option>
            </select>
          </div>
        </div>

        <div class="input-group">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <label class="input-label">Response Creativity (Temperature)</label>
            <span id="temp-value" style="font-size: 12px; font-weight: 600; color: var(--color-primary);">${state.aiConfig.temperature}</span>
          </div>
          <input type="range" class="slider" id="ai-temp-slider" min="0.1" max="1.0" step="0.1" value="${state.aiConfig.temperature}" style="margin-top: 8px; accent-color: var(--color-primary);">
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); border-radius: 8px; margin-top: 8px;">
          <div>
            <div style="font-size: 13px; font-weight: 600;">Enable Automatic AI Reply</div>
            <div style="font-size: 11px; color: var(--text-muted);">AI answers incoming chats on WhatsApp, FB, and SDK.</div>
          </div>
          <input type="checkbox" id="ai-autoreply-toggle" ${state.aiConfig.autoReply ? 'checked' : ''} style="width: 20px; height: 20px; accent-color: var(--color-primary); cursor: pointer;">
        </div>

        <button class="btn btn-primary" id="btn-save-ai-config" style="margin-top: 10px; width: 100%;">
          💾 Save Instructions & Hot Reload
        </button>
      </div>

      <!-- Live Sandbox Playground (Right) -->
      <div class="card" style="display: flex; flex-direction: column; height: 480px;">
        <h3 style="margin-bottom: 12px; font-weight: 600; font-size: 16px;">AI Prompt Sandbox</h3>
        
        <!-- Chat Area -->
        <div class="chat-messages" id="sandbox-messages-container" style="flex-grow: 1; border: 1px solid var(--border-color); border-radius: 8px; background-color: #0b101c; margin-bottom: 16px; min-height: 200px;">
          <div class="message-bubble incoming">
            <div class="message-content">🤖 System initialized. I am configured with the selected prompt instructions. Ask me anything to test my tone!</div>
            <span class="message-meta">System</span>
          </div>
        </div>

        <!-- Input Area -->
        <div style="display: flex; gap: 10px; align-items: center;">
          <input type="text" class="chat-textbox" id="sandbox-textbox" placeholder="Ask AI a test question..." style="flex-grow: 1;">
          <button class="btn btn-primary" id="btn-sandbox-send" style="padding: 10px 18px;">Test</button>
        </div>
      </div>
    </div>
  `;
}

// Sandbox local messages state (stays persistent during config toggle session)
let sandboxMessages = [
  { sender: 'agent', text: '🤖 System initialized. I am configured with the selected prompt instructions. Ask me anything to test my tone!', time: 'System' }
];

export function initAIAgent() {
  const saveBtn = document.getElementById('btn-save-ai-config');
  const tempSlider = document.getElementById('ai-temp-slider');
  const tempVal = document.getElementById('temp-value');
  const autoToggle = document.getElementById('ai-autoreply-toggle');
  
  if (tempSlider && tempVal) {
    tempSlider.addEventListener('input', (e) => {
      tempVal.textContent = e.target.value;
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const prompt = document.getElementById('ai-system-prompt').value;
      const model = document.getElementById('ai-model-select').value;
      const persona = document.getElementById('ai-persona-select').value;
      const temp = parseFloat(tempSlider.value);
      const autoReply = autoToggle.checked;

      state.aiConfig.systemPrompt = prompt;
      state.aiConfig.persona = persona;
      state.aiConfig.temperature = temp;
      state.aiConfig.autoReply = autoReply;

      saveCurrentBusinessState();
      showLiveToast(`🚀 AI instructions saved! Tuned to <strong>${persona}</strong> style.`);
    });
  }

  // Sandbox functionality
  const sandboxMessagesContainer = document.getElementById('sandbox-messages-container');
  const sandboxTextbox = document.getElementById('sandbox-textbox');
  const sandboxSendBtn = document.getElementById('btn-sandbox-send');

  const renderSandboxMessages = () => {
    if (!sandboxMessagesContainer) return;
    sandboxMessagesContainer.innerHTML = sandboxMessages.map(m => {
      const isAgent = m.sender === 'agent';
      return `
        <div class="message-bubble ${isAgent ? 'incoming' : 'outgoing'}">
          <div class="message-content">${m.text}</div>
          <span class="message-meta">${m.time}</span>
        </div>
      `;
    }).join("");
    sandboxMessagesContainer.scrollTop = sandboxMessagesContainer.scrollHeight;
  };

  const handleSandboxSend = () => {
    if (!sandboxTextbox || !sandboxTextbox.value.trim()) return;
    const text = sandboxTextbox.value.trim();
    sandboxTextbox.value = '';

    // Push user message
    sandboxMessages.push({ sender: 'user', text: text, time: 'You' });
    renderSandboxMessages();

    // Push loading typing bubble
    const typingBubble = { sender: 'agent', text: '...', time: 'Thinking...' };
    sandboxMessages.push(typingBubble);
    setTimeout(() => {
      renderSandboxMessages();
    }, 200);

    // AI logic reply simulation
    setTimeout(() => {
      let replyText = "";
      const persona = document.getElementById('ai-persona-select')?.value || state.aiConfig.persona;
      const customPrompt = document.getElementById('ai-system-prompt')?.value || state.aiConfig.systemPrompt;

      if (text.toLowerCase().includes("hello") || text.toLowerCase().includes("hi")) {
        replyText = `Hello! Under the custom system instruction persona (${persona}), I welcome you. How may I guide you on our platform?`;
      } else if (text.toLowerCase().includes("pricing") || text.toLowerCase().includes("cost")) {
        replyText = `Regarding prices: Under the rules of [${persona}], I can inform you that our entry-level tier starts at $19/month, offering WhatsApp integration out-of-the-box.`;
      } else {
        replyText = `I have received your request: "${text}". As a ${persona}, my prompt instruction guidelines guide me to respond with professional e-commerce feedback. Please let me know how I can support order status lookup!`;
      }

      // Stream text effect inside sandbox
      let words = replyText.split(" ");
      let idx = 0;
      let buildText = "";
      
      const streamTimer = setInterval(() => {
        if (idx < words.length) {
          buildText += (idx === 0 ? "" : " ") + words[idx];
          typingBubble.text = buildText;
          idx++;
          renderSandboxMessages();
        } else {
          clearInterval(streamTimer);
          typingBubble.time = 'AI Agent';
          renderSandboxMessages();
        }
      }, 120);

    }, 1200);
  };

  if (sandboxTextbox) {
    sandboxTextbox.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSandboxSend();
    });
  }
  if (sandboxSendBtn) {
    sandboxSendBtn.addEventListener('click', handleSandboxSend);
  }

  // Initial render of sandbox chats
  renderSandboxMessages();
};
