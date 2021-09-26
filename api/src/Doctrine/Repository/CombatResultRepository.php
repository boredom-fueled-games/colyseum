<?php

namespace App\Doctrine\Repository;

use App\Entity\CombatResult;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method CombatResult|null find($id, $lockMode = null, $lockVersion = null)
 * @method CombatResult|null findOneBy(array $criteria, array $orderBy = null)
 * @method CombatResult[]    findAll()
 * @method CombatResult[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CombatResultRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, CombatResult::class);
    }
}
