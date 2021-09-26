<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Character;

interface CharacterRepositoryInterface extends BaseRepositoryInterface
{
    public function find($id): ?Character;

    public function findOneBy(array $criteria): ?Character;
}
