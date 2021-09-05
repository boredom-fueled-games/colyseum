import { Button, Space, Table, Tooltip } from 'antd';
import { useCombatLogs } from 'hooks/combatLogs';
import { Character } from 'types/Character';
import CombatLog from 'types/CombatLog';

const CombatLogs = () => {
  const {loading, combatLogs} = useCombatLogs();

  return (<div>{JSON.stringify(combatLogs)}</div>);
  // const columns = [
  //   {
  //     title: 'Name',
  //     dataIndex: 'identifier',
  //   },
  //   {
  //     title: 'actions',
  //     key: 'actions',
  //     // eslint-disable-next-line react/display-name
  //     render: (text, combatLog: CombatLog) => (
  //       <Space size="middle">
  //         <Tooltip title="Spectate">
  //           <Button
  //             type="primary"
  //             shape="circle"
  //             icon={<i className="ra ra-telescope ra-lg"/>}
  //           />
  //         </Tooltip>
  //       </Space>
  //     ),
  //   },
  // ];
  //
  // return <Table rowKey="@id" dataSource={validCharacters} loading={loading} columns={columns}/>;
};

export default CombatLogs;
