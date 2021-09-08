import { Table } from 'antd';
import CharacterList from 'components/CharacterList';
import { useAuth } from 'context/AuthContext';

const CharactersIndex = (): JSX.Element => {
  const {loading, characters} = useAuth();

  const columns = [
    {
      title: 'Name',
      dataIndex: 'identifier',
    },
    {
      title: 'Level',
      dataIndex: 'level'
    },
    {
      title: 'Wins',
      dataIndex: 'wins'
    },
    {
      title: 'Losses',
      dataIndex: 'losses'
    }
  ];
  return (<>
      <CharacterList/>
      <Table
        rowKey="@id"
        dataSource={characters ? characters['hydra:member'] : []}
        loading={loading}
        columns={columns}
        pagination={false}
      />
    </>
  );
};

export default CharactersIndex;
