<?php

declare(strict_types=1);

namespace App\Tests\Context;

use ApiPlatform\Core\Api\IriConverterInterface;
use Behat\Gherkin\Node\TableNode;
use Doctrine\Persistence\ManagerRegistry;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\BrowserKit\AbstractBrowser;
use Symfony\Component\Serializer\Encoder\DecoderInterface;
use Symfony\Component\Serializer\Encoder\EncoderInterface;
use Webmozart\Assert\Assert;

final class ApiPlatformContext extends AuthenticationContext
{
    private array $content = [];
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
     * @When the request content is:
     */
    public function theRequestContentIs(string $content): void
    {
        $this->content = $this->decoder->decode($content, 'json');
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
     * @When a :method request is send to the iri of entity with class :entityClassName:
     */
    public function aRequestIsSendToTheIriOfEntityWithClass(string $method, string $entityClassName, string $jsonQuery): void
    {
        $entity = $this->getEntity($entityClassName, $jsonQuery);
        Assert::notNull($entityClassName, 'No entity found matching the query.');

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
        Assert::greaterThanEq($matchingRecords, $iterator->count(), 'Response didn\'t contain everything.');
    }

    /**
     * @Then entities in the response content should all have these fields:
     */
    public function entitiesInTheResponseContentShouldAllTheseFields(TableNode $table): void
    {
        $content = $this->decoder->decode($this->client->getResponse()->getContent(), 'json');
        $records = $content['hydra:member'] ?? null;
        Assert::notNull($records);

        $rows = $table->getRows();
        foreach ($records as $record) {
            foreach ($rows as $row) {
                Assert::keyExists($record, $row[0]);
            }
        }
    }

    /**
     * @Then the response content should be JSON
     */
    public function theResponseContentShouldBeJson(): void
    {
        try {
            $this->decoder->decode($this->client->getResponse()->getContent(), 'json');
        } catch (\throwable $exception) {
            throw new \Exception('Response didn\'t contain valid JSON');
        }
    }

    /**
     * @Then the response content should be empty
     */
    public function theResponseContentShouldBeEmpty(): void
    {
        Assert::eq($this->client->getResponse()->getContent(), '');
    }

    /**
     * @Then the response content matches:
     */
    public function theResponseContentMatches(string $content): void
    {
        $responseContext = $this->decoder->decode($this->client->getResponse()->getContent(), 'json');
        $contentArray = $this->decoder->decode($content, 'json');

        $this->matches($contentArray, $responseContext);
    }

    /**
     * @Then the response content should not contain the field :fieldName
     */
    public function theResponseContentShouldNotContainTheField(string $fieldName): void
    {
        $responseContext = $this->decoder->decode($this->client->getResponse()->getContent(), 'json');

        Assert::keyNotExists($responseContext, $fieldName);
    }

    /**
     * @Then the response content should contain the field :fieldName
     */
    public function theResponseContentShouldContainTheField(string $fieldName): void
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
            $this->encoder->encode($this->content, 'json')
        );

        $this->content = [];
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
