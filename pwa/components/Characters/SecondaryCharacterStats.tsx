import { Space } from 'antd';
import InfoDisplay from 'components/Characters/InfoDisplay';
import { useActiveCharacter } from 'context/ActiveCharacterContext';
import { Character } from 'types/Character';
import { CharacterStats } from 'types/Stats';

const calculateHp = ({constitution = 10}: CharacterStats | Character) => constitution * 10 + 50;
const calculateDamage = (weaponDamage: number, {strength = 10}: CharacterStats | Character) => Math.round(weaponDamage * (strength + 100) / 100);
const calculateAttackRating = ({dexterity = 10}: CharacterStats | Character) => Math.round(dexterity * 2 - 8);
const calculateDefenseRating = ({dexterity = 10}: CharacterStats | Character) => Math.round(dexterity / 2);
const calculateBlockChance = ({dexterity}: CharacterStats | Character) => 5;
const calculateArmorRating = ({dexterity}: CharacterStats | Character) => 0;
const calculateAbsorbRating = ({dexterity}: CharacterStats | Character) => 0;

const SecondaryCharacterStats = (): JSX.Element | null => {
  const {activeCharacter, stats} = useActiveCharacter();

  const minimalDamage = 1;
  const maximalDamage = 3;

  return activeCharacter && stats ? (
    <>
      <Space direction="vertical">
        <InfoDisplay
          key="hp"
          title="Max HP"
          value={calculateHp(stats)}
          characterValue={calculateHp(activeCharacter)}
          newValue={calculateHp(stats)}
        />
        <InfoDisplay
          key="weapon"
          title="Weapon Damage"
          value={`${calculateDamage(minimalDamage, stats)} - ${calculateDamage(maximalDamage, stats)}`}
          characterValue={calculateDamage(minimalDamage, activeCharacter) + calculateDamage(maximalDamage, activeCharacter)}
          newValue={calculateDamage(minimalDamage, stats) + calculateDamage(maximalDamage, stats)}
        />
        <InfoDisplay
          key="attack"
          title="Attack Rating"
          value={calculateAttackRating(stats)}
          characterValue={calculateAttackRating(activeCharacter)}
          newValue={calculateAttackRating(stats)}
        />
      </Space>
      <Space direction="vertical">
        <InfoDisplay
          key="armor"
          title="Armor Rating"
          value={calculateArmorRating(stats)}
          characterValue={calculateArmorRating(activeCharacter)}
          newValue={calculateArmorRating(stats)}
        />
        <InfoDisplay
          key="absorb"
          title="Absorb Rating"
          value={`${calculateAbsorbRating(stats)}%`}
          characterValue={calculateAbsorbRating(activeCharacter)}
          newValue={calculateAbsorbRating(stats)}
        />
        <InfoDisplay
          key="defense"
          title="Defense Rating"
          value={calculateDefenseRating(stats)}
          characterValue={calculateDefenseRating(activeCharacter)}
          newValue={calculateDefenseRating(stats)}
        />
        <InfoDisplay
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
