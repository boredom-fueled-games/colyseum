<?php

declare(strict_types=1);

namespace App\Symfony\Constraint;

use Attribute;
use Symfony\Component\Validator\Constraint;

#[Attribute]
final class OnlyOneActiveFight extends Constraint
{
    public function getTargets(): string
    {
        return self::CLASS_CONSTRAINT;
    }
}
