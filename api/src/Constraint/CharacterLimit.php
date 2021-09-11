<?php

declare(strict_types=1);

namespace App\Constraint;

use Attribute;
use Symfony\Component\Validator\Constraint;

#[Attribute]
final class CharacterLimit extends Constraint
{
    public function getTargets(): string
    {
        return self::CLASS_CONSTRAINT;
    }
}
