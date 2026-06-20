<?php

declare(strict_types=1);

if (!function_exists('e')) {
    function e(string $value): string
    {
        return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
    }
}

if (!function_exists('selected')) {
    function selected(string $actual, string $expected): string
    {
        return $actual === $expected ? ' selected' : '';
    }
}

