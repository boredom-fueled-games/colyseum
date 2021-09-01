<?php

declare(strict_types=1);

namespace App\Tests\Context;

use App\Entity\User;
use Behat\Behat\Context\Context;
use Doctrine\ORM\Tools\SchemaTool;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Persistence\ObjectManager;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;

abstract class FeatureContext implements Context
{
    protected ObjectManager $manager;
    private SchemaTool $schemaTool;
    private array $classes;
    protected array $headers = [];

    public function __construct(
        private ManagerRegistry $doctrine,
        private JWTTokenManagerInterface $jwtManager
    ) {
        $this->manager = $this->doctrine->getManager();
        $this->schemaTool = new SchemaTool($this->manager);
        $this->classes = $this->manager->getMetadataFactory()->getAllMetadata();
    }

    /**
     * @BeforeScenario @createSchema
     */
    public function createDatabase(): void
    {
        $this->schemaTool->dropSchema($this->classes);
        $this->manager->clear();
        $this->schemaTool->createSchema($this->classes);
    }

    /**
     * @BeforeScenario @login
     */
    public function login(): void
    {
        $this->createDatabase();

        $user = new User();
        $user->setUsername('admin');
        $user->setPassword('ATestPassword');

        $this->manager->persist($user);
        $this->manager->flush();

        $token = $this->jwtManager->create($user);

        $this->headers['HTTP_Authorization'] = 'Bearer ' . $token;
    }

    /**
     * @BeforeScenario @logout
     */
    public function logout(): void
    {
        unset($this->headers['HTTP_Authorization']);
    }
}
