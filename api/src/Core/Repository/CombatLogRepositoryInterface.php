<?php

declare(strict_types=1);

namespace App\Core\Repository;

use App\Core\Entity\Character;
use App\Core\Entity\CombatLog;

interface CombatLogRepositoryInterface extends BaseRepositoryInterface
{
    public function find($id): ?CombatLog;

    public function findOneBy(array $criteria): ?CombatLog;

    public function findActiveCombatLogs(Character $character = null): iterable;
}
