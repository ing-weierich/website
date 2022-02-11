import { createGlobalStyle } from 'styled-components';
import { colors, fonts } from './theme';

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
    font-family: ${fonts.normal};
    color: ${colors.black};
  }

  p {
    font-size: 20px;
    line-height: 32px;
    color: rgba(1, 16, 25, 0,87);
  }
`;

export default GlobalStyle;
