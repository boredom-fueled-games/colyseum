<?php

declare(strict_types=1);

namespace App\Core\Repository;

use App\Core\Entity\Item;

interface ItemRepositoryInterface extends BaseRepositoryInterface
{
    public function find($id): ?Item;

    public function findOneBy(array $criteria): ?Item;
}
