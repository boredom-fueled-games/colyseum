import { Character } from 'types/Character';

const winRatio = (character: Character): string => {
  const losses = character.losses || 0;
  if (losses === 0) {
    return 'NaN';
  }

  const wins = character.wins || 0;
  return (Math.round(wins / losses * 100) / 100).toString();
};

export default winRatio;
