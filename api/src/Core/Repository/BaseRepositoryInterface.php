<?php

declare(strict_types=1);

namespace App\Core\Repository;

interface BaseRepositoryInterface
{
    public function findAll(): array;

    public function findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null): array;
}
