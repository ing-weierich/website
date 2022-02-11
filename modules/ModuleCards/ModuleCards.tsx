import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import Grid from '@nextful/components/Grid';
import * as Styled from './styles';
import Image from 'next/image';

const ModuleCards = ({ className, ...props }: any) => {
    const items = props?.moduleCards?.cardsCollection?.items;

    if (items.length < 1) {
        return null;
    }

    return (
        <Styled.Container className={className}>
            <Styled.Inner>
                <Grid>
                    {items.map((item: any) => {
                        return (
                            <Styled.Card key={item.headline}>
                                <Styled.ImageContainer>
                                    <Image src={`${item.image.url}?w=628&h=360&fit=fill`} width={628} height={360} />
                                    <Styled.Box>
                                        <Styled.Headline>{item.headline}</Styled.Headline>
                                        <Styled.Text>{documentToReactComponents(item.text.json)}</Styled.Text>
                                    </Styled.Box>
                                </Styled.ImageContainer>
                            </Styled.Card>
                        );
                    })}
                </Grid>
            </Styled.Inner>
        </Styled.Container>
    );
};

export default ModuleCards;
