import { useAuth } from 'context/AuthContext';
import { useCombatLogs } from 'hooks/combatLogs';
import { Button, Space, Table, Tooltip } from 'antd';
import { useRouter } from 'next/router';
import CombatLog from 'types/CombatLog';

const CombatLogs = (): JSX.Element => {
  const {user} = useAuth();
  const {loading, combatLogs} = useCombatLogs();
  const Router = useRouter();

  const validLogs = loading
    ? []
    : combatLogs['hydra:member'].filter(
      (combatLogs) =>
        user ? combatLogs.characters.some((character => user.characters.indexOf(character))) : true
    ).map((combatLog): CombatLog => ({
      ...combatLog,
      characters: combatLog.combatResults.map((result) => ({identifier: result.characterStats.identifier})),
    }));

  const columns = [
    {
      title: 'Attacker',
      key: 'attacker',
      render: (text, combatLog: CombatLog) => `${combatLog.characters[0].identifier} vs ${combatLog.characters[1].identifier}`
    },
    {
      title: 'actions',
      key: 'actions',
      // eslint-disable-next-line react/display-name
      render: (text, combatLog: CombatLog) => (
        <Space size="middle">
          <Tooltip title="Spectate">
            <Button
              type="primary"
              shape="circle"
              icon={<i className="ra ra-telescope ra-lg"/>}
              onClick={() => Router.push(combatLog['@id'])}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return <Table rowKey="@id" dataSource={validLogs} loading={loading} columns={columns} pagination={false}/>;
};

export default CombatLogs;
