import '../../static/reset.css';
import '../../static/index.css';
import { Provider } from 'react-redux';
import { store } from '../store';
import { Footer } from '../components/Footer';
import { ModalContainer } from '../components/ModalContainer';

const App = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
      <Footer />
      <ModalContainer />
    </Provider>
  );
};

export default App;
