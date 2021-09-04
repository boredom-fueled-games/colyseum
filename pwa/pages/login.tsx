import { useRouter } from 'next/router';
import { useState } from 'react';
import { login } from 'utils/auth';
import { getServerSideAuth } from 'utils/sessionAuth';

const Login = (props) => {
  const Router = useRouter();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleUsername = (event) => setUsername(event.target.value);
  const handlePassword = (event) => setPassword(event.target.value);
  const handleSubmit = async (event) => {
    event.preventDefault();

    const isSuccess = await login({username, password});

    if (isSuccess) {
      Router.push('/');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input type="text" value={username} onChange={handleUsername}/>
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={handlePassword}/>
      </label>
      <input type="submit"/>
    </form>
  );
};

export default Login;

export const getServerSideProps = getServerSideAuth({
  authenticatedRedirect: '/',
  unauthenticatedRedirect: null,
});
