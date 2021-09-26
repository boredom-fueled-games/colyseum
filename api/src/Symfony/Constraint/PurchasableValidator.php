<?php

declare(strict_types=1);

namespace App\Symfony\Constraint;

use App\Core\Entity\OwnedItem;
use App\Core\Entity\User;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

final class PurchasableValidator extends ConstraintValidator
{
    public function __construct(private Security $security)
    {
    }

    public function validate($value, Constraint $constraint)
    {
        if (null === $value) {
            return;
        }

        if (!$value instanceof OwnedItem || $value->getId()) {
            return;
        }

        /** @var User|null $user */
        $user = $this->security->getUser();
        if ($this->security->isGranted('ROLE_ADMIN') || null === $user) {
            return;
        }

        if ($user->getCurrency() >= $value->getItem()->getPrice()) {
            return;
        }

        $this->context->addViolation('You don\'t have enough money to purchase this item.');
    }
}
