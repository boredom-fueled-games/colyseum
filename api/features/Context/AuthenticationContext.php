<?php

declare(strict_types=1);

namespace App\Tests\Context;

use App\Entity\User;
use Behat\Behat\Context\Context;
use Doctrine\Persistence\ManagerRegistry;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\BrowserKit\AbstractBrowser;

abstract class AuthenticationContext implements Context
{
    public function __construct(
        private ManagerRegistry $doctrine,
        private AbstractBrowser $client,
        private JWTTokenManagerInterface $jwtTokenManager,
    ) {
    }

    /**
     * @BeforeScenario @login
     */
    public function login(): void
    {
        $user = new User();
        $user->setUsername('testing-admin');
        $user->setPassword('ATestPassword');

        $objectManager = $this->doctrine->getManager();
        $objectManager->persist($user);
        $objectManager->flush();

        $token = $this->jwtTokenManager->create($user);

        $this->client->setServerParameter('HTTP_Authorization', sprintf('Bearer %s', $token));
    }
}
