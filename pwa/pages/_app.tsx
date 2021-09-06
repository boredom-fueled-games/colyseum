// import App from "next/app";
import { fetcher } from 'adapters/axios';
import axios from 'axios';
import MainMenu from 'components/MainMenu';
import UserInfo from 'components/UserInfo';
import { AuthProvider } from 'context/AuthContext';
import type { AppProps /*, AppContext */ } from 'next/app';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useRouter } from 'next/router';
import { createElement, useState } from 'react';
import { RecoilRoot } from 'recoil';
import { SWRConfig } from 'swr';
import { Layout, Menu } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import 'styles/styles.css';
import 'rpg-awesome/css/rpg-awesome.min.css';

function MyApp({Component, pageProps}: AppProps) {
  const [menuCollapsed, setMenuCollapsed] = useState<boolean>(false);
  const {Header, Content, Sider} = Layout;
  const Router = useRouter();

  const handleLogout = async () => {
    await axios.get('/api/logout');
    Router.push('/');
  };

  return (
    <RecoilRoot>
      <SWRConfig value={{fetcher}}>
        <AuthProvider>
          <Layout style={{minHeight: '100vh'}}>
            <Sider trigger={null} collapsible collapsed={menuCollapsed}>
              <UserInfo/>
              <MainMenu/>
            </Sider>
            <Layout className="site-layout">
              <Header className="site-layout-background" style={{padding: 0}}>
                {createElement(menuCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                  className: 'trigger',
                  onClick: () => setMenuCollapsed(!menuCollapsed),
                })}
              </Header>
              <Content
                className="site-layout-background"
                style={{
                  margin: '24px 16px',
                  padding: 24,
                  minHeight: 280,
                }}
              >
                <Component {...pageProps} />
              </Content>
            </Layout>
          </Layout>
          {/*<Component {...pageProps} />*/}
        </AuthProvider>
      </SWRConfig>
    </RecoilRoot>
  );
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext: AppContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);

//   return { ...appProps }
// }

export default MyApp;
