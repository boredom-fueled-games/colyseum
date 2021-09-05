import { Table } from 'antd';
import { useCharacters } from 'hooks/characters';

const CombatIndex = () => {
  const {characters, loading} = useCharacters();

  const columns = [
    {
      title: 'Name',
      dataIndex: 'identifier',
      key: '@id',
    },
  ];

  return <Table rowKey="@id" dataSource={characters ? characters['hydra:member'] : []} loading={loading} columns={columns} />;
};

export default CombatIndex;
