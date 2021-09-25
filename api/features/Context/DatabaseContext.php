<?php

declare(strict_types=1);

namespace App\Tests\Context;

use Behat\Behat\Context\Context;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Persistence\ObjectManager;
use Nelmio\Alice\FileLoaderInterface;

class DatabaseContext implements Context
{
    protected ObjectManager $objectManager;

    public function __construct(private ManagerRegistry $doctrine, private FileLoaderInterface $fileLoader)
    {
        $this->objectManager = $this->doctrine->getManager();
    }

    /**
     * @Given the fixtures file :fixturesFile is loaded
     */
    public function thereAreFixtures(string $fixturesFile)
    {
        $items = $this->fileLoader->loadFile($fixturesFile)->getObjects();
        foreach ($items as $item) {
            $this->objectManager->persist($item);
        }

        $this->objectManager->flush();
    }

    /**
     * @BeforeScenario
     */
    public function beginTransaction()
    {
        $this->doctrine->getConnection()->beginTransaction();
    }

    /**
     * @AfterScenario
     */
    public function rollbackTransaction()
    {
        $this->doctrine->getConnection()->rollBack();
    }
}
