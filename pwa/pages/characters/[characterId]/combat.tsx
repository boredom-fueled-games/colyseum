import { Menu } from 'antd';
import CharacterMenu from 'components/Characters/CharacterMenu';
import CombatOverview from 'components/Combat/CombatOverview';
import Layout from 'components/Layout';
import { useActiveCharacter } from 'context/ActiveCharacterContext';
import { useCharacters } from 'hooks/characters';
import { useState } from 'react';
import { getServerSideAuth } from 'utils/sessionAuth';


const CombatIndex = (): JSX.Element => {
  const {activeCharacter} = useActiveCharacter();
  const [activeLevel, setActiveLevel] = useState<number>(activeCharacter && activeCharacter.level ? activeCharacter.level : 1);
  const {characters, loading} = useCharacters({level: activeLevel});

  return (
    <Layout title="Character">
      <CharacterMenu/>
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
        validTargets={characters && characters['hydra:member'] ? characters['hydra:member'] : []}
        loading={loading}
      />
    </Layout>
  );
};

export default CombatIndex;

export const getServerSideProps = getServerSideAuth();
