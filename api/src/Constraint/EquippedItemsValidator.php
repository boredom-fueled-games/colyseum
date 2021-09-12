<?php

declare(strict_types=1);

namespace App\Constraint;

use App\Entity\Character;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

final class EquippedItemsValidator extends ConstraintValidator
{
    public function validate($value, Constraint $constraint)
    {
        if (null === $value || (!$value instanceof Character && !$value instanceof EquippedItems)) {
            return;
        }

        $this->context->addViolation('Character only has a limited amount of body parts.');
    }
}
