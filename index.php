<?php

declare(strict_types=1);

use Omnigent\Controllers\HomeController;
use Omnigent\Core\Config;
use Omnigent\Core\Router;

require __DIR__ . '/bootstrap.php';

$config = new Config(__DIR__ . '/config/app.php');
$router = new Router($config);

$router->get('/', HomeController::class, 'index');

echo $router->dispatch($_SERVER['REQUEST_METHOD'] ?? 'GET', $_SERVER['REQUEST_URI'] ?? '/');

