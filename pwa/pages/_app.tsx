// import App from "next/app";
import { fetcher } from 'adapters/axios';
import { ActiveCharacterProvider } from 'context/ActiveCharacterContext';
import { AuthProvider } from 'context/AuthContext';
import type { AppProps /*, AppContext */ } from 'next/app';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Router } from 'next/router';
import { RecoilRoot } from 'recoil';
import { SWRConfig } from 'swr';
import 'styles/styles.scss';
import 'rpg-awesome/css/rpg-awesome.min.css';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import Head from 'next/head'

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const App = ({Component, pageProps}: AppProps): JSX.Element => {

  return (
    <RecoilRoot>
      <Head>
        <title>Project Arena Brawler</title>
      </Head>
      <SWRConfig value={{fetcher}}>
        <AuthProvider>
          <ActiveCharacterProvider>
            <Component {...pageProps} />
          </ActiveCharacterProvider>
        </AuthProvider>
      </SWRConfig>
    </RecoilRoot>
  );
};

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext: AppContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);

//   return { ...appProps }
// }

export default App;
