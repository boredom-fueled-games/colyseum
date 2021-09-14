import { Breadcrumb, Button, Tooltip } from 'antd';
import { useAuth } from 'context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Breadcrumbs = (): JSX.Element => {
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

return (
  <Breadcrumb
    itemRender={itemRender}
    routes={routes}
  />
);
};

export default Breadcrumbs;
