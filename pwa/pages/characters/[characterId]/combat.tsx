import { Menu } from 'antd';
import CharacterDetails from 'components/CharacterDetails';
import CharacterTabs from 'components/CharacterTabs';
import CombatOverview from 'components/CombatOverview';
import Layout from 'components/Layout';
import { useAuth } from 'context/AuthContext';
import { useCharacters } from 'hooks/characters';
import { useState } from 'react';
import { getServerSideAuth } from 'utils/sessionAuth';


const CombatIndex = (): JSX.Element => {
  const {activeCharacter} = useAuth();
  const [activeLevel, setActiveLevel] = useState<number>(activeCharacter ? activeCharacter.level : 1);
  const {characters, loading} = useCharacters({level: activeLevel});

  return (
    <Layout title="Character" headerContent={<CharacterDetails character={activeCharacter}/>}>
      <CharacterTabs character={activeCharacter}/>
      <Menu
        onClick={(event) => setActiveLevel(parseInt(event.key))}
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
      <CombatOverview
        activeCharacter={activeCharacter}
        validTargets={!characters ? [] : characters['hydra:member']}
        loading={loading}
      />
    </Layout>
  );
};

export default CombatIndex;

export const getServerSideProps = getServerSideAuth();
