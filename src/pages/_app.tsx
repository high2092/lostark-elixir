import '../../public/css/reset.css';
import '../../public/css/index.css';
import { Provider } from 'react-redux';
import { store } from '../store';
import { Footer } from '../components/Footer';
import { ModalContainer } from '../components/ModalContainer';
import Head from 'next/head';

const App = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <Head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Component {...pageProps} />
      <Footer />
      <ModalContainer />
    </Provider>
  );
};

export default App;
