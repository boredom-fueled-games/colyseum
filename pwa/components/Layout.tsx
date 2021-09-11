import { PageHeader, Layout as AntdLayout, Breadcrumb, Button, Skeleton, Tooltip } from 'antd';
import axios from 'axios';
import { useAuth } from 'context/AuthContext';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import Link from 'next/link';

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
  const {activeCharacter, characters} = useAuth();
  const Router = useRouter();
  let count = 0;
  const path = Router.asPath;

  const parts = path === '/' ? [''] : path.split('/');
  const links = parts.map(() => ++count === 1 ? '/' : parts.slice(0, count).join('/'));

  const itemRender = (route, params, routes) => {
    const last = routes.indexOf(route) === routes.length - 1;

    let activePageIdentifier = route.breadcrumbName;
    let name = route.breadcrumbName;
    if (activeCharacter && route.path === activeCharacter['@id']) {
      activePageIdentifier = (<><i className="ra ra-player ra-lg"/>{activeCharacter.identifier}</>);
      name = <Button type="text" icon={<i className="ra ra-player ra-lg"/>}>{activeCharacter.identifier}</Button>;
    }

    if (routes.indexOf(route) === 0) {
      activePageIdentifier = <i className="ra ra-arena ra-lg"/>;
      name = <Button type="text" icon={<i className="ra ra-arena ra-lg"/>}/>;
    }

    if (name === 'characters') {
      activePageIdentifier = (<><i className="ra ra-double-team ra-lg"/>{activePageIdentifier}</>);
      name = <Button type="text" icon={<i className="ra ra-double-team ra-lg"/>}>{name}</Button>;
    }

    if (name === 'combat logs') {
      activePageIdentifier = (<><i className="ra ra-scroll-unfurled ra-lg"/>{activePageIdentifier}</>);
      name = <Button type="text" icon={<i className="ra ra-scroll-unfurled ra-lg"/>}>{name}</Button>;
    }

    if (name === 'combat') {
      activePageIdentifier = (<><i className="ra ra-crossed-swords ra-lg"/>{activePageIdentifier}</>);
      name = <Button type="text" icon={<i className="ra ra-crossed-swords ra-lg"/>}>{name}</Button>;
    }

    if (name === 'training') {
      activePageIdentifier = (<><i className="ra ra-muscle-up ra-lg"/>{activePageIdentifier}</>);
      name = <Button type="text" icon={<i className="ra ra-muscle-up ra-lg"/>}>{name}</Button>;
    }

    return last ?
      <span style={{padding: '4px 15px'}} key={route.path}>{activePageIdentifier}</span>
      : <Link key={route.path} href={route.path}>{name}</Link>;
  };

  let i = 0;
  const routes = links.map(
    (link) => (
      {
        path: link,
        breadcrumbName: parts[i++].replace(/_/g, ' '),
        children: characters && link.match(/\/characters\/[a-zA-Z0-9]{26}$/g)
          ? characters['hydra:member']
            .filter((character) => character['@id'] !== activeCharacter['@id'])
            .map((character) => ({
              path: `${character['@id']}/combat_logs`,
              breadcrumbName: (
                <Tooltip title={`Switch to ${character.identifier}`}>
                  <span onClick={() => Router.push(`${character['@id']}/combat_logs`)}>
                  <><i className="ra ra-player-dodge"/> {character.identifier}</>
                </span>
                </Tooltip>
              ) as unknown as string,
            }))
          : [],
      }
    )
  );

  const breadcrumbElement = (
    <Breadcrumb
      itemRender={itemRender}
      routes={routes}
    />
  );

  // const handleDelete = async () => {
  //   const response = await prompt(`Type the name of the character you want to delete:`);
  //   if (response !== activeCharacter.identifier) {
  //     return;
  //   }
  //   await axios.delete(`/api/proxy/${activeCharacter['@id']}`);
  //   Router.push('/characters');
  // };

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
                {disableBreadcrumbs ? null : breadcrumbElement}
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
