<?php

declare(strict_types=1);

namespace App\Helper;

final class CharacterStatCalculator
{
    private const LEVEL_SCALING_MODIFIERS = [
        35 => 1.3,
        80 => 1.1,
        150 => 1.08,
        180 => 1.05,
    ];

    public static function calculateExperienceTillNextLevel(int $currentLevel): int
    {
        if ($currentLevel === 1) {
            return 50;
        }

        $experienceTillNextLevel = 90;
        $baseLevel = 2;
        while ($baseLevel < $currentLevel) {
            ++$baseLevel;
            $experienceTillNextLevel = $experienceTillNextLevel * self::getMultiplierForLevel($baseLevel);
        }

        return (int) round($experienceTillNextLevel);
    }

    private static function getMultiplierForLevel(int $level): float
    {
        foreach (self::LEVEL_SCALING_MODIFIERS as $maxLevel => $modifier) {
            if ($level > $maxLevel) {
                continue;
            }

            return $modifier;
        }

        return 1.03;
    }
}
