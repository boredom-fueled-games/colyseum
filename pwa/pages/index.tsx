import CharacterCreation from 'components/Characters/CharacterCreation';
import CharacterOverview from 'components/Characters/CharacterOverview';
import Layout from 'components/Layout';
import { getServerSideAuth } from 'utils/sessionAuth';

// const AuthGuard = dynamic<{ readonly customText: ReactNode }>(() =>
//   import('../components/AuthGuard').then(module => module.AuthGuard),
// );

const Index = (): JSX.Element => (
  <Layout title="Overview">
    <CharacterCreation/>
    <CharacterOverview/>
  </Layout>
);

export default Index;

export const getServerSideProps = getServerSideAuth();
