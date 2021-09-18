import { UserOutlined } from '@ant-design/icons';
import { Button, Space, Table, Tooltip } from 'antd';
import { useAuth } from 'context/AuthContext';
import { Character } from 'types/Character';
import Link from 'next/link';

const CharacterOverview = (): JSX.Element => {
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
    },
    {
      title: '',
      key: 'actions',
      render: (text: unknown, character: Character) => {
        return (
          <Space size="middle">
            <Link passHref={true} href={`${character['@id']}/combat_logs`}>
              <Tooltip title="Activate">
                <Button
                  type="primary"
                  shape="circle"
                  icon={<UserOutlined/>}
                />
              </Tooltip>
            </Link>
          </Space>
        );
      }
    }
  ];
  return (
    <Table
      rowKey="@id"
      dataSource={characters ? characters['hydra:member'] : []}
      loading={loading}
      columns={columns}
      pagination={false}
    />
  );
};

export default CharacterOverview;
