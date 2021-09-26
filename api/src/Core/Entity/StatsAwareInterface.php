<?php

declare(strict_types=1);

namespace App\Core\Entity;

interface StatsAwareInterface
{
    public function getStats(): array;
}
