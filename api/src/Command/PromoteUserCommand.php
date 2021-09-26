<?php

namespace App\Command;

use App\Doctrine\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(name: 'user:promote')]
class PromoteUserCommand extends Command
{
    public function __construct(
        private UserRepository $userRepository,
        private EntityManagerInterface $entityManager
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this->addArgument('identifier', InputArgument::REQUIRED, 'User identifier');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $identifier = $input->getArgument('identifier');
        $user = $this->userRepository->find($identifier);
        if (!$user) {
            return Command::FAILURE;
        }

        $user->setRoles(['ROLE_USER', 'ROLE_ADMIN']);
        $this->entityManager->persist($user);

        $this->entityManager->flush();

        return Command::SUCCESS;
    }
}
