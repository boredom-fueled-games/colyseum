<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\IdGenerator\UlidGenerator;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Ulid;

#[
    ApiResource(
        collectionOperations: [
        'get' => [
            'normalization_context' => ['groups' => 'combatResult:list'],
        ],
    ],
        itemOperations: [
        'get' => [
            'normalization_context' => ['groups' => 'combatResult:detail'],
        ],
    ],
    ),
    ORM\Entity,
    ORM\Table(name: 'combat_results'),
]
class CombatResult
{
    #[
        ORM\Id,
        ORM\Column(type: 'ulid', unique: true),
        ORM\GeneratedValue(strategy: 'CUSTOM'),
        ORM\CustomIdGenerator(class: UlidGenerator::class)
    ]
    private ?Ulid $id = null;

    #[
        ORM\ManyToOne(targetEntity: Character::class, inversedBy: 'combatResults'),
        ORM\JoinColumn(nullable: false),
        Groups([
            'combatResult:list',
            'combatResult:detail',
        ]),
    ]
    private ?Character $character = null;

    #[
        ORM\Column(type: 'json', options: ['default' => '[]']),
        Groups([
            'combatResult:detail',
            'combatLog:detail',
            'combatLog:list',
        ]),
    ]
    private array $characterStats = [];

    #[
        ORM\ManyToOne(targetEntity: CombatLog::class, inversedBy: 'combatResults'),
        ORM\JoinColumn(nullable: false),
        Groups([
            'combatResult:list',
            'combatResult:detail',
        ]),
    ]
    private ?CombatLog $combatLog = null;

    #[
        ORM\Column(type: 'boolean'),
        Groups([
            'combatResult:list',
            'combatResult:detail',
            'combatLog:detail',
            'combatLog:list',
        ]),
    ]
    private bool $winner = false;

    public function getId(): ?Ulid
    {
        return $this->id;
    }

    public function getCharacter(): ?Character
    {
        return $this->character;
    }

    public function setCharacter(Character $character): void
    {
        $this->character = $character;
    }

    public function getCharacterStats(): array
    {
        return $this->characterStats;
    }

    public function setCharacterStats(array $characterStats): void
    {
        $this->characterStats = $characterStats;
    }

    public function getCombatLog(): ?CombatLog
    {
        return $this->combatLog;
    }

    public function setCombatLog(CombatLog $combatLog): void
    {
        $this->combatLog = $combatLog;
    }

    public function isWinner(): bool
    {
        return $this->winner;
    }

    public function setWinner(bool $winner): void
    {
        $this->winner = $winner;
    }
}
