import { Affix, Menu } from 'antd';
import { useActiveCharacter } from 'context/ActiveCharacterContext';
import Link from 'next/link';
import { useRouter } from 'next/router';

const CharacterMenu = (): JSX.Element => {
  const {activeCharacter} = useActiveCharacter();

  const Router = useRouter();
  const path = Router.asPath;
  const parts = path === '/' ? [''] : path.split('/');
  const links = parts.map((path) => '/' + path);

  console.log(links[links.length - 1]);

  return (
    <Affix>
      <Menu theme="light" defaultSelectedKeys={[links[links.length - 1]]} mode="horizontal">
        <Menu.Item key={activeCharacter && activeCharacter['@id'] ? '/' + activeCharacter['@id'].split('/')[2] : ''}>
          <Link passHref={true} href={activeCharacter && activeCharacter['@id'] ? activeCharacter['@id'] : '/'}>
            <><i className="ra ra-player ra-lg"/> Character</>
          </Link>
        </Menu.Item>
        <Menu.Item key="/combat_logs">
          <Link passHref={true} href={activeCharacter ? activeCharacter['@id'] + '/combat_logs' : '/combat_logs'}>
            <span><i className="ra ra-scroll-unfurled ra-lg"/> Combat logs</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="/equipment">
          <Link passHref={true} href={activeCharacter ? activeCharacter['@id'] + '/equipment' : '/equipment'}>
            <span><i className="ra ra-vest ra-lg"/> Equipment</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="/shop">
          <Link passHref={true} href={activeCharacter ? activeCharacter['@id'] + '/shop' : '/shop'}>
            <span><i className="ra ra-forging ra-lg"/> Shop</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="/combat">
          <Link passHref={true} href={activeCharacter ? activeCharacter['@id'] + '/combat' : '/combat'}>
            <span><i className="ra ra-crossed-swords ra-lg"/> Combat</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="/training">
          <Link passHref={true} href={activeCharacter ? activeCharacter['@id'] + '/training' : '/training'}>
            <span><i className="ra ra-muscle-up ra-lg"/> Training</span>
          </Link>
        </Menu.Item>
      </Menu>
    </Affix>
  );
};

export default CharacterMenu;
