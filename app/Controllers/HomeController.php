<?php

declare(strict_types=1);

namespace Omnigent\Controllers;

use Omnigent\Core\Controller;
use Omnigent\Models\MarketingContent;

final class HomeController extends Controller
{
    public function index(): string
    {
        $content = new MarketingContent($this->config);

        return $this->view('home/index', $content->homePage());
    }
}

