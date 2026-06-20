// Omnigent Web SDK & Widget Simulator Page
import { state, showLiveToast } from '../app.js';

export function renderWidgetSDKView(container) {
  const currentOrigin = window.location.origin || 'http://localhost:5500';
  const apiKey = `omni_live_${state.businessId || 'demo'}`;
  const brandColor = state.primaryColor || '#0071e3';
  const embedCode = `<!-- Omnigent Web SDK Integrations Widget -->
<script>
  window.omnigentSettings = {
    apiKey: "${apiKey}",
    theme: "dark",
    primaryColor: "${brandColor}"
  };
</script>
<script src="${currentOrigin}/chat-widget.js" async></script>`;

  container.innerHTML = `
    <div class="sdk-preview-container">
      <!-- SDK Instructions (Left) -->
      <div class="card" style="display: flex; flex-direction: column; gap: 16px; min-height: 500px;">
        <h3 style="font-weight: 600; font-size: 16px;">Easy Web/App Integration</h3>
        <p style="font-size: 13px; color: var(--text-secondary);">
          Integrate the Omnigent live chat and AI assistant onto your website in less than 5 minutes. The widget is self-contained, so this single script snippet includes its runtime styling.
        </p>

        <div class="input-group">
          <label class="input-label">Embeddable Script Snippet</label>
          <div class="code-block-card">
            <button class="code-copy-btn" id="btn-copy-embed">Copy</button>
            <pre style="margin: 0; line-height: 1.4;"><code id="embed-code-text">${escapeHtml(embedCode)}</code></pre>
          </div>
        </div>

        <div class="input-group" style="margin-top: 10px;">
          <label class="input-label">API Key Credential</label>
          <input type="text" class="input-field" value="omni_live_${state.businessId || 'demo'}" readonly style="font-family: monospace; font-size: 12px; background-color: #0b101c;">
        </div>

        <div style="margin-top: auto; padding: 12px; background: rgba(9,15,30,0.4); border: 1px solid var(--border-color); border-radius: 8px;">
          <div style="font-size: 12px; font-weight: 600; color: #fff; margin-bottom: 4px;">💡 Quick Tip</div>
          <p style="font-size: 11px; color: var(--text-muted);">
            Once embedded, visitor locations, IP details, and browser paths will report live on the <strong>Live Tracking</strong> dashboard automatically.
          </p>
        </div>
      </div>

      <!-- Live Web Storefront Simulator (Right) -->
      <div class="card" style="display: flex; flex-direction: column; padding: 0; height: 500px; overflow: hidden; border-color: rgba(99,102,241,0.25);">
        <!-- Browser Bar header -->
        <div style="height: 38px; background-color: var(--bg-hover); border-bottom: 1px solid var(--border-color); display: flex; align-items: center; padding: 0 16px; gap: 8px; flex-shrink: 0;">
          <span style="display: flex; gap: 4px;">
            <span style="width: 8px; height: 8px; border-radius: 50%; background-color: var(--color-danger); display: inline-block;"></span>
            <span style="width: 8px; height: 8px; border-radius: 50%; background-color: var(--color-warning); display: inline-block;"></span>
            <span style="width: 8px; height: 8px; border-radius: 50%; background-color: var(--color-success); display: inline-block;"></span>
          </span>
          <div style="background-color: var(--bg-input); font-size: 11px; color: var(--text-secondary); padding: 2px 16px; border-radius: 4px; flex-grow: 1; text-align: center; font-family: monospace;">
            my-storefront.com/demo
          </div>
        </div>

        <!-- Store Page Contents (Loads Simulator Sandbox UI with the embedded chat widget) -->
        <div style="flex-grow: 1; position: relative; background-color: #f8fafc; color: #1e293b; overflow: hidden;">
          <!-- Storefront Mock Content -->
          <iframe id="demo-widget-iframe" src="about:blank" style="width: 100%; height: 100%; border: none;"></iframe>
        </div>
      </div>
    </div>
  `;

  // Initialize the iframe contents with a custom HTML and script injection of the chat-widget
  initStorefrontIframe();

  // Copy handler
  const copyBtn = document.getElementById('btn-copy-embed');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(embedCode).then(() => {
        showLiveToast("📋 Embed script copied to clipboard!");
      }).catch(() => {
        // Fallback copy
        const textRange = document.createRange();
        textRange.selectNode(document.getElementById('embed-code-text'));
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(textRange);
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
        showLiveToast("📋 Embed script copied to clipboard!");
      });
    });
  }
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function initStorefrontIframe() {
  const iframe = document.getElementById('demo-widget-iframe');
  if (!iframe) return;

  const iframeContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          margin: 0;
          padding: 24px;
          background-color: #f1f5f9;
          color: #0f172a;
          height: 100vh;
          box-sizing: border-box;
          overflow: hidden;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 12px;
          margin-bottom: 20px;
        }
        .logo {
          font-weight: 800;
          font-size: 18px;
          color: #6366f1;
        }
        .nav-links {
          display: flex;
          gap: 16px;
          font-size: 13px;
          font-weight: 500;
          color: #475569;
        }
        .grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 20px;
        }
        .product-img {
          width: 100%;
          height: 140px;
          background-color: #e2e8f0;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
        }
        .product-title {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .product-price {
          font-size: 18px;
          font-weight: 600;
          color: #6366f1;
          margin-bottom: 12px;
        }
        .btn-buy {
          background-color: #0f172a;
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
        }
        .btn-buy:hover {
          background-color: #1e293b;
        }
        #omnigent-chat-window {
          height: 320px !important;
          bottom: 70px !important;
        }
      </style>
      <!-- Inject Widget Styles -->
      <link rel="stylesheet" href="chat-widget.css">
    </head>
    <body>
      <div class="header">
        <span class="logo">📦 ${state.businessName || 'TechStore'}</span>
        <div class="nav-links">
          <span>Home</span>
          <span>Catalog</span>
          <span>Contact</span>
        </div>
      </div>

      <div class="grid">
        <div class="product-img">🎧</div>
        <div>
          <div class="product-title">Premium Wireless Headset</div>
          <div class="product-price">$129.99</div>
          <p style="font-size: 12px; color: #64748b; line-height: 1.4; margin-bottom: 12px;">
            Acoustic sound profile with active cancellation filters and 30-hour playback duration.
          </p>
          <button class="btn-buy" onclick="alert('Added to Cart!')">Add to Cart</button>
        </div>
      </div>

      <!-- Inject Chat Widget SDK Scripts -->
      <script>
        window.omnigentSettings = {
          apiKey: "omni_live_${state.businessId || 'demo'}",
          theme: "dark",
          primaryColor: "${state.primaryColor || '#0071e3'}",
          businessName: "${state.businessName || 'TechStore'}",
          persona: "${state.aiConfig.persona || 'Store Support Copilot'}"
        };
      </script>
      <script src="chat-widget.js"></script>
    </body>
    </html>
  `;

  // Write content to iframe document
  iframe.contentWindow.document.open();
  iframe.contentWindow.document.write(iframeContent);
  iframe.contentWindow.document.close();
}
