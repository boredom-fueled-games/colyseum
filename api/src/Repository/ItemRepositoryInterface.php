<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Item;

interface ItemRepositoryInterface extends BaseRepositoryInterface
{
    public function find($id): ?Item;

    public function findOneBy(array $criteria): ?Item;
}
