<?php

namespace App\Doctrine\Repository;

use App\Core\Entity\CombatRound;
use App\Core\Repository\CombatRoundRepositoryInterface;
use Doctrine\ORM\EntityManagerInterface;

class CombatRoundRepository extends AbstractDoctrineRepository implements CombatRoundRepositoryInterface
{
    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->repository = $entityManager->getRepository(CombatRound::class);
    }

    public function find($id): ?CombatRound
    {
        $entity = $this->repository->find($id);
        if ($entity instanceof CombatRound) {
            return $entity;
        }

        return null;
    }

    public function findOneBy(array $criteria): ?CombatRound
    {
        $entity = $this->repository->findOneBy($criteria);
        if ($entity instanceof CombatRound) {
            return $entity;
        }

        return null;
    }
}
