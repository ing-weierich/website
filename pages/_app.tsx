import { AppProps } from 'next/app';
import { ParallaxProvider } from 'react-scroll-parallax';
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
                <ParallaxProvider>
                    <Component {...pageProps} />
                </ParallaxProvider>
            </ThemeProvider>
        </>
    );
}

export default App;
