<?php

declare(strict_types=1);

namespace App\Core\Helper;

use App\Core\Entity\Character;
use App\Core\Entity\CombatLog;
use App\Core\Entity\CombatResult;
use App\Core\Entity\CombatRound;
use Doctrine\Common\Collections\Collection;

final class CombatRoundHandler
{
    public static function finishCombat(CombatLog $combatLog): void
    {
        while ($combatLog->getEndedAt() === null) {
            self::handleNextCombatRound($combatLog);
        }
    }

    public static function handleNextCombatRound(CombatLog $combatLog): void
    {
        /** @var CombatRound $previousRound */
        $previousRound = $combatLog->getCombatRounds()->last();
        $currentRound = new CombatRound();
        $combatLog->addCombatRound($currentRound);
        if (!$previousRound instanceof CombatRound) {
            self::HandleFirstRound($currentRound);
        } else {
            $nextRoundDateTime = clone $previousRound->getCreatedAt();
            $nextRoundDateTime->modify('+1 second');
            $currentRound->setCreatedAt($nextRoundDateTime ?? new \DateTime());
            $currentRound->setAttacker($previousRound->getDefender());
            $currentRound->setDefender($previousRound->getAttacker());
            $currentRound->setAttackerStats($previousRound->getDefenderStats());
            $currentRound->setDefenderStats($previousRound->getAttackerStats());
        }

        self::calculateRound($currentRound);

        if ($currentRound->getDefenderStats()[Character::HP] <= 0) {
            self::handleEndOfCombat($currentRound, $combatLog);
        }
    }

    private static function handleFirstRound(CombatRound $firstRound): void
    {
        $firstRound->setCreatedAt(new \DateTime());
        $combatLog = $firstRound->getCombatLog();
        $characters = $combatLog->getCharacters();
        $attacker = self::getNextCharacter($characters);
        $firstRound->setAttacker($attacker);
        $firstRound->setAttackerStats($attacker->getStats()); //TODO use first round
        $defender = self::getNextCharacter($characters, $attacker);
        $firstRound->setDefender($defender);
        $firstRound->setDefenderStats($defender->getStats()); //TODO use first round
    }

    private static function calculateRound(CombatRound $combatRound): void
    {
        $attackerStats = $combatRound->getAttackerStats();
        $defenderStats = $combatRound->getDefenderStats();

        $attackRating = $attackerStats[Character::DEXTERITY] * 2 - 8;
        $defenseRating = $defenderStats[Character::DEXTERITY] / 2;
        $hitChance = max(5, min(95, 100 * $attackRating / ($attackRating + $defenseRating)));

        $attackRoll = random_int(0, 100);
        if ($attackRoll > $hitChance) {
            $combatRound->setEvaded(true);

            return;
        }

        $blockChance = max(5, min(70, 25 * ($defenderStats[Character::DEXTERITY] - 50) / ($defenderStats[Character::LEVEL] * 2)));
        $blockRoll = random_int(0, 100);
        if ($blockRoll <= $blockChance) {
            $combatRound->setBlocked(true);

            return;
        }

        $weaponMinDamage = 1;
        $weaponMaxDamage = 3;
        $strengthModifier = ($attackerStats[Character::STRENGTH] + 100) / 100;

        $minDamage = (int) round($weaponMinDamage * $strengthModifier);
        $maxDamage = (int) round($weaponMaxDamage * $strengthModifier);
        $damage = random_int($minDamage, $maxDamage);
        $combatRound->setDamageDealt($damage);

        $defenderStats[Character::HP] -= $damage;
        $combatRound->setDefenderStats($defenderStats);
    }

    private static function getNextCharacter(Collection $characters, ?Character $currentCharacter = null): Character
    {
        if ($currentCharacter === null) {
            return $characters->first();
        }

        $nextIndex = $characters->indexOf($currentCharacter) + 1;

        if ($nextIndex > $characters->count()) {
            return $characters->first();
        }

        return $characters->get($nextIndex);
    }

