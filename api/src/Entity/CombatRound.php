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
        ORM\Version,
        ORM\Column(type: 'integer')
    ]
    private int $version = 0;

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
            'combatLog:detail',
        ]),
    ]
    private ?Character $attacker = null;

    #[
        ORM\Column(type: 'json', options: ['default' => '[]']),
        Groups([
            'combatRound:detail',
            'combatRound:list',
            'combatLog:detail',
        ]),
    ]
    private array $attackerStats = [];

    #[
        ORM\ManyToOne(targetEntity: Character::class),
        ORM\JoinColumn(nullable: false),
        Groups([
            'combatRound:detail',
            'combatRound:list',
            'combatLog:detail',
        ]),
    ]
    private ?Character $defender = null;

    #[
        ORM\Column(type: 'json', options: ['default' => '[]']),
        Groups([
            'combatRound:detail',
            'combatRound:list',
            'combatLog:detail',
        ]),
    ]
    private array $defenderStats = [];

    #[
        ORM\Column(type: 'boolean'),
        Groups([
            'combatRound:list',
            'combatRound:detail',
            'combatLog:detail',
        ]),
    ]
    private bool $evaded = false;

    #[
        ORM\Column(type: 'boolean'),
        Groups([
            'combatRound:list',
            'combatRound:detail',
            'combatLog:detail',
        ]),
    ]
    private bool $blocked = false;

    #[
        ORM\Column(type: 'integer'),
        Groups([
            'combatRound:list',
            'combatRound:detail',
            'combatLog:detail',
        ]),
    ]
    private int $damageDealt = 0;

    #[
        ORM\Column(type: 'datetime'),
        Groups([
            'combatRound:detail',
            'combatRound:list',
            'combatLog:detail',
        ]),
    ]
    private ?\DateTimeInterface $createdAt = null;

    public function getVersion(): int
    {
        return $this->version;
    }

    public function getId(): ?string
    {
        return $this->id;
    }

    public function getCombatLog(): ?CombatLog
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

    public function isEvaded(): bool
    {
        return $this->evaded;
    }

    public function setEvaded(bool $evaded): void
    {
        $this->evaded = $evaded;
    }

    public function isBlocked(): bool
    {
        return $this->blocked;
    }

    public function setBlocked(bool $blocked): void
    {
        $this->blocked = $blocked;
    }

    public function getDamageDealt(): int
    {
        return $this->damageDealt;
    }

    public function setDamageDealt(int $damageDealt): void
    {
        $this->damageDealt = $damageDealt;
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
