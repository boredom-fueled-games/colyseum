import { Space } from 'antd';
import StatsDisplay from 'components/Characters/StatsDisplay';
import { useActiveCharacter } from 'context/ActiveCharacterContext';
import { Character } from 'types/Character';
import { CharacterStats } from 'types/Stats';

const calculateHp = ({constitution}: CharacterStats | Character) => constitution * 10 + 50;
const calculateDamage = (weaponDamage: number, {strength}: CharacterStats | Character) => Math.round(weaponDamage * (strength + 100) / 100);
const calculateAttackRating = ({dexterity}: CharacterStats | Character) => Math.round(dexterity * 2 - 8);
const calculateDefenseRating = ({dexterity}: CharacterStats | Character) => Math.round(dexterity / 2);
const calculateBlockChance = ({dexterity}: CharacterStats | Character) => 5;
const calculateArmorRating = ({dexterity}: CharacterStats | Character) => 0;
const calculateAbsorbRating = ({dexterity}: CharacterStats | Character) => 0;

const SecondaryCharacterStats = (): JSX.Element => {
  const {activeCharacter, stats} = useActiveCharacter();

  const minimalDamage = 1;
  const maximalDamage = 3;

  return activeCharacter ? (
    <>
      <Space direction="vertical">
        <StatsDisplay
          key="hp"
          title="Max HP"
          value={calculateHp(stats)}
          characterValue={calculateHp(activeCharacter)}
          newValue={calculateHp(stats)}
        />
        <StatsDisplay
          key="weapon"
          title="Weapon Damage"
          value={`${calculateDamage(minimalDamage, stats)} - ${calculateDamage(maximalDamage, stats)}`}
          characterValue={calculateDamage(minimalDamage, activeCharacter) + calculateDamage(maximalDamage, activeCharacter)}
          newValue={calculateDamage(minimalDamage, stats) + calculateDamage(maximalDamage, stats)}
        />
        <StatsDisplay
          key="attack"
          title="Attack Rating"
          value={calculateAttackRating(stats)}
          characterValue={calculateAttackRating(activeCharacter)}
          newValue={calculateAttackRating(stats)}
        />
      </Space>
      <Space direction="vertical">
        <StatsDisplay
          key="armor"
          title="Armor Rating"
          value={calculateArmorRating(stats)}
          characterValue={calculateArmorRating(activeCharacter)}
          newValue={calculateArmorRating(stats)}
        />
        <StatsDisplay
          key="absorb"
          title="Absorb Rating"
          value={`${calculateAbsorbRating(stats)}%`}
          characterValue={calculateAbsorbRating(activeCharacter)}
          newValue={calculateAbsorbRating(stats)}
        />
        <StatsDisplay
          key="defense"
          title="Defense Rating"
          value={calculateDefenseRating(stats)}
          characterValue={calculateDefenseRating(activeCharacter)}
          newValue={calculateDefenseRating(stats)}
        />
        <StatsDisplay
          key="block"
          title="Block Chance"
          value={`${calculateBlockChance(stats)}%`}
          characterValue={calculateBlockChance(activeCharacter)}
          newValue={calculateBlockChance(stats)}
        />
      </Space>
    </>
  ) : null;
};

export default SecondaryCharacterStats;
