<?php

declare(strict_types=1);

namespace App\ApiPlatform\Extension;

use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use App\Core\Entity\Character;
use App\Core\Entity\User;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\Security\Core\Security;

final class CharacterExtension implements QueryCollectionExtensionInterface
{
    public function __construct(private Security $security)
    {
    }

    public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, string $operationName = null)
    {
        if ($resourceClass !== Character::class || $operationName !== 'get') {
            return;
        }

        /** @var User|null $user */
        $user = $this->security->getUser();
        if ($this->security->isGranted('ROLE_ADMIN') || null === $user) {
            return;
        }

        $rootAlias = $queryBuilder->getRootAliases()[0];
        $queryBuilder->andWhere(
            $queryBuilder->expr()->orX()->addMultiple([
                sprintf('%s.user IS NULL', $rootAlias),
                sprintf('%s.user != :user', $rootAlias),
            ]))->setParameter('user', $user->getId()->toRfc4122());
    }
}
