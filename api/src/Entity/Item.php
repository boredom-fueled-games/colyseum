<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use App\Doctrine\Repository\ItemRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\IdGenerator\UlidGenerator;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Ulid;

#[
    ApiResource(
        collectionOperations: [
        'get' => [
            'normalization_context' => ['groups' => 'item:list'],
        ],
    ],
        itemOperations: [
        'get' => [
            'normalization_context' => ['groups' => 'item:detail'],
        ],
    ],
        attributes: ['pagination_client_enabled' => true],
    ),
    ApiFilter(SearchFilter::class, properties: ['type' => 'exact']),
    ORM\Entity(repositoryClass: ItemRepository::class),
    ORM\Table(name: 'items'),
    UniqueEntity('identifier'),
]
class Item
{
    public const WEAPON_TYPE = 'weapon';
    public const SHIELD_TYPE = 'shield';
    public const HELMET_TYPE = 'helmet';
    public const BODY_TYPE = 'body';
    public const GLOVES_TYPE = 'gloves';
    public const BOOTS_TYPE = 'boots';
    public const TYPES = [
        self::WEAPON_TYPE,
        self::SHIELD_TYPE,
        self::HELMET_TYPE,
        self::BODY_TYPE,
        self::GLOVES_TYPE,
        self::BOOTS_TYPE,
    ];

