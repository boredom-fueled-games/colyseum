import axios from 'adapters/axios';
import { message } from 'antd';

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
    message.error('Unknown credentials.');
    return false;
  }
};

export const register = async (credentials: CredentialsData):Promise<boolean> => {
  try {
    const {status} = await axios.post(
      '/api/proxy/users',
      credentials,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );

    return status < 400;
  } catch (error) {
    console.error(error);
    return false;
  }
};
