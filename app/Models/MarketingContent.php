<?php

declare(strict_types=1);

namespace Omnigent\Models;

use Omnigent\Core\Config;

final class MarketingContent
{
    public function __construct(private Config $config)
    {
    }

    /**
     * @return array<string, mixed>
     */
    public function homePage(): array
    {
        return [
            'app' => $this->config->get('app', []),
            'landingNav' => $this->config->get('landingNav', []),
            'features' => $this->config->get('features', []),
            'pricingPlans' => $this->config->get('pricingPlans', []),
            'testimonials' => $this->config->get('testimonials', []),
            'industries' => $this->config->get('industries', []),
            'brandColors' => $this->config->get('brandColors', []),
            'sidebarItems' => $this->config->get('sidebarItems', []),
            'demoAccount' => $this->config->get('demoAccount', []),
        ];
    }
}

