<?php

declare(strict_types=1);

namespace Omnigent\Core;

abstract class Controller
{
    public function __construct(protected Config $config)
    {
    }

    /**
     * @param array<string, mixed> $data
     */
    protected function view(string $template, array $data = [], ?string $layout = 'layouts/app'): string
    {
        return View::render($template, $data, $layout);
    }
}

