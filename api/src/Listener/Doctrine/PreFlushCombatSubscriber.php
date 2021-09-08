<?php

declare(strict_types=1);

namespace App\Listener\Doctrine;

use App\Entity\CombatLog;
use App\Helper\CombatRoundHandler;
use Doctrine\ORM\Event\PreFlushEventArgs;

final class PreFlushCombatSubscriber
{
    public function preFlush(CombatLog $combatLog, PreFlushEventArgs $args): void
    {
        if ($combatLog->getEndedAt() !== null) {
            return;
        }

        CombatRoundHandler::finishCombat($combatLog);
    }
}