    #[
        ORM\Id,
        ORM\Column(type: 'ulid', unique: true),
        ORM\GeneratedValue(strategy: 'CUSTOM'),
        ORM\CustomIdGenerator(class: UlidGenerator::class),
    ]
    private ?Ulid $id = null;

    #[
        ORM\Column(type: 'string', length: 30),
        Groups([
            'item:detail',
            'item:list',
            'owned_item:detail',
            'owned_item:list',
        ]),
    ]
    private string $identifier;

    #[
        ORM\Column(type: 'string', length: 10),
        Groups([
            'item:detail',
            'item:list',
            'owned_item:detail',
            'owned_item:list',
        ]),
    ]
    private string $type;

    #[
        ORM\Column(type: 'integer'),
        Groups([
            'item:detail',
            'item:list',
            'owned_item:detail',
            'owned_item:list',
        ]),
    ]
    private int $price = 0;

    #[
        ORM\Column(type: 'integer'),
        Groups([
            'item:detail',
            'item:list',
            'owned_item:detail',
            'owned_item:list',
        ]),
    ]
    private int $durability = 1000;

    #[
        ORM\Column(type: 'integer'),
        Groups([
            'item:detail',
            'item:list',
            'owned_item:detail',
            'owned_item:list',
        ]),
    ]
    private int $defense = 0;

    #[
        ORM\Column(type: 'integer'),
        Groups([
            'item:detail',
            'item:list',
            'owned_item:detail',
            'owned_item:list',
        ]),
    ]
    private int $minimalDamage = 0;

    #[
        ORM\Column(type: 'integer'),
        Groups([
            'item:detail',
            'item:list',
            'owned_item:detail',
            'owned_item:list',
        ]),
    ]
    private int $maximalDamage = 0;

    #[
        ORM\Column(type: 'integer'),
        Groups([
            'item:detail',
            'item:list',
            'owned_item:detail',
            'owned_item:list',
        ]),
    ]
    private int $blockChance = 0;

    #[
        ORM\Column(type: 'integer'),
        Groups([
            'item:detail',
            'item:list',
            'owned_item:detail',
            'owned_item:list',
        ]),
    ]
    private int $requiredStrength = 0;

    #[
        ORM\Column(type: 'integer'),
        Groups([
            'item:detail',
            'item:list',
            'owned_item:detail',
            'owned_item:list',
        ]),
    ]
    private int $requiredDexterity = 0;

    #[
        ORM\Column(type: 'integer'),
        Groups([
            'item:detail',
            'item:list',
            'owned_item:detail',
            'owned_item:list',
        ]),
    ]
    private int $addedStrength = 0;

    #[
        ORM\Column(type: 'integer'),
        Groups([
            'item:detail',
            'item:list',
            'owned_item:detail',
            'owned_item:list',
        ]),
    ]
    private int $addedDexterity = 0;

    #[
        ORM\Column(type: 'integer'),
        Groups([
            'item:detail',
            'item:list',
            'owned_item:detail',
            'owned_item:list',
        ]),
    ]
    private int $addedConstitution = 0;

    #[
        ORM\Column(type: 'integer'),
        Groups([
            'item:detail',
            'item:list',
            'owned_item:detail',
            'owned_item:list',
        ]),
    ]
    private int $addedIntelligence = 0;

    #[
        ORM\OneToMany(mappedBy: 'item', targetEntity: OwnedItem::class, orphanRemoval: true),
    ]
    private Collection $ownedItems;

    public function __construct()
    {
        $this->ownedItems = new ArrayCollection();
    }

    public function getId(): ?Ulid
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

    public function getType(): string
    {
        return $this->type;
    }

    public function setType(string $type): void
    {
        if (!\in_array($type, self::TYPES, true)) {
            throw new \UnexpectedValueException('Invalid item type');
        }

        $this->type = $type;
    }

    public function getPrice(): int
    {
        return $this->price;
    }

    public function setPrice(int $price): void
    {
        $this->price = $price;
    }

    public function getDurability(): int
    {
        return $this->durability;
    }

    public function setDurability(int $durability): void
    {
        $this->durability = $durability;
    }

    public function getDefense(): int
    {
        return $this->defense;
    }

    public function setDefense(int $defense): void
    {
        $this->defense = $defense;
    }

    public function getMinimalDamage(): int
    {
        return $this->minimalDamage;
    }

    public function setMinimalDamage(int $minimalDamage): void
    {
        $this->minimalDamage = $minimalDamage;
    }

    public function getMaximalDamage(): int
    {
        return $this->maximalDamage;
    }

    public function setMaximalDamage(int $maximalDamage): void
    {
        $this->maximalDamage = $maximalDamage;
    }

    public function getBlockChance(): int
    {
        return $this->blockChance;
    }

    public function setBlockChance(int $blockChance): void
    {
        $this->blockChance = $blockChance;
    }

    public function getRequiredStrength(): int
    {
        return $this->requiredStrength;
    }

    public function setRequiredStrength(int $requiredStrength): void
    {
        $this->requiredStrength = $requiredStrength;
    }

    public function getRequiredDexterity(): int
    {
        return $this->requiredDexterity;
    }

    public function setRequiredDexterity(int $requiredDexterity): void
    {
        $this->requiredDexterity = $requiredDexterity;
    }

    public function getAddedStrength(): int
    {
        return $this->addedStrength;
    }

    public function setAddedStrength(int $addedStrength): void
    {
        $this->addedStrength = $addedStrength;
    }

    public function getAddedDexterity(): int
    {
        return $this->addedDexterity;
    }

    public function setAddedDexterity(int $addedDexterity): void
    {
        $this->addedDexterity = $addedDexterity;
    }

    public function getAddedConstitution(): int
    {
        return $this->addedConstitution;
    }

    public function setAddedConstitution(int $addedConstitution): void
    {
        $this->addedConstitution = $addedConstitution;
    }

    public function getAddedIntelligence(): int
    {
        return $this->addedIntelligence;
    }

    public function setAddedIntelligence(int $addedIntelligence): void
    {
        $this->addedIntelligence = $addedIntelligence;
    }

    public function getOwnedItems(): Collection
    {
        return $this->ownedItems;
    }

    public function addOwnedItem(OwnedItem $ownedItem): void
    {
        if (!$this->ownedItems->contains($ownedItem)) {
            $this->ownedItems[] = $ownedItem;
            $ownedItem->setItem($this);
        }
    }

    public function removeOwnedItem(OwnedItem $ownedItem): void
    {
        $this->ownedItems->removeElement($ownedItem);
    }
}
