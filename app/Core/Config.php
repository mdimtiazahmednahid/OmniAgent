<?php

declare(strict_types=1);

namespace Omnigent\Core;

final class Config
{
    /** @var array<string, mixed> */
    private array $items;

    public function __construct(string $path)
    {
        $items = require $path;
        $this->items = is_array($items) ? $items : [];
    }

    public function get(string $key, mixed $default = null): mixed
    {
        $segments = explode('.', $key);
        $value = $this->items;

        foreach ($segments as $segment) {
            if (!is_array($value) || !array_key_exists($segment, $value)) {
                return $default;
            }

            $value = $value[$segment];
        }

        return $value;
    }

    /** @return array<string, mixed> */
    public function all(): array
    {
        return $this->items;
    }
}

