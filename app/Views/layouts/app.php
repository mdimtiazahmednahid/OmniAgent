<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= e((string) ($app['title'] ?? 'Omnigent')) ?></title>
  <link rel="stylesheet" href="index.css">
</head>
<body>
  <?= $content ?>
  <script type="module" src="app.js"></script>
</body>
</html>

