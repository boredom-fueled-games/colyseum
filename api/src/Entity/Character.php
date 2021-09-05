<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\CharacterRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\IdGenerator\UlidGenerator;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[
    ApiResource(
        collectionOperations: [
        'get' => [
            'normalization_context' => ['groups' => 'character:list'],
        ],
        'post' => [
            'normalization_context' => ['groups' => 'character:detail'],
            'denormalization_context' => ['groups' => 'character:create'],
        ],
    ],
        itemOperations: [
        'get' => [
            'normalization_context' => ['groups' => 'character:detail'],
        ],
        'put' => [
            'normalization_context' => ['groups' => 'character:detail'],
            'denormalization_context' => ['groups' => 'character:update'],
        ],
        'patch' => [
            'normalization_context' => ['groups' => 'character:detail'],
            'denormalization_context' => ['groups' => 'character:update'],
        ],
        'delete',
    ],
        mercure: true,
    ),
    ORM\Entity(repositoryClass: CharacterRepository::class),
    ORM\Table(name: 'characters'),
    UniqueEntity('identifier'),
]
class Character
{
    #[
        ORM\Id,
        ORM\Column(type: 'ulid', unique: true),
        ORM\GeneratedValue(strategy: 'CUSTOM'),
        ORM\CustomIdGenerator(class: UlidGenerator::class)
    ]
    private $id;

    #[
        ORM\Column(type: 'string', length: 25),
        Groups([
            'character:detail',
            'character:list',
            'character:create',
            'character:update',
        ]),
        Assert\Length(min: 5, max: 25),
        Assert\NotBlank,
    ]
    private string $identifier;

    #[
        ORM\ManyToOne(targetEntity: User::class, inversedBy: 'characters'),
        Groups([
            'character:detail',
            'character:list',
            'character:create',
        ]),
    ]
    private ?User $user = null;

    #[
        ORM\Column(type: 'integer'),
        Groups([
            'character:detail',
            'character:list',
        ]),
    ]
    private int $level = 1;

    #[
        ORM\Column(type: 'integer'),
        Groups([
            'character:detail',
        ]),
    ]
    private int $experience = 0;

    #[
        ORM\Column(type: 'integer'),
        Groups([
            'character:detail',
            'character:update',
        ]),
    ]
    private int $strength = 10;

    #[
        ORM\Column(type: 'integer'),
        Groups([
            'character:detail',
            'character:update',
        ]),
    ]
    private int $dexterity = 10;

    #[
        ORM\Column(type: 'integer'),
        Groups([
            'character:detail',
            'character:update',
        ]),
    ]
    private int $constitution = 10;

    #[
        ORM\Column(type: 'json', options: ['default' => '[]']),
        Groups([
            'character:detail',
        ]),
    ]
    private array $metadata = [];

    #[
        ORM\ManyToMany(targetEntity: CombatLog::class, mappedBy: 'characters'),
        ORM\JoinTable(name: 'characters_combat_logs'),
        Groups([
            'character:detail',
        ]),
    ]
    private Collection $combatLogs;

    #[
        ORM\OneToMany(mappedBy: 'character', targetEntity: CombatResult::class, cascade: ['persist'], orphanRemoval: true),
        Groups([
            'character:detail',
        ]),
    ]
    private Collection $combatResults;

    public function __construct()
    {
        $this->combatLogs = new ArrayCollection();
        $this->combatResults = new ArrayCollection();
    }

    public function getId(): ?string
    {
        return $this->id;
    }

    public function getIdentifier(): string
    {
        return $this->identifier;
    }

    public function setIdentifier(string $identifier): void
    {
        $this->identifier = $identifier;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): void
    {
        $this->user = $user;
    }

    public function getLevel(): int
    {
        return $this->level;
    }

    public function setLevel(int $level): void
    {
        $this->level = $level;
    }

    public function getExperience(): int
    {
        return $this->experience;
    }

    public function setExperience(int $experience): void
    {
        $this->experience = $experience;
    }

    public function getStrength(): int
    {
        return $this->strength;
    }

    public function setStrength(int $strength): void
    {
        $this->strength = $strength;
    }

    public function getDexterity(): int
    {
        return $this->dexterity;
    }

    public function setDexterity(int $dexterity): void
    {
        $this->dexterity = $dexterity;
    }

    public function getConstitution(): int
    {
        return $this->constitution;
    }

    public function setConstitution(int $constitution): void
    {
        $this->constitution = $constitution;
    }

    public function getMetadata(): array
    {
        return $this->metadata;
    }

    public function setMetadata(array $metadata): void
    {
        $this->metadata = $metadata;
    }

    public function getCombatLogs(): Collection
    {
        return $this->combatLogs;
    }

    public function addCombatLog(CombatLog $combatLog): void
    {
        if ($this->combatLogs->contains($combatLog)) {
            return;
        }

        $this->combatLogs[] = $combatLog;
        $combatLog->addCharacter($this);
    }

    public function removeCombatLog(CombatLog $combatLog): void
    {
        $this->combatLogs->removeElement($combatLog);
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

        if ($combatResult->getCharacter() !== $this) {
            $combatResult->setCharacter($this);
        }
    }

    public function removeCombatResult(CombatResult $combatResult): void
    {
        $this->combatResults->removeElement($combatResult);
    }

    #[Groups([
        'character:detail',
        'character:list',
    ])]
    public function getWins(): int
    {
        return $this->combatResults->filter(function (CombatResult $combatResult) {
            return $combatResult->isWinner();
        })->count();
    }

    #[Groups([
        'character:detail',
        'character:list',
    ])]
    public function getLosses(): int
    {
        return $this->combatResults->filter(function (CombatResult $combatResult) {
            return !$combatResult->isWinner();
        })->count();
    }
}
