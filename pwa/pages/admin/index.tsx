import Head from 'next/head';

const AdminLoader = (): JSX.Element => {
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const {HydraAdmin} = require('@api-platform/admin');
    return <HydraAdmin entrypoint={window.origin}/>;
  }

  return <></>;
};

const Admin = (): JSX.Element => (
  <>
    <Head>
      <title>API Platform Admin</title>
    </Head>

    <AdminLoader/>
  </>
);
export default Admin;
