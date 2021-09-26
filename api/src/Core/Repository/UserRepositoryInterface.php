<?php

declare(strict_types=1);

namespace App\Core\Repository;

use App\Core\Entity\User;

interface UserRepositoryInterface extends BaseRepositoryInterface
{
    public function find($id): ?User;

    public function findOneBy(array $criteria): ?User;
}
