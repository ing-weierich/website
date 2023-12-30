import { AppProps } from 'next/app';
import Head from '@nextful/components/Head';
import themeVariables from '../theme';
import GlobalStyles from '../globalStyles';
import { ThemeProvider } from 'styled-components';
import { createStyledBreakpointsTheme } from 'styled-breakpoints';

const theme = {
    ...createStyledBreakpointsTheme(),
    ...themeVariables,
};

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
