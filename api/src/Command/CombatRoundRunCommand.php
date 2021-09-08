<?php

namespace App\Command;

use App\Entity\CombatLog;
use App\Helper\CombatRoundHandler;
use App\Repository\CombatLogRepository;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(name: 'combat:run')]
class CombatRoundRunCommand extends Command
{
    public function __construct(private CombatLogRepository $combatLogRepository, private CombatRoundHandler $combatRoundHandler)
    {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $activeCombatLogs = $this->combatLogRepository->findActiveCombatLogs();

        /** @var CombatLog $combatLog */
        foreach ($activeCombatLogs as $combatLog) {
            $this->combatRoundHandler->handleNextCombatRound($combatLog);
        }

        return Command::SUCCESS;
    }
}
