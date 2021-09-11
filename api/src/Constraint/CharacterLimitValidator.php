<?php

declare(strict_types=1);

namespace App\Constraint;

use App\Entity\Character;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

final class CharacterLimitValidator extends ConstraintValidator
{
    private const MAX_CHARACTER_COUNT = 3;

    public function validate($value, Constraint $constraint)
    {
        if (null === $value || !$value instanceof Character) {
            return;
        }

        if (!$value->getUser() || $value->getUser()->getCharacters()->count() < self::MAX_CHARACTER_COUNT) {
            return;
        }

        $this->context->addViolation('User is already at the max character limit of ' . self::MAX_CHARACTER_COUNT);
    }
}
