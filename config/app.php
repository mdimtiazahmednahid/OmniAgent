<?php

declare(strict_types=1);

return [
    'app' => [
        'name' => 'Omnigent',
        'title' => 'Omnigent | AI Omni-Channel & Live Tracking Platform',
        'year' => '2026',
        'tagline' => 'A calm command center for support teams: conversations, orders, live sessions, and AI assistance in one place.',
    ],
    'landingNav' => [
        ['href' => '#features', 'label' => 'Platform'],
        ['href' => '#pricing', 'label' => 'Plans'],
        ['href' => '#testimonials', 'label' => 'Proof'],
    ],
    'features' => [
        [
            'icon' => '01',
            'title' => 'Unified inbox',
            'copy' => 'Manage messages from WhatsApp, Messenger, Instagram, and your embedded web widget without switching tools.',
        ],
        [
            'icon' => '02',
            'title' => 'Guided AI replies',
            'copy' => 'Tune the assistant persona, prompt, temperature, and auto-reply behavior for each business workspace.',
        ],
        [
            'icon' => '03',
            'title' => 'Live visitor context',
            'copy' => 'See where visitors are browsing, inspect session metadata, and open a support conversation at the right moment.',
        ],
        [
            'icon' => '04',
            'title' => 'Commerce operations',
            'copy' => 'Track orders, update fulfillment, link customers to purchases, and keep support grounded in customer context.',
        ],
    ],
    'pricingPlans' => [
        [
            'name' => 'Starter',
            'price' => '$19',
            'period' => '/mo',
            'description' => 'For small shops validating automated support.',
            'features' => [
                '1 inbox integration',
                'Basic AI assistant',
                '200 automated replies /mo',
                'Live visitor tracking',
            ],
            'button' => 'Select Starter',
            'featured' => false,
        ],
        [
            'name' => 'Growth',
            'price' => '$49',
            'period' => '/mo',
            'description' => 'For teams that need the full customer operations cockpit.',
            'features' => [
                'Unlimited channels',
                'Advanced prompt customization',
                'Unlimited AI auto-replies',
                'Automation flow builder',
                'Order manager workspace',
            ],
            'button' => 'Select Growth',
            'featured' => true,
        ],
        [
            'name' => 'Enterprise',
            'price' => 'Custom',
            'period' => '',
            'description' => 'For businesses that require private infrastructure and strict support guarantees.',
            'features' => [
                'Custom model hosting',
                'Dedicated SLA support',
                'Private cloud deployment',
                'Custom integrations',
            ],
            'button' => 'Contact Sales',
            'featured' => false,
        ],
    ],
    'testimonials' => [
        [
            'quote' => 'We finally see live customer intent and order context in one interface. Support feels much less reactive now.',
            'user' => 'Sarah J., TechStore Owner',
        ],
        [
            'quote' => 'The visitor takeover flow helped our team answer pricing questions before customers abandoned checkout.',
            'user' => 'Marcus K., Support Director',
        ],
    ],
    'industries' => [
        'ecommerce' => 'E-Commerce & Retail',
        'saas' => 'Software / SaaS',
        'services' => 'Professional Services',
        'hospitality' => 'Hospitality & Food',
    ],
    'brandColors' => [
        '#0071e3' => 'Apple Blue (Default)',
        '#34c759' => 'System Green',
        '#af52de' => 'System Purple',
        '#ff3b30' => 'System Red',
        '#5ac8fa' => 'System Cyan',
        '#ff9500' => 'System Orange',
    ],
    'sidebarItems' => [
        ['view' => 'dashboard', 'label' => 'Dashboard'],
        ['view' => 'analytics', 'label' => 'Analytics'],
        ['view' => 'inbox', 'label' => 'Unified Inbox', 'badgeId' => 'unread-chats-badge'],
        ['view' => 'live-map', 'label' => 'Live Tracking', 'badgeId' => 'live-visitors-badge', 'live' => true],
        ['view' => 'orders', 'label' => 'Order Manager'],
        ['view' => 'automation', 'label' => 'Automations'],
        ['view' => 'ai-agent', 'label' => 'AI Agent Config'],
        ['view' => 'widget-sdk', 'label' => 'Web SDK Widget'],
    ],
    'demoAccount' => [
        'business' => 'TechStore',
        'email' => 'admin@techstore.com',
        'password' => 'admin123',
    ],
];

