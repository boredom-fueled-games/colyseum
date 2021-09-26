<?php

declare(strict_types=1);

namespace App\Core\Repository;

use App\Core\Entity\Character;

interface CharacterRepositoryInterface extends BaseRepositoryInterface
{
    public function find($id): ?Character;

    public function findOneBy(array $criteria): ?Character;
}
