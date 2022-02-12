import * as Styled from './styles';
import Image from 'next/image';

const ModuleStage = ({ className, ...props }: any) => {
    const { headline, subheadline, image } = props.moduleStage;

    return (
        <Styled.Container className={className}>
            <Styled.LogoContainer>
                <Styled.Logo src='/logo.svg' alt='Logo' />
            </Styled.LogoContainer>

            <Styled.Inner>
                <Styled.Content>
                    <Styled.Headline>{headline}</Styled.Headline>
                    {subheadline && <Styled.Subheadline>{subheadline}</Styled.Subheadline>}
                </Styled.Content>
                <Styled.ImageContainer>
                    <Image src={`${image.url}?w=628&h=580&fit=fill&f=top`} width={628} height={580} />
                </Styled.ImageContainer>
            </Styled.Inner>
        </Styled.Container>
    );
};

export default ModuleStage;
