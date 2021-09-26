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
     * Header has to follow the FastCGI request format:
     * https://symfony.com/doc/current/components/browser_kit.html#custom-header-handling
     *
     * @When the :header header is set to :value
     */
    public function theHeaderIsSetTo(string $header, string $value): void
    {
        $this->headers[$header] = $value;
    }

    /**
     * @When a :method request is send to :path
     */
    public function aRequestIsSendTo(string $method, string $path): void
    {
        $this->sendRequest($method, $path);
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

        $this->sendRequest($method, $content['@id']);
    }

    /**
     * @When a :method request is send to the iri of entity with class :entityClassName:
     */
    public function aRequestIsSendToTheIriOf(string $method, string $entityClassName, string $jsonQuery): void
    {
        $entity = $this->getEntity($entityClassName, $jsonQuery);
        if (!$entity) {
            throw new \Exception('No entity found matching the query');
        }

        $this->sendRequest($method, $this->iriConverter->getIriFromItem($entity));
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

        /** @var \ArrayIterator $iterator */
        $iterator = $table->getIterator();
        if ($matchingRecords < $iterator->count()) {
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
     * @Then the response should be empty
     */
    public function theResponseShouldBeEmpty(): void
    {
        Assert::eq($this->client->getResponse()->getContent(), '');
    }

    /**
     * @Then the response body matches:
     */
    public function theResponseBodyMatches(string $body): void
    {
        $responseContext = $this->decoder->decode($this->client->getResponse()->getContent(), 'json');
        $bodyArray = $this->decoder->decode($body, 'json');

        $this->matches($bodyArray, $responseContext);
    }

    /**
     * @Then the response body should not contain the field :fieldName
     */
    public function theResponseBodyShouldNotContain(string $fieldName): void
    {
        $responseContext = $this->decoder->decode($this->client->getResponse()->getContent(), 'json');

        Assert::keyNotExists($responseContext, $fieldName);
    }

    /**
     * @Then the response body should contain the field :fieldName
     */
    public function theResponseBodyShouldContain(string $fieldName): void
    {
        $responseContext = $this->decoder->decode($this->client->getResponse()->getContent(), 'json');

        Assert::keyExists($responseContext, $fieldName);
    }

    /**
     * @Then no entity with class :entityClassName should exist:
     */
    public function noEntityWithClassShouldExist(string $entityClassName, string $jsonQuery): void
    {
        $entity = $this->getEntity($entityClassName, $jsonQuery);
        Assert::null($entity);
    }

    /**
     * @Then an entity with class :entityClassName should exist:
     */
    public function anEntityWithClassShouldExist(string $entityClassName, string $jsonQuery): void
    {
        $entity = $this->getEntity($entityClassName, $jsonQuery);
        Assert::notNull($entity);
    }

    private function sendRequest(string $method, string $path): void
    {
        $this->client->request(
            $method,
            $path,
            [],
            [],
            $this->headers,
            $this->encoder->encode($this->body, 'json')
        );

        $this->body = [];
    }

    private function getEntity(string $className, string $jsonQuery): ?object
    {
        $query = $this->decoder->decode($jsonQuery, 'json');
        $repository = $this->doctrine->getRepository($className);

        return $repository->findOneBy($query);
    }

    private function matches(array $matchTemplate, array $data): void
    {
        foreach ($matchTemplate as $key => $value) {
            Assert::keyExists($data, $key);
            if (\is_array($value) && \is_array($data[$key])) {
                $this->matches($value, $data[$key]);
                continue;
            }

            Assert::eq($data[$key], $value);
        }
    }
}
