import * as Styled from './styles';

const ModuleHeadlines = ({ className, ...props }: any) => {
    const { headline, subheadline } = props.moduleHeadlines;

    return (
        <Styled.Container>
            <Styled.Inner>
                <Styled.Headline>{headline}</Styled.Headline>
                {subheadline && <Styled.Subheadline>{subheadline}</Styled.Subheadline>}
            </Styled.Inner>
        </Styled.Container>
    );
};

export default ModuleHeadlines;
