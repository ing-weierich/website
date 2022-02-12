import * as Styled from './styles';
import Image from 'next/image';

const ModuleStage = ({ className, ...props }: any) => {
    const { headline, subheadline, image } = props.moduleStage;

    return (
        <Styled.Container>
            <Styled.LogoContainer>
                <Styled.Logo src='/logo.svg' alt='Logo' />
            </Styled.LogoContainer>
            <Styled.Inner>
                <Styled.Content>
                    <Styled.Headline>{headline}</Styled.Headline>
                    {subheadline && <Styled.Subheadline>{subheadline}</Styled.Subheadline>}
                </Styled.Content>
                <Styled.ImageContainer>
                    <Image src={`${image.url}?w=628&h=480&fit=fill`} width={628} height={480} />
                </Styled.ImageContainer>
            </Styled.Inner>
        </Styled.Container>
    );
};

export default ModuleStage;
