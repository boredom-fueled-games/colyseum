<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\OwnedItem;

interface OwnedItemRepositoryInterface extends BaseRepositoryInterface
{
    public function find($id): ?OwnedItem;

    public function findOneBy(array $criteria): ?OwnedItem;
}
