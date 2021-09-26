<?php

namespace App\Doctrine\Repository;

use App\Core\Entity\CombatResult;
use App\Core\Repository\CombatResultRepositoryInterface;
use Doctrine\ORM\EntityManagerInterface;

class CombatResultRepository extends AbstractDoctrineRepository implements CombatResultRepositoryInterface
{
    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->repository = $entityManager->getRepository(CombatResult::class);
    }

    public function find($id): ?CombatResult
    {
        $entity = $this->repository->find($id);
        if ($entity instanceof CombatResult) {
            return $entity;
        }

        return null;
    }

    public function findOneBy(array $criteria): ?CombatResult
    {
        $entity = $this->repository->findOneBy($criteria);
        if ($entity instanceof CombatResult) {
            return $entity;
        }

        return null;
    }
}
