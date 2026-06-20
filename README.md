# Omnigent MVC PHP Edition

Omnigent is an AI omni-channel customer support prototype. The PHP layer now follows a lightweight MVC architecture: a front controller dispatches requests, controllers coordinate models, models provide page content, and views render the HTML shell. The existing browser-side JavaScript modules still power live dashboard interactions.

## Architecture

```text
OmniAgent/
  index.php                    Front controller
  bootstrap.php                Autoloader and shared helpers
  .htaccess                    Apache front-controller routing
  config/
    app.php                    App, content, pricing, nav, and UI config
  app/
    Controllers/
      HomeController.php       Handles the landing/dashboard shell route
    Core/
      Config.php               Dot-notation config reader
      Controller.php           Base controller
      Router.php               Minimal HTTP router
      View.php                 View renderer with layout support
    Models/
      MarketingContent.php     Provides page content from config
    Support/
      helpers.php              Escaping and form helpers
    Views/
      layouts/app.php          HTML document layout
      home/index.php           Landing, auth, and dashboard shell view
  js/                          Browser dashboard feature modules
  app.js                       Client-side state, routing, simulation
  index.css                    Main visual system
  chat-widget.js               Embeddable widget runtime
  chat-widget.css              Widget styles
  tests/                       Vitest/jsdom regression tests
```

## Request Flow

1. A request reaches `index.php`.
2. `bootstrap.php` registers the `Omnigent\` autoloader and helpers.
3. `Router` resolves the request path.
4. `HomeController@index` asks `MarketingContent` for view data.
5. `View` renders `app/Views/home/index.php` inside `app/Views/layouts/app.php`.
6. The browser loads `app.js`, which handles login, registration, dashboard routing, state persistence, and simulated runtime events.

## Design Refresh

The interface has been restyled away from the earlier neon/AI-generated look toward an Apple-inspired theme:

- light system surfaces,
- SF-style font stack,
- Apple blue as the primary color,
- restrained borders and shadows,
- translucent header/sidebar treatment,
- cleaner landing hero with a product preview,
- calmer cards, pricing, forms, and dashboard chrome.

## Run Locally

Install PHP 8 or newer, then run:

```bash
php -S localhost:8000
```

Open:

```text
http://localhost:8000/
```

For Apache, `.htaccess` routes unknown paths back to `index.php`.

## JavaScript Tests

Install dependencies:

```bash
npm install
```

Run:

```bash
npm test
```

On Windows PowerShell:

```powershell
npm.cmd test
```

Current result:

```text
4 test files passed
18 tests passed
```

## Demo Account

```text
Email: admin@techstore.com
Password: admin123
```

## Client Site Widget Embed

The chat widget is self-contained. Client websites only need this script after configuring `window.omnigentSettings`; no separate CSS file is required.

```html
<script>
  window.omnigentSettings = {
    apiKey: "omni_live_biz-techstore",
    businessName: "Client Store",
    primaryColor: "#0071e3",
    persona: "Support"
  };
</script>
<script src="https://your-omnigent-domain.com/chat-widget.js" async></script>
```

## Current Production Boundaries

The PHP structure is production-oriented, but this is still a prototype runtime:

- dashboard data is still stored in browser `localStorage`/`sessionStorage`,
- authentication is still simulated,
- AI replies are still mocked in JavaScript,
- messaging, orders, and visitor tracking are simulated integrations.

Recommended next production steps:

- move auth and business state into PHP sessions plus a database,
- add repositories/services for chats, visitors, orders, and automation rules,
- add CSRF protection and request validation for POST routes,
- replace mock AI replies with a server-side LLM integration,
- add PHP unit tests and browser tests against `index.php`.
