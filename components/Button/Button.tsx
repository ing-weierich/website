import * as Styled from './styles';

const Button = ({ href, label, className }: any) => {
    return (
        <Styled.Button href={href}>
            <Styled.Link className={className}>
                <Styled.Label>{label}</Styled.Label>
            </Styled.Link>
        </Styled.Button>
    );
};

export default Button;
