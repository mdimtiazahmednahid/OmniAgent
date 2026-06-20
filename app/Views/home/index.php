<div id="landing-view" class="landing-container">
  <header class="landing-header">
    <div class="landing-logo-container">
      <div class="sidebar-logo">O</div>
      <span class="landing-brand-name"><?= e((string) $app['name']) ?></span>
    </div>

    <nav class="landing-nav" aria-label="Primary navigation">
      <?php foreach ($landingNav as $item): ?>
        <a href="<?= e((string) $item['href']) ?>"><?= e((string) $item['label']) ?></a>
      <?php endforeach; ?>
    </nav>

    <div class="landing-header-actions">
      <button id="btn-landing-login" class="btn">Log In</button>
      <button id="btn-landing-register" class="btn btn-primary">Start Trial</button>
    </div>
  </header>

  <section class="landing-hero">
    <div class="hero-content">
      <span class="hero-badge">Customer operations, simplified</span>
      <h1 class="hero-title">
        Support that feels calm, fast, and connected.
      </h1>
      <p class="hero-subtitle"><?= e((string) $app['tagline']) ?></p>
      <div class="hero-actions">
        <button id="btn-hero-cta" class="btn btn-primary btn-lg">Start Your Free Trial</button>
        <button id="btn-hero-demo" class="btn btn-lg">Explore Sandbox</button>
      </div>
    </div>
    <div class="hero-product-frame" aria-hidden="true">
      <div class="hero-window">
        <div class="hero-window-bar">
          <span></span><span></span><span></span>
        </div>
        <div class="hero-window-grid">
          <div class="hero-metric">
            <span>Live conversations</span>
            <strong>384</strong>
          </div>
          <div class="hero-metric">
            <span>Resolution rate</span>
            <strong>94.2%</strong>
          </div>
          <div class="hero-conversation">
            <p>Customer is on checkout and asking about delivery.</p>
            <small>AI reply drafted with order context.</small>
          </div>
          <div class="hero-session">
            <span>Visitor path</span>
            <strong>/pricing -> /checkout</strong>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="features" class="landing-features">
    <h2 class="section-title">Everything a support team needs in one workspace.</h2>
    <p class="section-subtitle">Designed for clarity, speed, and fewer disconnected tools.</p>

    <div class="features-grid">
      <?php foreach ($features as $feature): ?>
        <article class="feature-card">
          <div class="feature-icon"><?= e((string) $feature['icon']) ?></div>
          <h3><?= e((string) $feature['title']) ?></h3>
          <p><?= e((string) $feature['copy']) ?></p>
        </article>
      <?php endforeach; ?>
    </div>
  </section>

  <section id="pricing" class="landing-pricing">
    <h2 class="section-title">Plans for each stage of growth.</h2>
    <p class="section-subtitle">Start small, then add more channels, automation, and operational depth.</p>

    <div class="pricing-grid">
      <?php foreach ($pricingPlans as $plan): ?>
        <article class="pricing-card<?= $plan['featured'] ? ' featured' : '' ?>">
          <div class="plan-name"><?= e((string) $plan['name']) ?><?= $plan['featured'] ? ' (Recommended)' : '' ?></div>
          <div class="plan-price">
            <?= e((string) $plan['price']) ?>
            <?php if ($plan['period'] !== ''): ?>
              <span class="plan-period"><?= e((string) $plan['period']) ?></span>
            <?php endif; ?>
          </div>
          <p class="plan-desc"><?= e((string) $plan['description']) ?></p>
          <ul class="plan-features">
            <?php foreach ($plan['features'] as $feature): ?>
              <li><?= e((string) $feature) ?></li>
            <?php endforeach; ?>
          </ul>
          <button class="btn<?= $plan['featured'] ? ' btn-primary' : '' ?> btn-pricing-select" data-plan="<?= e((string) $plan['name']) ?>">
            <?= e((string) $plan['button']) ?>
          </button>
        </article>
      <?php endforeach; ?>
    </div>
  </section>

  <section id="testimonials" class="landing-testimonials">
    <h2 class="section-title">Built around real support moments.</h2>
    <div class="testimonials-grid">
      <?php foreach ($testimonials as $testimonial): ?>
        <article class="testimonial-card">
          <p class="testimonial-text">"<?= e((string) $testimonial['quote']) ?>"</p>
          <div class="testimonial-user">- <?= e((string) $testimonial['user']) ?></div>
        </article>
      <?php endforeach; ?>
    </div>
  </section>

  <footer class="landing-footer">
    <p>&copy; <?= e((string) $app['year']) ?> <?= e((string) $app['name']) ?>. Built for modern businesses.</p>
  </footer>
</div>

