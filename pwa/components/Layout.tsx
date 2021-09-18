import { PageHeader, Layout as AntdLayout, Skeleton, Row, Col } from 'antd';
import CharacterMenu from 'components/Characters/CharacterMenu';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';

type LayoutProps = {
  children: ReactNode
  title: string,
  subtitle?: string
  loading?: boolean
  headerContent?: ReactNode
  onBack?: () => void
}

const Layout = ({
                  children,
                  title,
                  subtitle,
                  loading = false,
                  onBack = undefined,
                }: LayoutProps): JSX.Element => {

  const Router = useRouter();
  const path = Router.asPath;

  return (
    <AntdLayout className="site-layout" style={{minHeight: '100vh'}}>
          <CharacterMenu />
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
