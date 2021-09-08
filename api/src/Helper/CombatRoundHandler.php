<?php

declare(strict_types=1);

namespace App\Helper;

use App\Entity\Character;
use App\Entity\CombatLog;
use App\Entity\CombatResult;
use App\Entity\CombatRound;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\EntityManagerInterface;

final class CombatRoundHandler
{
    public function __construct(private EntityManagerInterface $entityManager)
    {
    }

    public function handleNextCombatRound(CombatLog $combatLog): void
    {
        /** @var CombatRound $previousRound */
        $previousRound = $combatLog->getCombatRounds()->last();
        $currentRound = new CombatRound();
        $combatLog->addCombatRound($currentRound);
        if (!$previousRound instanceof CombatRound) {
            $this->HandleFirstRound($currentRound);
        } else {
            $currentRound->setAttacker($previousRound->getDefender());
            $currentRound->setDefender($previousRound->getAttacker());
            $currentRound->setAttackerStats($previousRound->getDefenderStats());
            $currentRound->setDefenderStats($previousRound->getAttackerStats());
        }

        self::calculateRound($currentRound);

        if ($currentRound->getDefenderStats()[Character::HP] <= 0) {
            $combatLog->setEndedAt(new \DateTime());

            $winnerResults = new CombatResult();
            $winnerResults->setWinner(true);
            $winnerResults->setCharacter($currentRound->getAttacker());
            $winnerResults->setCharacterStats($currentRound->getAttackerStats());
            $combatLog->addCombatResult($winnerResults);

            $loserResults = new CombatResult();
            $loserResults->setWinner(false);
            $loserResults->setCharacter($currentRound->getDefender());
            $loserResults->setCharacterStats($currentRound->getDefenderStats());
            $combatLog->addCombatResult($loserResults);
        }

        $this->entityManager->persist($combatLog);
        $this->entityManager->flush();
    }

    private function handleFirstRound(CombatRound $firstRound): void
    {
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
}
