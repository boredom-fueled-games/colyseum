<?php

declare(strict_types=1);

namespace App\Listener\Doctrine;

use Doctrine\DBAL\Schema\PostgreSqlSchemaManager;
use Doctrine\ORM\Tools\Event\GenerateSchemaEventArgs;

//https://gist.github.com/vudaltsov/ec01012d3fe27c9eed59aa7fd9089cf7
final class FixPostgreSQLDefaultSchemaListener
{
    public function postGenerateSchema(GenerateSchemaEventArgs $args): void
    {
        $schemaManager = $args
            ->getEntityManager()
            ->getConnection()
            ->getSchemaManager();

        if (!$schemaManager instanceof PostgreSqlSchemaManager) {
            return;
        }

        foreach ($schemaManager->getExistingSchemaSearchPaths() as $namespace) {
            if (!$args->getSchema()->hasNamespace($namespace)) {
                $args->getSchema()->createNamespace($namespace);
            }
        }
    }
}
