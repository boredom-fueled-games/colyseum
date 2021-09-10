<?php

namespace App\Command;

use App\Entity\Character;
use App\Repository\CharacterRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(name: 'character:populate')]
class PopulateCharactersCommand extends Command
{
    private array $characters = [
        [
            Character::IDENTIFIER => 'Infant',
            Character::LEVEL => 1,
            Character::STRENGTH => 5,
            Character::DEXTERITY => 5,
            Character::CONSTITUTION => 5,
        ],
        [
            Character::IDENTIFIER => 'Training buddy',
            Character::LEVEL => 1,
            Character::STRENGTH => 10,
            Character::DEXTERITY => 10,
            Character::CONSTITUTION => 10,
        ],
        [
            Character::IDENTIFIER => 'T50.5',
            Character::LEVEL => 7,
            Character::STRENGTH => 12,
            Character::DEXTERITY => 16,
            Character::CONSTITUTION => 13,
        ],
        [
            Character::IDENTIFIER => 'T101',
            Character::LEVEL => 10,
            Character::STRENGTH => 18,
            Character::DEXTERITY => 15,
            Character::CONSTITUTION => 10,
        ],
        [
            Character::IDENTIFIER => 'T202',
            Character::LEVEL => 20,
            Character::STRENGTH => 30,
            Character::DEXTERITY => 20,
            Character::CONSTITUTION => 15,
        ],
        [
            Character::IDENTIFIER => 'Terminator 2000',
            Character::LEVEL => 30,
            Character::STRENGTH => 30,
            Character::DEXTERITY => 25,
            Character::CONSTITUTION => 30,
        ],
        [
            Character::IDENTIFIER => 'Terminator 2002',
            Character::LEVEL => 45,
            Character::STRENGTH => 60,
            Character::DEXTERITY => 45,
            Character::CONSTITUTION => 40,
        ],
        [
            Character::IDENTIFIER => 'Terminatrix',
            Character::LEVEL => 60,
            Character::STRENGTH => 70,
            Character::DEXTERITY => 50,
            Character::CONSTITUTION => 50,
        ],
    ];

    public function __construct(
        private CharacterRepository $characterRepository,
        private EntityManagerInterface $entityManager
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $this->entityManager
            ->createQuery('DELETE FROM ' . Character::class . ' e WHERE e.user is null')
            ->execute();

        foreach ($this->characters as $characterData) {
            $character = $this->characterRepository->findOneBy(['identifier' => $characterData[Character::IDENTIFIER]]);
            if (!$character) {
                $character = new Character();
            }
            if ($character->getUser() !== null) {
                return Command::FAILURE;
            }

            $character->setIdentifier($characterData[Character::IDENTIFIER]);
            $character->setLevel($characterData[Character::LEVEL]);
            $character->setStrength($characterData[Character::STRENGTH]);
            $character->setDexterity($characterData[Character::DEXTERITY]);
            $character->setConstitution($characterData[Character::CONSTITUTION]);

            $this->entityManager->persist($character);
        }
        $this->entityManager->flush();

        return Command::SUCCESS;
    }
}
