<?php

namespace App\Command;

use App\Entity\CombatLog;
use App\Helper\CombatRoundHandler;
use App\Repository\CombatLogRepositoryInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(name: 'combat:finish')]
class CombatRoundFinishCommand extends Command
{
    public function __construct(
        private CombatLogRepositoryInterface $combatLogRepository,
        private EntityManagerInterface $entityManager
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $activeCombatLogs = $this->combatLogRepository->findActiveCombatLogs();

        /** @var CombatLog $combatLog */
        foreach ($activeCombatLogs as $combatLog) {
            CombatRoundHandler::finishCombat($combatLog);
            $this->entityManager->persist($combatLog);
        }
        $this->entityManager->flush();

        return Command::SUCCESS;
    }
}
