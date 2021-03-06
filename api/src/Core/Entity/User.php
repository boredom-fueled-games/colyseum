<?php

namespace App\Core\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\IdGenerator\UlidGenerator;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Annotation\SerializedName;
use Symfony\Component\Uid\Ulid;
use Symfony\Component\Validator\Constraints as Assert;

#[
    ApiResource(
        collectionOperations: [
        'get' => [
            'normalization_context' => ['groups' => 'user:list'],
        ],
        'post' => [
            'normalization_context' => ['groups' => 'user:detail'],
            'denormalization_context' => ['groups' => 'user:create'],
        ],
    ],
        itemOperations: [
        'get' => [
            'normalization_context' => ['groups' => 'user:detail'],
        ],
        'put' => [
            'normalization_context' => ['groups' => 'user:detail'],
            'denormalization_context' => ['groups' => 'user:update'],
        ],
        'patch' => [
            'normalization_context' => ['groups' => 'user:detail'],
            'denormalization_context' => ['groups' => 'user:update'],
        ],
        'delete',
    ],
        mercure: true,
    ),
    ORM\Entity,
    ORM\Table(name: 'users'),
    UniqueEntity('username'),
]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[
        ORM\Id,
        ORM\Column(type: 'ulid', unique: true),
        ORM\GeneratedValue(strategy: 'CUSTOM'),
        ORM\CustomIdGenerator(class: UlidGenerator::class)
    ]
    private ?Ulid $id = null;

    #[
        ORM\Column(type: 'string', length: 25, unique: true),
        Assert\Length(min: 5, max: 25),
        Assert\NotBlank,
        Groups([
            'user:detail',
            'user:list',
            'user:create',
            'user:update',
        ]),
    ]
    private string $username;

    #[
        ORM\Column(type: 'json'),
        Groups([
            'user:detail',
        ]),
    ]
    private array $roles = [];

    #[
        ORM\Column(type: 'string'),
    ]
    private string $password;

    #[
        SerializedName('password'),
        Assert\Length(min: 10),
        Assert\NotCompromisedPassword,
        Groups([
            'user:create',
            'user:update',
        ]),
    ]
    private ?string $plainPassword = null;

    #[
        ORM\OneToMany(mappedBy: 'user', targetEntity: Character::class),
        Groups([
            'user:detail',
        ]),
        ApiSubresource(maxDepth: 1),
    ]
    private Collection $characters;

    #[
        ORM\Column(type: 'integer', options: ['default' => 0]),
        Groups([
            'user:detail',
        ]),
    ]
    private int $currency = 0;

    #[
        ORM\OneToMany(mappedBy: 'user', targetEntity: OwnedItem::class, orphanRemoval: true),
    ]
    private Collection $ownedItems;

    public function __construct()
    {
        $this->characters = new ArrayCollection();
        $this->ownedItems = new ArrayCollection();
    }

    public function getId(): ?Ulid
    {
        return $this->id;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): self
    {
        $this->username = $username;

        return $this;
    }

    public function getUserIdentifier(): string
    {
        return (string) $this->username;
    }

    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    public function getPlainPassword(): ?string
    {
        return $this->plainPassword;
    }

    public function setPlainPassword(?string $plainPassword): void
    {
        $this->plainPassword = $plainPassword;
    }

    public function getSalt(): ?string
    {
        return null;
    }

    public function eraseCredentials(): void
    {
        if (!$this->plainPassword) {
            return;
        }

        $this->plainPassword = null;
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
        $character->setUser($this);
    }

    public function removeCharacter(Character $character): void
    {
        $this->characters->removeElement($character);
        $character->setUser(null);
    }

    public function getCurrency(): int
    {
        return $this->currency;
    }

    public function setCurrency(int $currency): void
    {
        $this->currency = $currency;
    }

    public function getOwnedItems(): Collection
    {
        return $this->ownedItems;
    }

    public function addOwnedItem(OwnedItem $ownedItem): void
    {
        if (!$this->ownedItems->contains($ownedItem)) {
            $this->ownedItems[] = $ownedItem;
            $ownedItem->setUser($this);
        }
    }

    public function removeOwnedItem(OwnedItem $ownedItem): void
    {
        $this->ownedItems->removeElement($ownedItem);
    }
}
