import { useCombatLogs } from 'hooks/combatLogs';
import { Button, Space, Table, Tooltip } from 'antd';
import { useRouter } from 'next/router';
import { Character } from 'types/Character';
import CombatLog from 'types/CombatLog';

type CombatLogsOverviewProps = {
  character?: Character
}

const CombatLogsOverview = ({character}: CombatLogsOverviewProps): JSX.Element => {
  const {combatLogs} = useCombatLogs(character);
  const Router = useRouter();

  const validLogs = combatLogs && combatLogs['hydra:member']
    ? combatLogs['hydra:member'].map((combatLog): CombatLog => ({
      ...combatLog,
      characters: combatLog.combatResults.map((result) => ({identifier: result.characterStats.identifier})),
    })) : [];

  const columns = [
    {
      title: 'Combatants',
      key: 'attacker',
      render: (text: unknown, combatLog: CombatLog) => `${combatLog && combatLog.characters && combatLog.characters[0] && combatLog.characters[0].identifier ? combatLog.characters[0].identifier : ''} vs ${combatLog && combatLog.characters && combatLog.characters[1] && combatLog.characters[1].identifier ? combatLog.characters[1].identifier : ''}`
    },
    {
      title: 'Started at',
      dataIndex: 'startedAt',
      render: (date: string) => {
        const dateTime = new Date(date);
        return `${dateTime.toLocaleTimeString()} ${dateTime.toLocaleDateString()}`;
      }
    },
    {
      title: 'Ended at',
      dataIndex: 'endedAt',
      render: (date: string) => {
        const dateTime = new Date(date);
        return `${dateTime.toLocaleTimeString()} ${dateTime.toLocaleDateString()}`;
      }
    },
    {
      title: 'actions',
      key: 'actions',
      // eslint-disable-next-line react/display-name
      render: (text: unknown, combatLog: CombatLog) => (
        <Space size="middle">
          <Tooltip title="Spectate">
            <Button
              type="primary"
              shape="circle"
              icon={<i className="ra ra-telescope ra-lg"/>}
              onClick={() => character ? Router.push(character['@id'] + combatLog['@id']) : null}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return <Table rowKey="@id" dataSource={validLogs} loading={!combatLogs}
                columns={columns} pagination={false}/>;
};

export default CombatLogsOverview;
