import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import * as Styled from './styles';

const ModuleText = ({ className, ...props }: any) => {
    const { buttonLabel, buttonLink, headline, text, topline } = props.moduleText;

    return (
        <Styled.Container>
            <Styled.Inner>
                <Styled.Box>
                    {topline && <Styled.Topline>{topline}</Styled.Topline>}
                    <Styled.Headline>{headline}</Styled.Headline>
                    {buttonLabel && buttonLink?.slug && <Styled.Button href={buttonLink.slug} label={buttonLabel} />}
                </Styled.Box>
                <Styled.Box>
                    <Styled.Text>{documentToReactComponents(text?.json)}</Styled.Text>
                </Styled.Box>
            </Styled.Inner>
        </Styled.Container>
    );
};

export default ModuleText;
