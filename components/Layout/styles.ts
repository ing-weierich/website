import styled from 'styled-components';
import { up } from 'styled-breakpoints';

export const Container = styled.div`
    padding-top: 122px;
    ${up('xl')} {
        padding-top: 80px;
    }
`;
