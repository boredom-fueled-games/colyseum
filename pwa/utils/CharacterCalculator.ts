import { Character } from 'types/Character';

export const winRatio = (character: Character): string => {
  const losses = character.losses || 0;
  if (losses === 0) {
    return 'NaN';
  }

  const wins = character.wins || 0;
  return (Math.round(wins / losses * 100) / 100).toString();
};

const levelScaling = [
  {
    maxLevel: 35,
    scaling: 1.3,
  },
  {
    maxLevel: 80,
    scaling: 1.1,
  },
  {
    maxLevel: 150,
    scaling: 1.08,
  },
  {
    maxLevel: 180,
    scaling: 1.05,
  }
];

const getMultiplierForLevel = (currentLevel: number): number => {
  for (const levelScale of levelScaling) {
    if (currentLevel > levelScale.maxLevel) {
      continue;
    }

    return levelScale.scaling;
  }

  return 1.03;
};


export const experienceTillNextLevel = (currentLevel: number): number => {
  if (currentLevel === 1) {
    return 50;
  }
  let experienceTillNextLevel = 90;
  if (currentLevel === 2) {
    return experienceTillNextLevel;
  }
  const targetLevel = currentLevel + 1;
  let calculatedLevel = 2;
  while (calculatedLevel < targetLevel) {
    ++calculatedLevel;
    experienceTillNextLevel = experienceTillNextLevel * getMultiplierForLevel(calculatedLevel);
  }

  return Math.round(experienceTillNextLevel);
};
