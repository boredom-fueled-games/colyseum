<?php

declare(strict_types=1);

namespace App\Tests\Context;

use App\Entity\User;
use App\Repository\UserRepository;
use Behat\Behat\Context\Context;
use Behat\Gherkin\Node\TableNode;
use Doctrine\Persistence\ManagerRegistry;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\BrowserKit\AbstractBrowser;
use Symfony\Component\Serializer\Encoder\DecoderInterface;
use Symfony\Component\Serializer\Encoder\EncoderInterface;
use Webmozart\Assert\Assert;

final class ApiPlatformContext implements Context
{
    private array $body = [];
    private array $headers = [
        'CONTENT_TYPE' => 'application/json',
    ];
    private ?User $authenticatedUser = null;

    public function __construct(
        private ManagerRegistry $doctrine,
        private AbstractBrowser $client,
        private DecoderInterface $decoder,
        private EncoderInterface $encoder,
        private JWTTokenManagerInterface $jwtTokenManager,
        private UserRepository $userRepository,
    ) {
    }

    /**
     * @When the request body is:
     */
    public function theRequestBodyIs(string $body): void
    {
        $this->body = $this->decoder->decode($body, 'json');
    }

    /**
     * @When I send a :method request to :path
     */
    public function iSendARequestTo(string $method, string $path): void
    {
        $this->setAuthenticationHeader();

        $this->client->request($method, $path, [], [], $this->headers, $this->encoder->encode($this->body, 'json'));

        $this->body = [];
    }

    /**
     * @When I send a :method request to the previous iri
     */
    public function iSendARequestToThePreviousIri(string $method): void
    {
        $content = $this->decoder->decode($this->client->getResponse()->getContent(), 'json');
        if (!\array_key_exists('@id', $content)) {
            throw new \Exception('Previous context doesn\'t contain a valid iri');
        }

        $this->iSendARequestTo($method, $content['@id']);
    }

    /**
     * @When I add a :method header with :value is added
     */
    public function headerWithValueIsAdded(string $header, string $value): void
    {
        $this->headers['HTTP_' . $header] = $value;
    }

    /**
     * @Then the response status code should be :code
     */
    public function theResponseShouldBeReceived(string $code): void
    {
        Assert::eq($this->client->getResponse()->getStatusCode(), $code);
    }

    /**
     * @Then the response collection should contain:
     */
    public function theResponseCollectionShouldContain(TableNode $table): void
    {
        $content = $this->decoder->decode($this->client->getResponse()->getContent(), 'json');
        $records = $content['hydra:member'];
        $matchingRecords = 0;
        foreach ($table as $row) {
            foreach ($records as $record) {
                $count = 0;
                $contains = 0;
                foreach ($row as $key => $value) {
                    ++$count;
                    if (\array_key_exists($key, $record) && $record[$key] === $value) {
                        ++$contains;
                    }
                }
                if ($count !== 0 && $contains === \count($row)) {
                    ++$matchingRecords;
                }
            }
        }

        if ($matchingRecords < $table->getIterator()->count()) {
            throw new \Exception('Response didn\'t contain everything');
        }
    }

    /**
     * @Then items in the response collection should only have the following fields:
     */
    public function itemsInTheResponseCollectionShouldHaveTheFollowingFields(TableNode $table): void
    {
        $content = $this->decoder->decode($this->client->getResponse()->getContent(), 'json');
        $records = $content['hydra:member'];
        $rows = $table->getRows();
        foreach ($records as $record) {
            if (\count(array_keys($record)) !== \count(array_keys($rows))) {
                throw new \Exception('Not all records have the exact amount of fields');
            }
            foreach ($rows as $row) {
                if (!\array_key_exists($row[0], $record)) {
                    throw new \Exception('Not all records contain "' . $row[0] . '"');
                }
            }
        }
    }

    /**
     * @Given the following :entity exist(s):
     */
    public function theFollowingEntityExist(string $entity, TableNode $table): void
    {
        $objectManager = $this->doctrine->getManager();

        foreach ($table as $row) {
            switch ($entity) {
                case 'users':
                case 'user':
                    $user = new User();
                    $user->setUsername($row['username']);
                    $user->setPassword($row['password']);
                    $objectManager->persist($user);
            }
        }

        $objectManager->flush();
    }

    /**
     * @Then the response should be in JSON
     */
    public function theResponseShouldBeInJson(): void
    {
        try {
            $this->decoder->decode($this->client->getResponse()->getContent(), 'json');
        } catch (\throwable $exception) {
            throw new \Exception('Response didn\'t contain valid JSON');
        }
    }

    /**
     * @Then the response body matches:
     */
    public function theResponseBodyMatches(string $body): void
    {
        $responseContext = $this->decoder->decode($this->client->getResponse()->getContent(), 'json');
        $bodyArray = $this->decoder->decode($body, 'json');

        foreach ($bodyArray as $key => $value) {
            if (\array_key_exists($key, $responseContext) && $responseContext[$key] === $value) {
                continue;
            }

            throw new \Exception('Response body doesn\'t match.');
        }
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

        $this->authenticatedUser = $user;
    }

    private function setAuthenticationHeader(): void
    {
        if ($this->authenticatedUser === null) {
            return;
        }

        $token = $this->jwtTokenManager->create($this->authenticatedUser);

        $this->client->setServerParameter('HTTP_Authorization', sprintf('Bearer %s', $token));
    }

    /**
     * @BeforeScenario @logout
     */
    public function logout(): void
    {
        unset($this->headers['HTTP_Authorization']);
    }
}
