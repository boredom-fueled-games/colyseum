import { Descriptions, Skeleton } from 'antd';
import { Character } from 'types/Character';
import { winRatio } from 'utils/CharacterCalculator';

const CharacterDetails = ({character}: { character: Character }): JSX.Element => (character ?
  <Descriptions size="small" column={3}>
    <Descriptions.Item label="Identifier">{character.identifier}</Descriptions.Item>
    <Descriptions.Item label="Level">{character.level}</Descriptions.Item>
    <Descriptions.Item label="Experience">
      {`${character.experience}/${character.experienceTillNextLevel} (${Math.round(character.experience / character.experienceTillNextLevel * 100)}%)`}
    </Descriptions.Item>
    <Descriptions.Item label="Wins">{character.wins}</Descriptions.Item>
    <Descriptions.Item label="Losses">{character.losses}</Descriptions.Item>
    <Descriptions.Item label="Ratio">{winRatio(character)}</Descriptions.Item>
    <Descriptions.Item label="Strength">{character.strength}</Descriptions.Item>
    <Descriptions.Item label="Dexterity">{character.dexterity}</Descriptions.Item>
    <Descriptions.Item label="Constitution">{character.constitution}</Descriptions.Item>
  </Descriptions> : <Skeleton active/>);

export default CharacterDetails;
