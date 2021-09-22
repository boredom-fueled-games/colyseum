import { Row, Skeleton, Space } from 'antd';
import InfoDisplay from 'components/Characters/InfoDisplay';
import { useActiveCharacter } from 'context/ActiveCharacterContext';
import { winRatio } from 'utils/CharacterCalculator';

const CharacterDetails = (): JSX.Element => {
  const {activeCharacter} = useActiveCharacter();
  if (!activeCharacter) {
    return <Skeleton active/>;
  }

  return (
    <Row>
      <Space direction="vertical">
        <Space>
          <InfoDisplay title="Identifier" value={activeCharacter.identifier} />
          <InfoDisplay title="Level" value={activeCharacter.level} />
          <InfoDisplay title="Experience" value={`${activeCharacter.experience}/${activeCharacter.experienceTillNextLevel} (${
            activeCharacter.experience && activeCharacter.experienceTillNextLevel
              ? Math.round(activeCharacter.experience / activeCharacter.experienceTillNextLevel * 100) : 0
          }%)`} />
        </Space>
        <Space>
          <InfoDisplay title="Wins" value={activeCharacter.wins} />
          <InfoDisplay title="Losses" value={activeCharacter.losses} />
          <InfoDisplay title="Ratio" value={winRatio(activeCharacter)} />
        </Space>
      </Space>
    </Row>
  );
};

export default CharacterDetails;
