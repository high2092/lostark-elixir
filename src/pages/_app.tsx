import '../../static/reset.css';
import '../../static/index.css';
import { Provider } from 'react-redux';
import { store } from '../store';

const App = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
};

export default App;
