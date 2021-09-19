import { Button, Divider, Input, Space, Typography } from 'antd';
import StatsDisplay from 'components/Characters/StatsDisplay';
import { useActiveCharacter } from 'context/ActiveCharacterContext';
import { Dispatch, useEffect } from 'react';
import { Character } from 'types/Character';
import { MinusOutlined, PlusOutlined, } from '@ant-design/icons';
import { Stats, StatTypes } from 'types/Stats';
import { ChangeCharacterStatsAction, CharacterStats } from 'types/Stats';
import capitalize from 'utils/capitalize';

const {Text} = Typography;

type StatInputProps = {
  type: Stats,
  stats: CharacterStats,
  character: Character,
  changeStats: Dispatch<ChangeCharacterStatsAction>
};
const StatInput = ({type, stats, character, changeStats}: StatInputProps): JSX.Element => (
  <StatsDisplay
    title={capitalize(type)}
    value={
      <>
        <Button
          shape="circle"
          disabled={!character || stats[type] <= (character[type] || 0)}
          icon={<MinusOutlined/>}
          onClick={() => changeStats({type, value: stats[type] - 1, character})}
        />
        <Input
          bordered={false}
          value={stats[type]}
          defaultValue={character ? character[type] : 0}
          min={character ? character[type] : 0}
          max={stats[type] + stats.free}
          maxLength={3}
          onChange={
            (event) => changeStats({type, value: event.target.value, character})
          }
          style={{width: 26, textAlign: 'center', paddingLeft: 0, paddingRight: 0}}
        />
        <Button
          shape="circle"
          disabled={stats.free <= 0}
          icon={<PlusOutlined/>}
          onClick={() => changeStats({type, value: stats[type] + 1, character})}
        />
      </>
    }
  />
);

const PrimaryCharacterStats = (): JSX.Element | null => {
  const {stats, changeStats, activeCharacter: character, saveCharacter} = useActiveCharacter();
  useEffect(() => {
    if (!character) {
      return;
    }
    changeStats({type: 'character', character});
  }, [changeStats, character]);

  return character && stats ? (
    <Space direction="vertical">
      {StatTypes.map((type) => (
        <StatInput
          key={type}
          type={type}
          stats={stats}
          character={character}
          changeStats={changeStats}
        />
      ))}
      <Space size={12}>
        <Divider><Text type="secondary">Remaining Stats: {stats.free}</Text></Divider>
        <Button type="primary" disabled={!stats.changed} onClick={saveCharacter}>
          Save
        </Button>
        <Button
          danger
          onClick={() => changeStats({type: 'character', character})}
          disabled={!stats.changed}
        >
          Reset
        </Button>
      </Space>
    </Space>
  ) : null;
};

export default PrimaryCharacterStats;
