import { Descriptions } from 'antd';
import { Character } from 'types/Character';
import winRatio from 'utils/winRatio';

const CharacterDetails = ({character}: { character: Character }): JSX.Element => (character ?
  <Descriptions size="small" column={3}>
    <Descriptions.Item label="Identifier">{character.identifier}</Descriptions.Item>
    <Descriptions.Item label="Level">{character.level}</Descriptions.Item>
    <Descriptions.Item label="Experience">{character.experience}</Descriptions.Item>
    <Descriptions.Item label="Wins">{character.wins}</Descriptions.Item>
    <Descriptions.Item label="Losses">{character.losses}</Descriptions.Item>
    <Descriptions.Item label="Ratio">{winRatio(character)}</Descriptions.Item>
    <Descriptions.Item label="Strength">{character.strength}</Descriptions.Item>
    <Descriptions.Item label="Dexterity">{character.dexterity}</Descriptions.Item>
    <Descriptions.Item label="Constitution">{character.constitution}</Descriptions.Item>
  </Descriptions> : null);

export default CharacterDetails;
