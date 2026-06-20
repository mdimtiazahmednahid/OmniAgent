<?php

declare(strict_types=1);

namespace Omnigent\Core;

final class Router
{
    /** @var array<string, array{0: class-string, 1: string}> */
    private array $routes = [];

    public function __construct(private Config $config)
    {
    }

    public function get(string $path, string $controller, string $method): void
    {
        $this->routes['GET ' . $this->normalize($path)] = [$controller, $method];
    }

    public function dispatch(string $method, string $uri): string
    {
        $path = $this->normalize(parse_url($uri, PHP_URL_PATH) ?: '/');
        $route = $this->routes[$method . ' ' . $path] ?? $this->routes['GET /'] ?? null;

        if ($route === null) {
            http_response_code(404);
            return 'Not found';
        }

        [$controllerClass, $action] = $route;
        $controller = new $controllerClass($this->config);

        return (string) $controller->{$action}();
    }

    private function normalize(string $path): string
    {
        $path = '/' . trim($path, '/');
        return $path === '/index.php' ? '/' : $path;
    }
}

