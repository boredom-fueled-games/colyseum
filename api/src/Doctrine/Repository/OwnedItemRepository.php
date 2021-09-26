<?php

namespace App\Doctrine\Repository;

use App\Entity\Item;
use App\Entity\OwnedItem;
use App\Repository\OwnedItemRepositoryInterface;
use Doctrine\ORM\EntityManagerInterface;

class OwnedItemRepository extends AbstractDoctrineRepository implements OwnedItemRepositoryInterface
{
    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->repository = $entityManager->getRepository(Item::class);
    }

    public function find($id): ?OwnedItem
    {
        $entity = $this->repository->find($id);
        if ($entity instanceof OwnedItem) {
            return $entity;
        }

        return null;
    }

    public function findOneBy(array $criteria): ?OwnedItem
    {
        $entity = $this->repository->findOneBy($criteria);
        if ($entity instanceof OwnedItem) {
            return $entity;
        }

        return null;
    }
}
