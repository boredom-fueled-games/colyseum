<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\CombatRoundRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\IdGenerator\UlidGenerator;
use Symfony\Component\Serializer\Annotation\Groups;

#[
    ApiResource(
        collectionOperations: [
        'get' => [
            'normalization_context' => ['groups' => 'combatRound:list'],
        ],
    ],
        itemOperations: [
        'get' => [
            'normalization_context' => ['groups' => 'combatRound:detail'],
        ],
    ],
        mercure: true,
    ),
    ORM\Entity(repositoryClass: CombatRoundRepository::class),
    ORM\Table(name: 'combat_rounds'),
    ORM\HasLifecycleCallbacks,
]
class CombatRound
{
    #[
        ORM\Id,
        ORM\Column(type: 'ulid', unique: true),
        ORM\GeneratedValue(strategy: 'CUSTOM'),
        ORM\CustomIdGenerator(class: UlidGenerator::class)
    ]
    private $id;

    #[
        ORM\ManyToOne(targetEntity: CombatLog::class, inversedBy: 'combatRounds'),
        ORM\JoinColumn(nullable: false),
        Groups([
            'combatRound:list',
            'combatRound:detail',
        ]),
    ]
    private ?CombatLog $combatLog = null;

    #[
        ORM\ManyToOne(targetEntity: Character::class),
        ORM\JoinColumn(nullable: false),
        Groups([
            'combatRound:detail',
            'combatRound:list',
        ]),
    ]
    private ?Character $attacker = null;

    #[
        ORM\Column(type: 'json', options: ['default' => '[]']),
        Groups([
            'combatRound:detail',
            'combatRound:list',
        ]),
    ]
    private array $attackerStats = [];

    #[
        ORM\ManyToOne(targetEntity: Character::class),
        ORM\JoinColumn(nullable: false),
        Groups([
            'combatRound:detail',
            'combatRound:list',
        ]),
    ]
    private ?Character $defender = null;

    #[
        ORM\Column(type: 'json', options: ['default' => '[]']),
        Groups([
            'combatRound:detail',
            'combatRound:list',
        ]),
    ]
    private array $defenderStats = [];

    #[
        ORM\Column(type: 'json', options: ['default' => '[]']),
        Groups([
            'combatRound:detail',
            'combatRound:list',
        ]),
    ]
    private array $roundResult = [];

    #[
        ORM\Column(type: 'datetime'),
        Groups([
            'combatRound:detail',
            'combatRound:list',
        ]),
    ]
    private ?\DateTimeInterface $createdAt = null;

    public function getId(): ?string
    {
        return $this->id;
    }

    public function getCombatLog(): CombatLog
    {
        return $this->combatLog;
    }

    public function setCombatLog(CombatLog $combatLog): void
    {
        $this->combatLog = $combatLog;
    }

    public function getAttacker(): Character
    {
        return $this->attacker;
    }

    public function setAttacker(Character $attacker): void
    {
        $this->attacker = $attacker;
    }

    public function getAttackerStats(): array
    {
        return $this->attackerStats;
    }

    public function setAttackerStats(array $attackerStats): void
    {
        $this->attackerStats = $attackerStats;
    }

    public function getDefender(): Character
    {
        return $this->defender;
    }

    public function setDefender(Character $defender): void
    {
        $this->defender = $defender;
    }

    public function getDefenderStats(): array
    {
        return $this->defenderStats;
    }

    public function setDefenderStats(array $defenderStats): void
    {
        $this->defenderStats = $defenderStats;
    }

    public function getRoundResult(): array
    {
        return $this->roundResult;
    }

    public function setRoundResult(array $roundResult): void
    {
        $this->roundResult = $roundResult;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    #[ORM\PrePersist]
    public function setCreatedAt(): void
    {
        if ($this->getCreatedAt() !== null) {
            return;
        }

        $this->createdAt = new \DateTime();
    }
}
