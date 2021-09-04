import useMe from 'data/auth';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ReactNode } from 'react';
import { getServerSideAuth } from 'utils/sessionAuth';

const AuthGuard = dynamic<{ readonly customText: ReactNode }>(() =>
  import('../components/AuthGuard').then(module => module.AuthGuard),
);

const Index = ({token}) => {
  const {user} = useMe();

  return (
    <AuthGuard accessToken={token} customText={(<Link href="/login">Login</Link>)}>
      Logged in as {JSON.stringify(user)}
    </AuthGuard>
  );
};

export default Index;

export const getServerSideProps = getServerSideAuth({});
