import { useState } from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import * as Styled from './styles';

const ModuleAkkordeons = ({ className, ...props }: any) => {
    const headline = props.moduleAkkordeons.headline;
    const items = props.moduleAkkordeons.accordeonsCollection.items;
    const [active, setActive] = useState<null | string>(null);

    const handleHeadClick = (label: string) => {
        if (active === label) {
            setActive(null);
            return;
        }

        setActive(label);
    };

    return (
        <Styled.Container>
            <Styled.Inner>
                <Styled.Headline>{headline}</Styled.Headline>
                {items.map((item: any) => {
                    const isOpen = item.label === active;
                    return (
                        <Styled.Accordion key={item.label}>
                            <Styled.Head
                                onClick={() => {
                                    handleHeadClick(item.label);
                                }}
                            >
                                <Styled.Label>{item.label}</Styled.Label>
                                <Styled.Icon isOpen={isOpen} src='/arrow_up_black.svg' />
                            </Styled.Head>
                            <Styled.Content isOpen={isOpen}>{documentToReactComponents(item.text.json)}</Styled.Content>
                        </Styled.Accordion>
                    );
                })}
            </Styled.Inner>
        </Styled.Container>
    );
};

export default ModuleAkkordeons;
