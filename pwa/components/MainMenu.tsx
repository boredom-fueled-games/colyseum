import { UserOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';

interface MenuItem {
  key: string;
  label: string;
  icon: ReactNode;
}

const menuItems: MenuItem[] = [
  {key: '/characters', label: 'Characters', icon: <UserOutlined/>},
  {key: '/combat', label: 'Combat', icon: <i className="ra ra-crossed-swords ra-lg"/>},
  {key: '/combat_logs', label: 'Combat Logs', icon: <i className="ra ra-telescope ra-lg"/>},
];

const MainMenu = (): JSX.Element => {
  const Router = useRouter();
  let count = 0;
  const parts = Router.asPath.split('/');
  const links = parts.map(() => parts.slice(0, ++count).join('/'));
  console.log(links);
  return (
    <Menu theme="dark" mode="inline" defaultSelectedKeys={links}>
      {menuItems.map((menuItem) => (
        <Menu.Item key={menuItem.key} icon={menuItem.icon}>
          <Link href={menuItem.key}>
            {menuItem.label}
          </Link>
        </Menu.Item>
      ))}
    </Menu>
  );
};

export default MainMenu;
