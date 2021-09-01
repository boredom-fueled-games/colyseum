<?php

declare(strict_types=1);

namespace App\Tests\Context;

use App\Entity\User;
use Behat\Gherkin\Node\TableNode;
use Doctrine\Persistence\ManagerRegistry;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\BrowserKit\AbstractBrowser;
use Symfony\Component\Serializer\Encoder\DecoderInterface;
use Webmozart\Assert\Assert;

final class ApiPlatformContext extends FeatureContext
{
    public function __construct(
        ManagerRegistry $doctrine,
        JWTTokenManagerInterface $jwtManager,
        private AbstractBrowser $client,
        private DecoderInterface $decoder,
    ) {
        parent::__construct($doctrine, $jwtManager);
    }

    /**
     * @When I send a :method request to :path
     */
    public function iSendARequestTo(string $method, string $path): void
    {
        $this->client->request($method, $path, [], [], $this->headers);
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
     * @Then the response should contain a collection
     */
    public function theResponseShouldContainACollection(): void
    {
        $content = $this->decoder->decode($this->client->getResponse()->getContent(), 'json');

        if (\in_array('hydra:member', $content, true)) {
            throw new \Exception("Response didn't contain a collection");
        }
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
            throw new \Exception("Response didn't contain everything");
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
     * @Given the following :entity exist:
     */
    public function theFollowingEntityExist(string $entity, TableNode $table): void
    {
        foreach ($table as $row) {
            switch ($entity) {
                case 'users':
                case 'user':
                    $user = new User();
                    $user->setUsername($row['username']);
                    $user->setPassword($row['password']);
                    $this->manager->persist($user);
            }
        }
        $this->manager->flush();
    }
}
