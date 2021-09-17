import axios from 'adapters/axios';
import { Button, Space, Table, Tooltip } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Character } from 'types/Character';
import CombatLog from 'types/CombatLog';

type CombatOverviewProps = {
  activeCharacter: Character
  validTargets: Character[]
  loading: boolean
  training?: boolean
}

const CombatOverview = ({
                          validTargets,
                          activeCharacter,
                          loading,
                          training = false
                        }: CombatOverviewProps): JSX.Element => {
  const Router = useRouter();
  const [target, setTarget] = useState<Character>(null);

  const attackTarget = async (newTarget: Character) => {
    if (newTarget === activeCharacter) {
      return;
    }

    setTarget(newTarget);
    const response = await axios.post<CombatLog>('/api/proxy/combat_logs', {
      characters: [
        activeCharacter['@id'],
        newTarget['@id'],
      ],
      startedAt: 'now',
    });
    //TODO preload
    Router.push(activeCharacter['@id'] + response.data['@id']);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'identifier',
      training: true,
    },
    {
      title: 'Lvl',
      dataIndex: 'level',
      training: true,
    },
    {
      title: 'Wins',
      dataIndex: 'wins',
      training: false,
    },
    {
      title: 'Losses',
      dataIndex: 'losses',
      training: false,
    },
    {
      title: 'Ratio',
      key: 'ratio',
      training: false,
      render: (text, character: Character) => {
        const losses = character.losses || 0;
        if (losses === 0) {
          return 'NaN';
        }

        const wins = character.wins || 0;
        return Math.round(wins / losses * 100) / 100;
      },
    },
    {
      title: 'actions',
      key: 'actions',
      training: true,
      // eslint-disable-next-line react/display-name
      render: (text, character: Character) => (
        <Space size="middle">
          <Tooltip title={`Attack ${character.identifier}`}>
            <Button
              type="primary"
              shape="circle"
              icon={<i className="ra ra-crossed-swords ra-lg"/>}
              loading={(target !== null && target['@id'] === character['@id'])}
              disabled={(target !== null && target['@id'] !== character['@id'])}
              onClick={() => attackTarget(character)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ].filter((column) => training ? column.training : true);

  return <Table rowKey="@id" dataSource={validTargets} loading={loading} columns={columns} pagination={false}/>;
};

export default CombatOverview;
