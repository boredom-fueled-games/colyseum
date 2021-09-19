import { Descriptions, Skeleton } from 'antd';
import { useActiveCharacter } from 'context/ActiveCharacterContext';
import { winRatio } from 'utils/CharacterCalculator';

type CharacterDetailsProps = {
  showStats?: boolean
};

const CharacterDetails = ({showStats}: CharacterDetailsProps = {showStats: false}): JSX.Element => {
  const {activeCharacter} = useActiveCharacter();
  if (!activeCharacter) {
    return <Skeleton active/>;
  }

  return (
    <Descriptions size="small" column={3}>
      <Descriptions.Item label="Identifier">{activeCharacter.identifier}</Descriptions.Item>
      <Descriptions.Item label="Level">{activeCharacter.level}</Descriptions.Item>
      <Descriptions.Item label="Experience">
        {`${activeCharacter.experience}/${activeCharacter.experienceTillNextLevel} (${
          activeCharacter.experience && activeCharacter.experienceTillNextLevel
            ? Math.round(activeCharacter.experience / activeCharacter.experienceTillNextLevel * 100) : 0
        }%)`}
      </Descriptions.Item>
      <Descriptions.Item label="Wins">{activeCharacter.wins}</Descriptions.Item>
      <Descriptions.Item label="Losses">{activeCharacter.losses}</Descriptions.Item>
      <Descriptions.Item label="Ratio">{winRatio(activeCharacter)}</Descriptions.Item>
      {showStats ? (
        <>
          <Descriptions.Item label="Strength">{activeCharacter.strength}</Descriptions.Item>
          <Descriptions.Item label="Dexterity">{activeCharacter.dexterity}</Descriptions.Item>
          <Descriptions.Item label="Constitution">{activeCharacter.constitution}</Descriptions.Item>
        </>
      ) : null}
    </Descriptions>
  );
};

export default CharacterDetails;
