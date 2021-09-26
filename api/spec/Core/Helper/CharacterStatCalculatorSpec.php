<?php

declare(strict_types=1);

namespace spec\App\Core\Helper;

use PhpSpec\ObjectBehavior;

final class CharacterStatCalculatorSpec extends ObjectBehavior
{
    public function it_calculates_experience_till_next_level(): void
    {
        // TODO Used the values from http://edmazur.com/bots/experience_list.php
        $this::calculateExperienceTillNextLevel(1)->shouldReturn(50);
        $this::calculateExperienceTillNextLevel(2)->shouldReturn(90);
        $this::calculateExperienceTillNextLevel(5)->shouldReturn(198);
        $this::calculateExperienceTillNextLevel(10)->shouldReturn(734);
        $this::calculateExperienceTillNextLevel(35)->shouldReturn(518052);
        $this::calculateExperienceTillNextLevel(50)->shouldReturn(2164031);
        $this::calculateExperienceTillNextLevel(100)->shouldReturn(176002598);
    }
}
