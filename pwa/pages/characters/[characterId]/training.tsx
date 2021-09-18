import CharacterMenu from 'components/Characters/CharacterMenu';
import CombatOverview from 'components/Combat/CombatOverview';
import Layout from 'components/Layout';
import { useCharacters } from 'hooks/characters';
import { getServerSideAuth } from 'utils/sessionAuth';

const Training = (): JSX.Element => {
  const {characters, loading} = useCharacters({training: true});

  return (
    <Layout title="Character" >
      <CharacterMenu/>
      <CombatOverview validTargets={characters && characters['hydra:member'] ? characters['hydra:member'] : []}
                      loading={loading} training/>
    </Layout>
  );
};

export default Training;

export const getServerSideProps = getServerSideAuth();
