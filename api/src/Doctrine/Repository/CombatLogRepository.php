<?php

namespace App\Doctrine\Repository;

use App\Entity\Character;
use App\Entity\CombatLog;
use App\Repository\CombatLogRepositoryInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Uid\Ulid;

class CombatLogRepository extends AbstractDoctrineRepository implements CombatLogRepositoryInterface
{
    public function __construct(private EntityManagerInterface $entityManager)
    {
        $this->repository = $entityManager->getRepository(Character::class);
    }

    public function find($id): ?CombatLog
    {
        $entity = $this->repository->find($id);
        if ($entity instanceof CombatLog) {
            return $entity;
        }

        return null;
    }

    public function findOneBy(array $criteria): ?CombatLog
    {
        $entity = $this->repository->findOneBy($criteria);
        if ($entity instanceof CombatLog) {
            return $entity;
        }

        return null;
    }

    public function findActiveCombatLogs(Character $character = null): iterable
    {
        $qb = $this->entityManager->createQueryBuilder()
            ->select('s')
            ->from(Character::class, 's');
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

        return $qb->getQuery()->getResult();
    }
}
