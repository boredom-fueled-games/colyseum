import axios from 'adapters/axios';

export interface CredentialsData {
  username: string;
  password: string;
}

export const login = async (credentials: CredentialsData):Promise<boolean> => {
  try {
    await axios.post(
      '/api/login',
      credentials,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const register = async (credentials: CredentialsData):Promise<boolean> => {
  try {
    await axios.post(
      '/api/proxy/users',
      credentials,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
