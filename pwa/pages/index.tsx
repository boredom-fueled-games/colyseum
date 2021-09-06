import axios from 'axios';
import CharacterList from 'components/CharacterList';
import useMe from 'hooks/auth';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { getServerSideAuth } from 'utils/sessionAuth';

const AuthGuard = dynamic<{ readonly customText: ReactNode }>(() =>
  import('../components/AuthGuard').then(module => module.AuthGuard),
);

const Index = () => {
  const Router = useRouter();
  const {user, loading} = useMe();

  const handleLogout = async () => {
    await axios.get('/api/logout');
    Router.push('/')
  }

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
