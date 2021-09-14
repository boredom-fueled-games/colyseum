import { PageHeader, Layout as AntdLayout, Button, Skeleton } from 'antd';
import axios from 'axios';
import Breadcrumbs from 'components/Breadcrumbs';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';

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
                  headerContent = null,
                  onBack = null,
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
          >
            {headerContent}
          </PageHeader>
          {
            loading ? <div>Loading...</div> : children
          }</>
        }

      </AntdLayout.Content>
    </AntdLayout>
  );
};

export default Layout;
