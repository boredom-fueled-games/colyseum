<?php

declare(strict_types=1);

namespace App\Core\Repository;

use App\Core\Entity\CombatRound;

interface CombatRoundRepositoryInterface extends BaseRepositoryInterface
{
    public function find($id): ?CombatRound;

    public function findOneBy(array $criteria): ?CombatRound;
}
