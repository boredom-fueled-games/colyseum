<?php

declare(strict_types=1);

namespace App\Entity;

interface StatsAwareInterface
{
    public function getStats(): array;
}
