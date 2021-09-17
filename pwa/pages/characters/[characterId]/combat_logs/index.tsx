import CharacterDetails from 'components/Characters/CharacterDetails';
import CharacterTabs from 'components/Characters/CharacterTabs';
import CombatLogsOverview from 'components/Combat/CombatLogsOverview';
import Layout from 'components/Layout';
import { useCharacter } from 'hooks/characters';
import { useRouter } from 'next/router';
import { getServerSideAuth } from 'utils/sessionAuth';

const CombatLogs = (): JSX.Element => {
  const router = useRouter();
  const {characterId} = router.query;
  const {character} = useCharacter(characterId ? `/characters/${characterId}` : null);

  return (
    <Layout title="Character" headerContent={<CharacterDetails character={character}/>}>
      <CharacterTabs character={character}/>
      <CombatLogsOverview character={character}/>
    </Layout>
  );
};

export default CombatLogs;

export const getServerSideProps = getServerSideAuth();
