import { createGlobalStyle } from 'styled-components';
import { colors } from './theme';

const GlobalStyle = createGlobalStyle`
  html {
    -webkit-font-smoothing: antialiased;
    height: 100%;
    overflow: auto;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  img {
    vertical-align:text-bottom;
    line-height: 0;
  }

  body {
    font-family: 'Cabin', sans-serif;
    background-color: ${colors.white};
    color: ${colors.black};
  }

  p {
    font-size: 20px;
    line-height: 32px;
  }
`;

export default GlobalStyle;
