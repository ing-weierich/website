import 'styled-components';
import { StyledBreakpointsTheme } from 'styled-breakpoints';

declare module 'styled-components' {
    export interface DefaultTheme extends StyledBreakpointsTheme {
        colors: any;
        fonts: any;
        maxWidth: any;
    }
}
