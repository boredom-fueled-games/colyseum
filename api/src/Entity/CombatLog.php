<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use App\Constraint\OnlyOneActiveFight;
use App\Filter\UlidFilter;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\IdGenerator\UlidGenerator;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Ulid;

#[
    ApiResource(
        collectionOperations: [
        'get' => [
            'normalization_context' => ['groups' => 'combatLog:list'],
        ],
        'post' => [
            'normalization_context' => ['groups' => 'combatLog:detail'],
            'denormalization_context' => ['groups' => 'combatLog:create'],
        ],
    ],
        itemOperations: [
        'get' => [
            'normalization_context' => ['groups' => 'combatLog:detail'],
        ],
        'put' => [
            'normalization_context' => ['groups' => 'combatLog:detail'],
            'denormalization_context' => ['groups' => 'combatLog:update'],
        ],
        'patch' => [
            'normalization_context' => ['groups' => 'combatLog:detail'],
            'denormalization_context' => ['groups' => 'combatLog:update'],
        ],
        'delete',
    ],
        subresourceOperations: [
        'api_characters_combat_logs_get_subresource' => [
            'method' => 'GET',
            'normalization_context' => [
                'groups' => ['combatLog:detail'],
            ],
        ],
    ],
        mercure: true,
    ),
    ApiFilter(OrderFilter::class, properties: ['startedAt' => 'DESC']),
    ORM\Entity,
    ORM\Table(name: 'combat_logs'),
    OnlyOneActiveFight
]
class CombatLog
{
    #[
        ORM\Id,
        ORM\Column(type: 'ulid', unique: true),
        ORM\GeneratedValue(strategy: 'CUSTOM'),
        ORM\CustomIdGenerator(class: UlidGenerator::class)
    ]
    private ?Ulid $id = null;

    #[
        ORM\ManyToMany(targetEntity: Character::class, inversedBy: 'combatLogs'),
        ORM\JoinTable(name: 'characters_combat_logs'),
        Groups([
            'combatLog:detail',
            'combatLog:list',
            'combatLog:create',
            'combatLog:update',
        ]),
        ApiFilter(filterClass: UlidFilter::class, strategy: 'exact')
    ]
    private Collection $characters;

    #[
        ORM\OneToMany(mappedBy: 'combatLog', targetEntity: CombatRound::class, cascade: ['persist'], orphanRemoval: true),
        Groups([
            'combatLog:detail',
        ]),
    ]
    private Collection $combatRounds;

    #[
        ORM\OneToMany(mappedBy: 'combatLog', targetEntity: CombatResult::class, cascade: ['persist'], orphanRemoval: true),
        Groups([
            'combatLog:detail',
            'combatLog:list',
        ]),
    ]
    private Collection $combatResults;

    #[
        ORM\Column(type: 'datetime', nullable: true),
        Groups([
            'combatLog:detail',
            'combatLog:list',
            'combatLog:create',
            'combatLog:update',
        ]),
    ]
    private ?\DateTimeInterface $startedAt = null;

    #[
        ORM\Column(type: 'datetime', nullable: true),
        Groups([
            'combatLog:detail',
            'combatLog:list',
        ]),
    ]
    private ?\DateTimeInterface $endedAt = null;

    public function __construct()
    {
        $this->characters = new ArrayCollection();
        $this->combatRounds = new ArrayCollection();
        $this->combatResults = new ArrayCollection();
    }

    public function getId(): ?Ulid
    {
        return $this->id;
    }

    public function getCharacters(): Collection
    {
        return $this->characters;
    }

    public function addCharacter(Character $character): void
    {
        if ($this->characters->contains($character)) {
            return;
        }

        $this->characters[] = $character;
        $character->addCombatLog($this);
    }

    public function removeCharacter(Character $character): void
    {
        $this->characters->removeElement($character);
        $character->removeCombatLog($this);
    }

    public function getCombatRounds(): Collection
    {
        return $this->combatRounds;
    }

    public function addCombatRound(CombatRound $combatRound): void
    {
        if ($this->combatRounds->contains($combatRound)) {
            return;
        }

        $this->combatRounds[] = $combatRound;

        if ($combatRound->getCombatLog() !== $this) {
            $combatRound->setCombatLog($this);
        }
    }

    public function removeCombatRound(CombatRound $combatRound): void
    {
        $this->combatRounds->removeElement($combatRound);
    }

    public function getCombatResults(): Collection
    {
        return $this->combatResults;
    }

    public function addCombatResult(CombatResult $combatResult): void
    {
        if ($this->combatResults->contains($combatResult)) {
            return;
        }

        $this->combatResults[] = $combatResult;

        if ($combatResult->getCombatLog() !== $this) {
            $combatResult->setCombatLog($this);
        }
    }

    public function removeCombatResult(CombatResult $combatResult): void
    {
        $this->combatResults->removeElement($combatResult);
    }

    public function getStartedAt(): ?\DateTimeInterface
    {
        return $this->startedAt;
    }

    public function setStartedAt(?\DateTimeInterface $startedAt): void
    {
        $this->startedAt = $startedAt;
    }

    public function getEndedAt(): ?\DateTimeInterface
    {
        return $this->endedAt;
    }

    public function setEndedAt(?\DateTimeInterface $endedAt): void
    {
        $this->endedAt = $endedAt;
    }
}
