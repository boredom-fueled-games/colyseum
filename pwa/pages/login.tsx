import { Button, Form, Input } from 'antd';
import { useRouter } from 'next/router';
import { login } from 'utils/auth';
import { getServerSideAuth } from 'utils/sessionAuth';

const Login = () => {
  const Router = useRouter();

  const handleSubmit = async (values) => {
    const isSuccess = await login(values);
    if (isSuccess) {
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
          Submit
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
