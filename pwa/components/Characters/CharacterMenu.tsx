import { Affix, Menu, Layout } from 'antd';
import { useActiveCharacter } from 'context/ActiveCharacterContext';
import Link from 'next/link';
import { useRouter } from 'next/router';

const {Header} = Layout;

const CharacterMenu = (): JSX.Element => {
  const {activeCharacter} = useActiveCharacter();

  const Router = useRouter();
  const path = Router.asPath;
  const parts = path === '/' ? [''] : path.split('/');
  const links = parts.map((path) => '/' + path);

  return (
    <Affix>
      <Header>
        <Menu theme="light" defaultSelectedKeys={[links[links.length - 1]]} mode="horizontal">
          {activeCharacter && activeCharacter['@id'] ?
            <>
              <Menu.Item
                key={'/' + activeCharacter['@id'].split('/')[2]}
                onClick={() => Router.push(activeCharacter['@id'] as string)}
              >
                <Link passHref={true} href={activeCharacter['@id']}>
                  <span><i className="ra ra-player ra-lg"/> Character</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="/combat_logs" onClick={() => Router.push(activeCharacter['@id'] + '/combat_logs')}>
                <Link passHref={true} href={activeCharacter['@id'] + '/combat_logs'}>
                  <span><i className="ra ra-scroll-unfurled ra-lg"/> Combat logs</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="/equipment" onClick={() => Router.push(activeCharacter['@id'] + '/equipment')}>
                <Link passHref={true} href={activeCharacter['@id'] + '/equipment'}>
                  <span><i className="ra ra-vest ra-lg"/> Equipment</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="/shop" onClick={() => Router.push(activeCharacter['@id'] + '/shop')}>
                <Link passHref={true} href={activeCharacter['@id'] + '/shop'}>
                  <span><i className="ra ra-forging ra-lg"/> Shop</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="/combat" onClick={() => Router.push(activeCharacter['@id'] + '/combat')}>
                <Link passHref={true} href={activeCharacter['@id'] + '/combat'}>
                  <span><i className="ra ra-crossed-swords ra-lg"/> Combat</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="/training" onClick={() => Router.push(activeCharacter['@id'] + '/training')}>
                <Link passHref={true} href={activeCharacter['@id'] + '/training'}>
                  <span><i className="ra ra-muscle-up ra-lg"/> Training</span>
                </Link>
              </Menu.Item>
            </>
            : null}
        </Menu>
      </Header>
    </Affix>
  );
};

export default CharacterMenu;
