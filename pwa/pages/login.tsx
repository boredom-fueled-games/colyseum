import { Button, Col, Form, Input, Row } from 'antd';
import { useRouter } from 'next/router';
import { CredentialsData, login } from 'utils/auth';
import { Logo } from 'utils/icons';
import { getServerSideAuth } from 'utils/sessionAuth';
import { Typography } from 'antd';

const {Title} = Typography;

const Login = (): JSX.Element => {
  const Router = useRouter();

  const handleSubmit = async (values: CredentialsData) => {
    const isSuccess = await login(values);
    if (!isSuccess) {
      return;
    }

    Router.push('/');

  };

  return (
    <Form
      name="basic"
      labelCol={{span: 8}}
      wrapperCol={{span: 8}}
      onFinish={handleSubmit}
      autoComplete="off"
    >
      <Title style={{justifyContent: 'center', textAlign: 'center'}}>Welcome to Colyseum!</Title>
      <Row>
        <Col span={8} offset={8}>
          <Logo style={{fill: 'grey'}}/>
        </Col>
      </Row>

      <Form.Item
        label="Username"
        name="username"
        rules={[{required: true, message: 'Please input your username!'}]}
      >
        <Input/>
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{required: true, message: 'Please input your password!'}]}
      >
        <Input.Password/>
      </Form.Item>

      <Form.Item wrapperCol={{offset: 8, span: 16}}>
        <Button type="primary" htmlType="submit">
          Login
        </Button>
        <Button onClick={() => Router.push('/register')}>
          Register
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;

export const getServerSideProps = getServerSideAuth({
  authenticatedRedirect: '/',
  unauthenticatedRedirect: null,
});
