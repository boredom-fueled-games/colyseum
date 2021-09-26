<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Character;
use App\Entity\CombatLog;

interface CombatLogRepositoryInterface extends BaseRepositoryInterface
{
    public function find($id): ?CombatLog;

    public function findOneBy(array $criteria): ?CombatLog;

    public function findActiveCombatLogs(Character $character = null): iterable;
}
