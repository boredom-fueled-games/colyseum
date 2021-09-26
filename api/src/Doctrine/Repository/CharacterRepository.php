<?php

namespace App\Doctrine\Repository;

use App\Core\Entity\Character;
use App\Core\Repository\CharacterRepositoryInterface;
use Doctrine\ORM\EntityManagerInterface;

class CharacterRepository extends AbstractDoctrineRepository implements CharacterRepositoryInterface
{
    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->repository = $entityManager->getRepository(Character::class);
    }

    public function find($id): ?Character
    {
        $entity = $this->repository->find($id);
        if ($entity instanceof Character) {
            return $entity;
        }

        return null;
    }

    public function findOneBy(array $criteria): ?Character
    {
        $entity = $this->repository->findOneBy($criteria);
        if ($entity instanceof Character) {
            return $entity;
        }

        return null;
    }
}
