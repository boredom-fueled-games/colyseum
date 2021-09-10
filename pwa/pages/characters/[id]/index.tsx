import CharacterDetails from 'components/CharacterDetails';
import CharacterTabs from 'components/CharacterTabs';
import CombatLogsOverview from 'components/CombatLogsOverview';
import Layout from 'components/Layout';
import { useCharacter } from 'hooks/characters';
import { useRouter } from 'next/router';

const Character = (): JSX.Element => {
  const router = useRouter();
  const {id} = router.query;
  const {character} = useCharacter(id ? `/characters/${id}` : null);

  return (
    <Layout title="Character" headerContent={<CharacterDetails character={character}/>}>
      <CharacterTabs character={character} />
      <CombatLogsOverview character={character}/>
    </Layout>
  );
};

export default Character;
