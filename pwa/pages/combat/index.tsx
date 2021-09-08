import axios from 'adapters/axios';
import { Button, Space, Table, Tooltip } from 'antd';
import { useAuth } from 'context/AuthContext';
import { useCharacters } from 'hooks/characters';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Character } from 'types/Character';
import CombatLog from 'types/CombatLog';

const CombatIndex = (): JSX.Element => {
  const [target, setTarget] = useState<Character>(null);
  const {user} = useAuth();
  const {characters, loading} = useCharacters();
  const Router = useRouter();

  const activeCharacter: Character = !user || !characters
    ? null
    : characters['hydra:member']
      .filter((character) => character.user === user['@id'])[0];


  const validTargets = !characters ? [] : characters['hydra:member'].filter((character) => character !== activeCharacter);

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
    Router.push(response.data['@id']);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'identifier',
    },
    {
      title: 'Wins',
      dataIndex: 'wins'
    },
    {
      title: 'Losses',
      dataIndex: 'losses'
    },
    {
      title: 'Ratio',
      key: 'ratio',
      render: (text, character: Character) => {
        const losses = character.losses || 0;
        if (losses === 0) {
          return 'NaN';
        }

        const wins = character.wins || 0;
        return wins / losses;
      },
    },
    {
      title: 'actions',
      key: 'actions',
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
  ];

  return <Table rowKey="@id" dataSource={validTargets} loading={loading}
                columns={columns} pagination={false}/>;
};

export default CombatIndex;
