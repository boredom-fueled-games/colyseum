<?php

declare(strict_types=1);

namespace App\Constraint;

use App\Entity\Character;
use App\Entity\OwnedItem;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

final class EquippedItemsValidator extends ConstraintValidator
{
    public function validate($value, Constraint $constraint)
    {
        if (null === $value) {
            return;
        }

        $character = null;
        if ($value instanceof Character) {
            $character = $value;
        }

        if ($value instanceof OwnedItem) {
            $character = $value->getCharacter();
        }

        if (!$character) {
            return;
        }

        $containsDoubleItemType = false;
        $types = [];
        /** @var OwnedItem $equippedItem */
        foreach ($character->getEquippedItems() as $equippedItem) {
            $itemType = $equippedItem->getItem()->getType();
            if (\in_array($itemType, $types)) {
                $containsDoubleItemType = true;
                break;
            }

            $types[] = $itemType;
        }

        if (!$containsDoubleItemType) {
            return;
        }

        $this->context->addViolation('Character only has a limited amount of body parts.');
    }
}
