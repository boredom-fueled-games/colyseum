<?php

declare(strict_types=1);

namespace App\Symfony\Constraint;

use App\Core\Entity\Character;
use App\Core\Entity\OwnedItem;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

final class EquipableValidator extends ConstraintValidator
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

        $newItemType = null;
        if ($value instanceof OwnedItem) {
            $character = $value->getCharacter();
            $newItemType = $value->getItem()->getType();
        }

        if (!$character) {
            return;
        }

        $containsDoubleItemType = false;
        $types = [];
        /** @var OwnedItem $equippedItem */
        foreach ($character->getEquippedItems() as $equippedItem) {
            $itemType = $equippedItem->getItem()->getType();
            if (\in_array($itemType, $types, true)) {
                $containsDoubleItemType = true;
                $newItemType = $itemType;
                break;
            }

            $types[] = $itemType;
        }

        if (!$containsDoubleItemType
            && (!$value instanceof OwnedItem || !\in_array($newItemType, $types, true))) {
            return;
        }

        $this->context->addViolation('Character has already equipped an item of type "' . $newItemType . '"');
    }
}
