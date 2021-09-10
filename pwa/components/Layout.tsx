import { PageHeader, Layout as AntdLayout, Breadcrumb, Button } from 'antd';
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
}


const Layout = ({
                  children,
                  title,
                  subtitle,
                  loading = false,
                  headerContent = null
                }: LayoutProps): JSX.Element => {
  const {activeCharacter} = useAuth();
  const Router = useRouter();
  let count = 0;
  const path = Router.asPath;
  if (path.includes('[id]')) {
    return <div>Loading...</div>;
  }
  const parts = path === '/' ? [''] : path.split('/');
  const links = parts.map(() => ++count === 1 ? '/' : parts.slice(0, count).join('/'));

  const itemRender = (route, params, routes) => {
    const last = routes.indexOf(route) === routes.length - 1;

    if (last) {
      console.log(route, params, routes);
    }

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
      {path: link, breadcrumbName: parts[i++].replace(/_/g, ' ')}
    )
  );
  const breadcrumbElement = (
    <Breadcrumb
      itemRender={itemRender}
      routes={routes}
    />
  );
  console.log(routes);
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
        <PageHeader
          title={title}
          subTitle={subtitle}
          breadcrumb={breadcrumbElement}
        >{headerContent}</PageHeader>
        {
          loading ? <div>Loading...</div> : children
        }
      </AntdLayout.Content>
    </AntdLayout>
  );
};

export default Layout;
