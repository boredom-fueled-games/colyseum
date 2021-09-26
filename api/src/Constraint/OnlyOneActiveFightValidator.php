<?php

declare(strict_types=1);

namespace App\Constraint;

use App\Doctrine\Repository\CombatLogRepository;
use App\Entity\CombatLog;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

final class OnlyOneActiveFightValidator extends ConstraintValidator
{
    public function __construct(private CombatLogRepository $combatLogRepository)
    {
    }

    public function validate($value, Constraint $constraint)
    {
        if (null === $value || !$value instanceof CombatLog) {
            return;
        }

        $activeCombatLogs = $this->combatLogRepository->findActiveCombatLogs($value->getCharacters()[0]);
        if (!$activeCombatLogs) {
            return;
        }
        $this->context->addViolation('A character can only participate in one fight at a time.');
    }
}
