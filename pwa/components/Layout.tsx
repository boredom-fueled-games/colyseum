import { PageHeader, Layout as AntdLayout, Button, Skeleton, Row, Col, Affix } from 'antd';
import axios from 'axios';
import Breadcrumbs from 'components/Breadcrumbs';
import CharacterMenu from 'components/Characters/CharacterMenu';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';

const {Header} = AntdLayout;

type LayoutProps = {
  children: ReactNode
  title: string,
  subtitle?: string
  loading?: boolean
  headerContent?: ReactNode
  onBack?: () => void
  disableBreadcrumbs?: boolean
}

const Layout = ({
                  children,
                  title,
                  subtitle,
                  loading = false,
                  onBack = undefined,
                  disableBreadcrumbs = false
                }: LayoutProps): JSX.Element => {

  const Router = useRouter();
  const path = Router.asPath;

  const handleLogout = async () => {
    await axios.get('/api/logout');
    Router.push('/login');
  };

  return (
    <AntdLayout className="site-layout" style={{minHeight: '100vh'}}>
      <Affix>
        <Header
          // style={{ position: 'fixed', zIndex: 1, width: '100%' }}
        >
          {/*<Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>*/}
          {/*  <Menu.Item key="1">nav 1</Menu.Item>*/}
          {/*  <Menu.Item key="2">nav 2</Menu.Item>*/}
          {/*  <Menu.Item key="3">nav 3</Menu.Item>*/}
          {/*</Menu>*/}
          <CharacterMenu />
        </Header>
      </Affix>
      <Row justify="center">
        <Col xs={24} sm={24} md={24} lg={24} xl={20} xxl={16}>
          <AntdLayout.Content
            className="site-layout-background"
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
            }}
          >
            {path.includes('[id]') || loading ? <Skeleton active/> : <>
              <PageHeader
                title={title}
                subTitle={subtitle}
                breadcrumb={
                  <>
                    {disableBreadcrumbs ? null : <Breadcrumbs/>}
                    <Button
                      className="logout"
                      danger
                      shape="round"
                      size="small"
                      onClick={handleLogout}
                    >Logout</Button>
                  </>
                }
                onBack={onBack}
              />
              {
                loading ? <div>Loading...</div> : children
              }</>
            }

          </AntdLayout.Content>
        </Col>
      </Row>
    </AntdLayout>
  );
};

export default Layout;
