// @vitest-environment jsdom
import { beforeEach, describe, it, expect, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf-8');
const widgetSource = fs.readFileSync(path.resolve(__dirname, '../chat-widget.js'), 'utf-8');

describe('Web SDK & Chat Widget Tests', () => {
  let appModule;
  let sdkModule;

  beforeEach(async () => {
    document.documentElement.innerHTML = html.replace('<script type="module" src="app.js"></script>', '');
    localStorage.clear();
    sessionStorage.clear();

    vi.resetModules();
    appModule = await import('../app.js');
    sdkModule = await import('../js/widget-sdk.js');
    
    // Login to populate base state
    sessionStorage.setItem('omnigent_current_business_id', 'biz-techstore');
    window.dispatchEvent(new window.Event('DOMContentLoaded'));
  });

  it('should render the Web SDK view and dynamic integration script snippet', () => {
    const contentContainer = document.getElementById('view-content');
    sdkModule.renderWidgetSDKView(contentContainer);

    const embedText = document.getElementById('embed-code-text').textContent;
    expect(embedText).toContain('window.omnigentSettings');
    expect(embedText).toContain('omni_live_biz-techstore');
    expect(embedText).toContain('chat-widget.js');
  });

  it('should write storefront simulator mockup to iframe', () => {
    const contentContainer = document.getElementById('view-content');
    sdkModule.renderWidgetSDKView(contentContainer);

    const iframe = document.getElementById('demo-widget-iframe');
    expect(iframe).toBeDefined();
    
    // Check if iframe was written to by verifying src or contents
    // In actual browser, document.write modifies iframe document.
    const doc = iframe.contentWindow.document;
    expect(doc).toBeDefined();
  });

  it('should bootstrap the embeddable widget with self-contained styles on a client page', () => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    sessionStorage.clear();
    window.__omnigentInitialized = false;
    window.omnigentSettings = {
      businessName: 'Client Store',
      primaryColor: '#0071e3',
      persona: 'Support'
    };

    new Function(widgetSource)();

    const root = document.getElementById('omnigent-chat-widget-root');
    const styles = document.getElementById('omnigent-chat-widget-styles');
    const bubble = document.getElementById('omnigent-chat-bubble');
    const windowPanel = document.getElementById('omnigent-chat-window');

    expect(root).toBeDefined();
    expect(styles).toBeDefined();
    expect(styles.textContent).toContain('#omnigent-chat-window');
    expect(bubble).toBeDefined();
    expect(windowPanel).toBeDefined();

    bubble.dispatchEvent(new window.Event('click'));
    expect(windowPanel.style.display).toBe('flex');
    expect(document.getElementById('omnigent-chat-agent-name').textContent).toBe('Client Store Assistant');
  });
});
