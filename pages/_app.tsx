import { AppProps } from 'next/app';
import Head from '@nextful/components/Head';
import theme from '../theme';
import GlobalStyles from '../globalStyles';
import { ThemeProvider } from 'styled-components';

function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head />
            <GlobalStyles />
            <ThemeProvider theme={theme}>
                <Component {...pageProps} />
            </ThemeProvider>
        </>
    );
}

export default App;
