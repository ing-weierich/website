import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import * as Styled from './styles';

const ModuleImageText = ({ className, ...props }: any) => {
    const { headline, text, image } = props.moduleImageText;

    return (
        <Styled.Container>
            <Styled.Inner>
                <Styled.ImageContainer>
                    <Styled.Image src={image.url} width={image.width} height={image.height} />
                    <Styled.Text>{documentToReactComponents(text?.json)}</Styled.Text>
                </Styled.ImageContainer>
            </Styled.Inner>
        </Styled.Container>
    );
};

export default ModuleImageText;
