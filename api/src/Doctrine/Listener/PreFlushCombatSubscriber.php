<?php

declare(strict_types=1);

namespace App\Doctrine\Listener;

use App\Core\Entity\CombatLog;
use App\Core\Helper\CombatRoundHandler;
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
