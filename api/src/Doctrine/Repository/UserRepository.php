<?php

namespace App\Doctrine\Repository;

use App\Entity\User;
use App\Repository\UserRepositoryInterface;
use Doctrine\ORM\EntityManagerInterface;

class UserRepository extends AbstractDoctrineRepository implements UserRepositoryInterface
{
    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->repository = $entityManager->getRepository(User::class);
    }

    public function find($id): ?User
    {
        $entity = $this->repository->find($id);
        if ($entity instanceof User) {
            return $entity;
        }

        return null;
    }

    public function findOneBy(array $criteria): ?User
    {
        $entity = $this->repository->findOneBy($criteria);
        if ($entity instanceof User) {
            return $entity;
        }

        return null;
    }
}
