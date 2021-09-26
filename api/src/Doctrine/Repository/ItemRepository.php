<?php

namespace App\Doctrine\Repository;

use App\Core\Entity\Item;
use App\Core\Repository\ItemRepositoryInterface;
use Doctrine\ORM\EntityManagerInterface;

class ItemRepository extends AbstractDoctrineRepository implements ItemRepositoryInterface
{
    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->repository = $entityManager->getRepository(Item::class);
    }

    public function find($id): ?Item
    {
        $entity = $this->repository->find($id);
        if ($entity instanceof Item) {
            return $entity;
        }

        return null;
    }

    public function findOneBy(array $criteria): ?Item
    {
        $entity = $this->repository->findOneBy($criteria);
        if ($entity instanceof Item) {
            return $entity;
        }

        return null;
    }
}
