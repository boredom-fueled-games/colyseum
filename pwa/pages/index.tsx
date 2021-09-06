import axios from 'axios';
import CharacterList from 'components/CharacterList';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { getServerSideAuth } from 'utils/sessionAuth';

const AuthGuard = dynamic<{ readonly customText: ReactNode }>(() =>
  import('../components/AuthGuard').then(module => module.AuthGuard),
);

const Index = () => {
  const Router = useRouter();

  // const handleLogout = async () => {
  //   await axios.get('/api/logout');
  //   Router.push('/')
  // }

  return (
    // <AuthGuard accessToken={token} customText={(<Link href="/login">Login</Link>)}>
    //   Logged in as {loading ? 'No clue' : user.username}
    //   <button onClick={handleLogout}>Logout</button>
    // </AuthGuard>

  <CharacterList/>
  );
};

export default Index;

export const getServerSideProps = getServerSideAuth(
  {}
);
