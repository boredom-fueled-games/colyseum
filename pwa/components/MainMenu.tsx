import { BankOutlined, UserOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface MenuItem {
  key: string;
  label: string;
}

const menuItems: MenuItem[] = [
  {key: '/characters', label: 'Characters'},
  {key: '/combat', label: 'Combat'},
];

const MainMenu = () => {
  const Router = useRouter();
  return (
    <Menu theme="dark" mode="inline" defaultSelectedKeys={[Router.asPath]}>
      {menuItems.map((menuItem) => (
        <Menu.Item key={menuItem.key} icon={<UserOutlined/>}>
          <Link href={menuItem.key}>
            {menuItem.label}
          </Link>
        </Menu.Item>
      ))}
    </Menu>
  );
};

export default MainMenu;
