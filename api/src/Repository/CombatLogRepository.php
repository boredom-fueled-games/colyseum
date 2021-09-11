<?php

namespace App\Repository;

use App\Entity\Character;
use App\Entity\CombatLog;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Uid\Ulid;

/**
 * @method CombatLog|null find($id, $lockMode = null, $lockVersion = null)
 * @method CombatLog|null findOneBy(array $criteria, array $orderBy = null)
 * @method CombatLog[]    findAll()
 * @method CombatLog[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CombatLogRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, CombatLog::class);
    }

    public function findActiveCombatLogs(Character $character = null): iterable
    {
        $qb = $this->createQueryBuilder('s');
        $qb->where('s.startedAt IS NOT NULL');
        $qb->andWhere('s.startedAt < :now');
        $qb->andWhere($qb->expr()->orX()->addMultiple([
            's.endedAt IS NULL',
            's.endedAt > :now',
        ]));
        $qb->setParameter('now', new \DateTime());

        if ($character !== null) {
            $iriParts = explode('/', $character->getId());
            $qb->andWhere(':character MEMBER OF s.characters')
                ->setParameter('character', (Ulid::fromString(end($iriParts)))->toRfc4122());
        }

        return $qb->getQuery()
            ->getResult();
    }

    // /**
    //  * @return CombatLog[] Returns an array of CombatLog objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('c.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?CombatLog
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
