import { Avatar, Card, Menu, Skeleton, Dropdown, Tooltip } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import useMe from 'hooks/auth';
import { useCharacters } from 'hooks/characters';
import { cloneElement } from 'react';
import { Character } from 'types/Character';

const {Meta} = Card;

function handleButtonClick(e) {
  console.log('click left button', e);
}

const UserInfo = () => {
  const {loading, user} = useMe();
  const {characters} = useCharacters();
  const username = user ? user.username : null;

  const activeCharacter: Character = !characters
    ? null
    : characters['hydra:member']
      .filter((character) => character.user === user['@id'])[0];

  const handleMenuClick = ({key}: { key: string }) => console.log('TODO:', key); //TODO

  if (!characters || !activeCharacter) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Card>
        <Skeleton loading={loading} title={true} paragraph={false}>
          <Meta
            avatar={
              <Avatar icon={<UserOutlined/>}/>
            }
            title={username}
          />
        </Skeleton>
      </Card>
      <Dropdown.Button
        overlay={
          <Menu onClick={handleMenuClick}>
            {!characters
              ? null
              : characters['hydra:member']
                .filter((character) => character.user === user['@id'])
                .map((character) => (
                  <Menu.Item key={character['@id']} icon={<UserOutlined/>} disabled={character === activeCharacter}>
                    {character.identifier}
                  </Menu.Item>
                ))}
          </Menu>
        }
        buttonsRender={([leftButton, rightButton]) => [
          <Tooltip title="tooltip" key="leftButton">
            {leftButton}
          </Tooltip>,
          cloneElement(rightButton, {loading}),
        ]}
      >
        {activeCharacter.identifier}
      </Dropdown.Button>
    </>
  );
};

export default UserInfo;