<div id="auth-view" class="auth-container" style="display: none;">
  <div class="auth-card glass-card">
    <div class="auth-tabs">
      <button id="tab-login" class="auth-tab active">Sign In</button>
      <button id="tab-register" class="auth-tab">Register Business</button>
    </div>

    <form id="form-login" class="auth-form">
      <h3 class="auth-title">Welcome Back</h3>
      <p class="auth-subtitle">Log in to manage your inbox, orders, visitors, and AI configuration.</p>

      <div class="input-group">
        <label class="input-label">Business Email</label>
        <input type="email" id="login-email" class="input-field" placeholder="<?= e((string) $demoAccount['email']) ?>" required>
      </div>

      <div class="input-group">
        <label class="input-label">Password</label>
        <input type="password" id="login-password" class="input-field" placeholder="Enter password" required>
      </div>

      <button type="submit" class="btn btn-primary btn-block">Access Dashboard</button>
      <p class="auth-toggle-tip">Don't have an account? <a href="#" id="link-to-register">Register your business</a></p>
    </form>

    <form id="form-register" class="auth-form" style="display: none;">
      <h3 class="auth-title">Register Business</h3>
      <p class="auth-subtitle">Create a local workspace for the prototype environment.</p>

      <div class="input-group">
        <label class="input-label">Business Name</label>
        <input type="text" id="register-biz-name" class="input-field" placeholder="CafeGlow, TechStore, etc." required>
      </div>

      <div class="input-group">
        <label class="input-label">Owner Name</label>
        <input type="text" id="register-owner-name" class="input-field" placeholder="Alice Smith" required>
      </div>

      <div class="form-grid">
        <div class="input-group">
          <label class="input-label">Industry</label>
          <select id="register-industry" class="select-field">
            <?php foreach ($industries as $value => $label): ?>
              <option value="<?= e((string) $value) ?>"><?= e((string) $label) ?></option>
            <?php endforeach; ?>
          </select>
        </div>
        <div class="input-group">
          <label class="input-label">Brand Color</label>
          <select id="register-color" class="select-field">
            <?php foreach ($brandColors as $value => $label): ?>
              <option value="<?= e((string) $value) ?>"<?= selected((string) $value, '#0071e3') ?>><?= e((string) $label) ?></option>
            <?php endforeach; ?>
          </select>
        </div>
      </div>

      <div class="input-group">
        <label class="input-label">Business Email</label>
        <input type="email" id="register-email" class="input-field" placeholder="alice@company.com" required>
      </div>

      <div class="input-group">
        <label class="input-label">Password</label>
        <input type="password" id="register-password" class="input-field" placeholder="Create password" required>
      </div>

      <button type="submit" class="btn btn-primary btn-block">Create Business Hub</button>
      <p class="auth-toggle-tip">Already registered? <a href="#" id="link-to-login">Sign in</a></p>
    </form>

    <div class="auth-card-footer">
      <button id="btn-auth-back" class="btn btn-sm btn-text">Back to Homepage</button>
    </div>
  </div>
</div>

<div id="app" style="display: none;">
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="sidebar-logo">O</div>
      <span class="sidebar-title"><?= e((string) $app['name']) ?></span>
    </div>

    <nav class="sidebar-nav" aria-label="Dashboard navigation">
      <?php foreach ($sidebarItems as $index => $item): ?>
        <a class="nav-item<?= $index === 0 ? ' active' : '' ?>" data-view="<?= e((string) $item['view']) ?>">
          <span class="nav-icon-dot" aria-hidden="true"></span>
          <?= e((string) $item['label']) ?>
          <?php if (isset($item['badgeId'])): ?>
            <span
              class="nav-badge<?= !empty($item['live']) ? ' live' : '' ?>"
              id="<?= e((string) $item['badgeId']) ?>"
              <?= empty($item['live']) ? 'style="display: none;"' : '' ?>
            ><?= !empty($item['live']) ? '0' : '3' ?></span>
          <?php endif; ?>
        </a>
      <?php endforeach; ?>
    </nav>

    <div class="sidebar-footer" style="justify-content: space-between;">
      <div class="agent-profile" style="width: auto;">
        <div class="agent-avatar" id="sidebar-agent-avatar">
          JD
          <div class="agent-status-dot"></div>
        </div>
        <div class="agent-info">
          <span class="agent-name" id="sidebar-agent-name">John Doe</span>
          <span class="agent-role" id="sidebar-business-name">System Administrator</span>
        </div>
      </div>
      <button id="btn-logout" class="btn-icon logout-button" title="Logout">Logout</button>
    </div>
  </aside>

  <main class="main-content">
    <header class="topbar">
      <div class="topbar-title-section">
        <h1 id="view-title">Dashboard</h1>
      </div>

      <div class="topbar-actions">
        <div class="stat-pill">
          <span class="pulse-dot"></span>
          <span>AI Copilot: <strong id="topbar-copilot-status">Active</strong></span>
        </div>

        <div class="stat-pill">
          <span class="pulse-dot warning"></span>
          <span>Simulated Visitors: <strong id="topbar-visitors-count">0</strong></span>
        </div>
      </div>
    </header>

    <div class="view-container" id="view-content"></div>
    <div id="toast-container"></div>
  </main>
</div>

