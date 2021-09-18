import { Affix, Tabs } from 'antd';
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
    <Affix>
      <Tabs defaultActiveKey={links[links.length - 1]} centered>
        <TabPane tab={
          <Link passHref={true} href={character && character['@id'] ? character['@id'] : '/'}><span><i className="ra ra-player ra-lg"/> Character</span></Link>
        } key=""/>
        <TabPane tab={
          <Link passHref={true} href={character ? character['@id'] + '/combat_logs' : '/combat_logs'}><span><i
            className="ra ra-scroll-unfurled ra-lg"/> Combat logs</span></Link>
        } key="/combat_logs"/>
        <TabPane tab={
          <Link passHref={true} href={character ? character['@id'] + '/equipment' : '/equipment'}><span><i
            className="ra ra-vest ra-lg"/> Equipment</span></Link>
        } key="/equipment"/>
        <TabPane tab={
          <Link passHref={true} href={character ? character['@id'] + '/shop' : '/shop'}><span><i
            className="ra ra-forging ra-lg"/> Shop</span></Link>
        } key="/shop"/>
        <TabPane tab={
          <Link passHref={true} href={character ? character['@id'] + '/combat' : '/combat'}><span><i
            className="ra ra-crossed-swords ra-lg"/> Combat</span></Link>
        } key="/combat"/>
        <TabPane tab={
          <Link passHref={true} href={character ? character['@id'] + '/training' : '/training'}><span><i
            className="ra ra-muscle-up ra-lg"/> Training</span></Link>
        } key="/training"/>
      </Tabs>
    </Affix>
  );
};

export default CharacterTabs;
