import { Affix, Menu, Layout, Tooltip, Button, Drawer, Space } from 'antd';
import axios from 'axios';
import { useActiveCharacter } from 'context/ActiveCharacterContext';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { SettingFilled } from '@ant-design/icons';
import { useState } from 'react';

const {Header} = Layout;
const {SubMenu} = Menu;

const CharacterMenu = (): JSX.Element => {
  const {activeCharacter} = useActiveCharacter();
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const Router = useRouter();
  const path = Router.asPath;
  const parts = path === '/' ? [''] : path.split('/');
  const links = parts.map((path) => '/' + path);

  const handleMenuClick = async ({key}: { key: string }) => {
    if (key === '/settings' || !activeCharacter || !activeCharacter['@id']) {
      return;
    }

    const url = activeCharacter['@id'] + key;
    if (url === path) {
      return;
    }

    Router.push(url);
  };

  const handleLogout = async () => {
    await axios.get('/api/logout');
    Router.push('/login');
  };

  return (<>
    <Affix>
      <Header>
        <Link passHref={true} href="/">
          <Button className="logo" shape="circle" type="text" icon={<i className="ra ra-arena ra-2x"/>}/>
        </Link>
        <Menu theme="light" defaultSelectedKeys={[path, links[links.length - 1]]} mode="horizontal"
              onClick={handleMenuClick}>
          {activeCharacter && activeCharacter['@id'] ?
            <>
              <SubMenu
                key={activeCharacter['@id']}
                title={<Link passHref={true} href={activeCharacter['@id']}>
                  <><i className="ra ra-player ra-lg"/> {activeCharacter.identifier}</>
                </Link>}
                onTitleClick={() => handleMenuClick({key: ''})}
              >
                <Menu.Item key="/equipment">
                  <Link passHref={true} href={activeCharacter['@id'] + '/equipment'}>
                    <span><i className="ra ra-vest ra-lg"/> Equipment</span>
                  </Link>
                </Menu.Item>
              </SubMenu>
              <SubMenu
                key="/combat"
                title={<Link passHref={true} href={activeCharacter['@id'] + '/combat'}>
                  <><i className="ra ra-crossed-swords ra-lg"/> Combat</>
                </Link>}
                onTitleClick={() => handleMenuClick({key: '/combat'})}
              >
                <Menu.Item key="/training">
                  <Link passHref={true} href={activeCharacter['@id'] + '/training'}>
                    <span><i className="ra ra-muscle-up ra-lg"/> Training</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="/combat_logs">
                  <Link passHref={true} href={activeCharacter['@id'] + '/combat_logs'}>
                    <span><i className="ra ra-scroll-unfurled ra-lg"/> Combat logs</span>
                  </Link>
                </Menu.Item>
              </SubMenu>
              <Menu.Item key="/shop">
                <Link passHref={true} href={activeCharacter['@id'] + '/shop'}>
                  <span><i className="ra ra-forging ra-lg"/> Shop</span>
                </Link>
              </Menu.Item>
            </>
            : null}
          <Menu.Item
            key="/settings"
            onClick={() => setShowSettings(true)}
            style={{marginLeft: 'auto'}}
          >
            <Tooltip title="Show settings"><SettingFilled style={{fontSize: 22}}/><span
              className="settings">Settings</span></Tooltip>
          </Menu.Item>
        </Menu>
      </Header>
    </Affix>
    <Drawer
      title="Settings"
      placement="top"
      visible={showSettings}
      footer={
        <Space>
          <Button danger onClick={handleLogout}>Logout</Button>
        </Space>
      }
      onClose={() => setShowSettings(false)}
    >
      TODO
    </Drawer>
  </>);
};

export default CharacterMenu;
