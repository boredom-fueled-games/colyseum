<?php

declare(strict_types=1);

namespace App\Tests\Context;

use ApiPlatform\Core\Api\IriConverterInterface;
use App\Entity\User;
use Behat\Gherkin\Node\TableNode;
use Doctrine\Persistence\ManagerRegistry;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\BrowserKit\AbstractBrowser;
use Symfony\Component\Serializer\Encoder\DecoderInterface;
use Symfony\Component\Serializer\Encoder\EncoderInterface;
use Webmozart\Assert\Assert;

final class ApiPlatformContext extends AuthenticationContext
{
    private array $body = [];
    private array $headers = [
        'CONTENT_TYPE' => 'application/json',
    ];

    public function __construct(
        JWTTokenManagerInterface $jwtTokenManager,
        private ManagerRegistry $doctrine,
        private AbstractBrowser $client,
        private DecoderInterface $decoder,
        private EncoderInterface $encoder,
        private IriConverterInterface $iriConverter,
    ) {
        parent::__construct($this->doctrine, $this->client, $jwtTokenManager);
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
     * @When I send a :method request to the iri of entity with class :entityClassName:
     */
    public function iSendARequestToTheIriOf(string $method, string $entityClassName, string $json): void
    {
        $query = $this->decoder->decode($json, 'json');
        $repository = $this->doctrine->getRepository($entityClassName);
        if (!$repository) {
            throw new \Exception('No repository found matching the entity class');
        }

        $entity = $repository->findOneBy($query);
        if (!$entity) {
            throw new \Exception('No entity found matching the query');
        }

        $this->iSendARequestTo($method, $this->iriConverter->getIriFromItem($entity));
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
        $records = $content['hydra:member'] ?? null;
        if ($records === null) {
            throw new \Exception('Response does not contain a collection');
        }

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
}
