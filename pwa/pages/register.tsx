import { Button, Form, Input } from 'antd';
import { useRouter } from 'next/router';
import { CredentialsData, login, register } from 'utils/auth';
import { getServerSideAuth } from 'utils/sessionAuth';
import { Typography } from 'antd';

const {Title} = Typography;

const Register = (): JSX.Element => {
  const Router = useRouter();

  const handleSubmit = async (values: CredentialsData) => {
    const isSuccess = await register(values);
    if (isSuccess) {
      await login(values);
      Router.push('/');
    }
  };

  return (
    <Form
      name="basic"
      labelCol={{span: 8}}
      wrapperCol={{span: 8}}
      onFinish={handleSubmit}
      autoComplete="off"
    >
      <Title style={{justifyContent: 'center', textAlign: 'center'}}>Registration</Title>
      <Form.Item
        label="Username"
        name="username"
        rules={[
          {required: true, message: 'Please input your username!'},
          {min: 5, message: 'Please make sure your username is at least 5 characters long.'},
          {max: 25, message: 'Please make sure your username is max 25 characters long.'}
        ]}
      >
        <Input/>
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          {required: true, message: 'Please input your password!'},
          {min: 10, message: 'Please make sure your password is at least 10 characters long.'},
        ]}
      >
        <Input.Password/>
      </Form.Item>

      <Form.Item wrapperCol={{offset: 8, span: 16}}>
        <Button type="primary" htmlType="submit">
          Register
        </Button>
        <Button onClick={() => Router.push('/login')}>
          Back
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Register;

export const getServerSideProps = getServerSideAuth({
  authenticatedRedirect: '/',
  unauthenticatedRedirect: null,
});
