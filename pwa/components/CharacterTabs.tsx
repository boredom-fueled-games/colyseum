import { Tabs } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Character } from 'types/Character';

const {TabPane} = Tabs;

type CharacterTabsProps = {
  character: Character
}

const CharacterTabs = ({character}: CharacterTabsProps): JSX.Element => {
  const Router = useRouter();
  const path = Router.asPath;
  const parts = path === '/' ? [''] : path.split('/');
  const links = parts.map((path) => '/' + path);
  return (
    <Tabs defaultActiveKey={links[links.length - 1]} centered>
      <TabPane tab={
        <Link passHref={true} href={character ? character['@id'] : '/'}><span><i className="ra ra-scroll-unfurled ra-lg" /> Combat logs</span></Link>
      } key="/"/>
      {/*<TabPane tab={*/}
      {/*  <Link href={character ? character['@id'] + '/equipment' : '/equipment'}>Equipment</Link>*/}
      {/*} key="/equipment"/>*/}
      <TabPane tab={
        <Link passHref={true} href={character ? character['@id'] + '/combat' : '/combat'}><span><i className="ra ra-crossed-swords ra-lg" /> Combat</span></Link>
      } key="/combat"/>
      <TabPane tab={
        <Link passHref={true} href={character ? character['@id'] + '/training' : '/training'}><span><i className="ra ra-muscle-up ra-lg" /> Training</span></Link>
      } key="/training"/>
    </Tabs>
  );
};

export default CharacterTabs;
