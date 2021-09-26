<?php

namespace App\Doctrine\Repository;

use App\Entity\OwnedItem;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method OwnedItem|null find($id, $lockMode = null, $lockVersion = null)
 * @method OwnedItem|null findOneBy(array $criteria, array $orderBy = null)
 * @method OwnedItem[]    findAll()
 * @method OwnedItem[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class OwnedItemRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, OwnedItem::class);
    }
}
