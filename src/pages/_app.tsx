import '../../static/reset.css';
import '../../static/index.css';
import { Provider } from 'react-redux';
import { store } from '../store';
import { Footer } from '../components/Footer';

const App = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
      <Footer />
    </Provider>
  );
};

export default App;
