<?php

declare(strict_types=1);

namespace App\Core\Repository;

use App\Core\Entity\CombatResult;

interface CombatResultRepositoryInterface extends BaseRepositoryInterface
{
    public function find($id): ?CombatResult;

    public function findOneBy(array $criteria): ?CombatResult;
}
