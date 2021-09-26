<?php

declare(strict_types=1);

namespace App\Doctrine\Repository;

use App\Core\Repository\BaseRepositoryInterface;
use Doctrine\Persistence\ObjectRepository;

abstract class AbstractDoctrineRepository implements BaseRepositoryInterface
{
    protected ObjectRepository $repository;

    public function findAll(): array
    {
        return $this->repository->findAll();
    }

    public function findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null): array
    {
        return $this->repository->findBy($criteria, $orderBy, $limit, $offset);
    }
}
