<?php

namespace App\Doctrine\Repository;

use App\Entity\CombatRound;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method CombatRound|null find($id, $lockMode = null, $lockVersion = null)
 * @method CombatRound|null findOneBy(array $criteria, array $orderBy = null)
 * @method CombatRound[]    findAll()
 * @method CombatRound[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CombatRoundRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, CombatRound::class);
    }
}
