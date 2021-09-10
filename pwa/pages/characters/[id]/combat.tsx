import { Menu } from 'antd';
import CharacterDetails from 'components/CharacterDetails';
import CharacterTabs from 'components/CharacterTabs';
import CombatOverview from 'components/CombatOverview';
import Layout from 'components/Layout';
import { useAuth } from 'context/AuthContext';
import { useCharacter, useCharacters } from 'hooks/characters';
import { useRouter } from 'next/router';


const CombatIndex = (): JSX.Element => {
  const {activeCharacter} = useAuth();
  const {characters, loading} = useCharacters();
  const router = useRouter();
  const {id} = router.query;
  const {character} = useCharacter(id ? `/characters/${id}` : null);

  const activeLevel = activeCharacter ? activeCharacter.level : 1;

  return (
    <Layout title="Character" headerContent={<CharacterDetails character={character}/>}>
      <CharacterTabs character={character}/>
      <Menu
        onClick={(event) => console.log(event)}
        selectedKeys={[activeLevel.toString()]}
        mode="horizontal"
      >
        {[...Array.from({length: 5}, (v, i) => i)].map(i => {
          const currentLevel = activeLevel + i;
          return (
            <Menu.Item key={currentLevel.toString()}>
              Level {currentLevel}
            </Menu.Item>
          );
        })}
      </Menu>
      <CombatOverview activeCharacter={activeCharacter} validTargets={!characters ? [] : characters['hydra:member']}
                      loading={loading}/>
    </Layout>
  );
};

export default CombatIndex;
