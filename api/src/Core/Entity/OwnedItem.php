<?php

namespace App\Core\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\ExistsFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use App\ApiPlatform\Filter\UlidFilter;
use App\Symfony\Constraint\Equipable;
use App\Symfony\Constraint\Purchasable;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\IdGenerator\UlidGenerator;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Ulid;

#[
    ApiResource(
        collectionOperations: [
        'get' => [
            'normalization_context' => ['groups' => 'owned_item:list'],
        ],
        'post' => [
            'normalization_context' => ['groups' => 'owned_item:detail'],
            'denormalization_context' => ['groups' => 'owned_item:create'],
        ],
    ],
        itemOperations: [
        'get' => [
            'normalization_context' => ['groups' => 'owned_item:detail'],
        ],
        'patch' => [
            'normalization_context' => ['groups' => 'owned_item:detail'],
            'denormalization_context' => ['groups' => 'owned_item:update'],
        ],
        'delete',
    ],
        attributes: ['pagination_client_enabled' => true],
    ),
    ApiFilter(ExistsFilter::class, properties: ['character']),
    ApiFilter(UlidFilter::class, properties: ['character']),
    ApiFilter(SearchFilter::class, properties: [
        'item.type' => 'exact',
    ]),
    ORM\Entity,
    ORM\Table(name: 'owned_items'),
    Purchasable,
    Equipable,
]
class OwnedItem
{
    #[
        ORM\Id,
        ORM\Column(type: 'ulid', unique: true),
        ORM\GeneratedValue(strategy: 'CUSTOM'),
        ORM\CustomIdGenerator(class: UlidGenerator::class),
    ]
    private ?Ulid $id = null;

    #[
        ORM\ManyToOne(targetEntity: Item::class, inversedBy: 'ownedItems'),
        ORM\JoinColumn(nullable: false),
        Groups([
            'owned_item:detail',
            'owned_item:list',
            'owned_item:create',
        ]),
    ]
    private ?Item $item = null;

    #[
        ORM\ManyToOne(targetEntity: User::class, inversedBy: 'ownedItems'),
        ORM\JoinColumn(nullable: false),
        Groups([
            'owned_item:detail',
            'owned_item:list',
            'owned_item:create',
        ]),
    ]
    private ?User $user = null;

    #[
        ORM\ManyToOne(targetEntity: Character::class, inversedBy: 'equippedItems'),
        Groups([
            'owned_item:detail',
            'owned_item:list',
            'owned_item:create',
            'owned_item:update',
        ]),
    ]
    private ?Character $character = null;

    #[
        ORM\Column(type: 'integer'),
        Groups([
            'owned_item:detail',
            'owned_item:list',
        ]),
    ]
    private int $durability = 1000;

    public function getId(): ?Ulid
    {
        return $this->id;
    }

    public function getItem(): ?Item
    {
        return $this->item;
    }

    public function setItem(Item $item): void
    {
        $this->setDurability($item->getDurability());
        $this->item = $item;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(User $user): void
    {
        $this->user = $user;
    }

    public function getCharacter(): ?Character
    {
        return $this->character;
    }

    public function setCharacter(?Character $character): void
    {
        $this->character = $character;
    }

    public function getDurability(): int
    {
        return $this->durability;
    }

    public function setDurability(int $durability): void
    {
        $this->durability = $durability;
    }
}
