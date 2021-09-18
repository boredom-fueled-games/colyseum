import CharacterMenu from 'components/Characters/CharacterMenu';
import CombatOverview from 'components/Combat/CombatOverview';
import Layout from 'components/Layout';
import { useCharacters } from 'hooks/characters';
import { getServerSideAuth } from 'utils/sessionAuth';

const Equipment = (): JSX.Element => {
  const {characters, loading} = useCharacters();

  return (
    <Layout title="Equipment">
      <CharacterMenu/>
      <CombatOverview
        validTargets={characters && characters['hydra:member'] ? characters['hydra:member'] : []}
        loading={loading}
      />
    </Layout>
  );
};

export default Equipment;

export const getServerSideProps = getServerSideAuth();