    private static function handleEndOfCombat(CombatRound $currentRound, CombatLog $combatLog): void
    {
        $lastDateTime = clone $currentRound->getCreatedAt();
        $lastDateTime->modify('+1 second');
        $combatLog->setEndedAt($lastDateTime);

        $attacker = $currentRound->getAttacker();
        $winnerResults = new CombatResult();
        $winnerResults->setWinner(true);
        $winnerResults->setCharacter($attacker);
        $winnerResults->setCharacterStats($currentRound->getAttackerStats());

        $defender = $currentRound->getDefender();
        $loserResults = new CombatResult();
        $loserResults->setWinner(false);
        $loserResults->setCharacter($defender);
        $loserResults->setCharacterStats($currentRound->getDefenderStats());

        $results = [$winnerResults, $loserResults];
        foreach ($combatLog->getCharacters() as $character) {
            foreach ($results as $combatResult) {
                if ($combatResult->getCharacter() !== $character) {
                    continue;
                }

                $combatLog->addCombatResult($combatResult);
            }
        }

        self::handleExperience($attacker, $defender, $currentRound);
    }

    private static function handleExperience(
        Character $winner,
        Character $loser,
        CombatRound $currentRound
    ): void {
        $winnerStats = $currentRound->getAttackerStats();
        $loserStats = $currentRound->getDefenderStats();

        $winnerLevel = $winnerStats[Character::LEVEL];
        $loserLevel = $loserStats[Character::LEVEL];

        $winnerDamageInflicted = (($loserStats[Character::CONSTITUTION] * 10 + 50) - $loserStats[Character::HP]);
        $loserDamageInflicted = (($winnerStats[Character::CONSTITUTION] * 10 + 50) - $winnerStats[Character::HP]);

        $winnerIntelligence = $winnerStats[Character::INTELLIGENCE];
        $loserIntelligence = $loserStats[Character::INTELLIGENCE];

        $winnerRatio = $winner->getLosses() === 0 ? 25 : $winner->getWins() / $winner->getLosses();
        $loserRatio = $loser->getLosses() === 0 ? 25 : $loser->getWins() / $loser->getLosses();

        $isPvP = $winner->getUser() && $loser->getUser();
        if ($isPvP) {
            $WinnerExperience = (
                $loserLevel * (1 + (5 * ($loserLevel - $winnerLevel)) / $winnerLevel)
                * $winnerDamageInflicted * $winnerIntelligence * $loserRatio / 20
            );
            $winnerStats[Character::EXPERIENCE] = $WinnerExperience;
            $winner->setExperience($winner->getExperience() + (int) round($WinnerExperience));

            $loserExperience = (
                $winnerLevel * (1 + (5 * ($winnerLevel - $loserLevel)) / $loserLevel)
                * $loserDamageInflicted * $loserIntelligence * $winnerRatio / 200
            );
            $loserStats[Character::EXPERIENCE] = $loserExperience;
            $loser->setExperience($loser->getExperience() + (int) round($loserExperience));

            return;
        }

        if ($winner->getUser()) {
            $variable = $winnerLevel > $loserLevel ? 150 : 100;

            //TODO implement experience modifier with bots higher than 300
            $WinnerExperience = ($loserLevel * $winnerDamageInflicted * $winnerIntelligence / $variable);
            $winnerStats[Character::EXPERIENCE] = $WinnerExperience;
            $winner->setExperience($winner->getExperience() + (int) round($WinnerExperience));
        }

        if ($loser->getUser()) {
            $variable = $loserLevel > $winnerLevel ? 300 : 200;

            //TODO implement experience modifier with bots higher than 300
            $loserExperience = ($winnerLevel * $loserDamageInflicted * $loserIntelligence / $variable);
            $loserStats[Character::EXPERIENCE] = $loserExperience;
            $loser->setExperience($loser->getExperience() + (int) round($loserExperience));
        }

        //TODO store winner/loser stats
    }
}
