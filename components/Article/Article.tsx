import { renderComponents } from '@nextful/packages/module-connector';
import * as Styled from './styles';
import Modules from '@nextful/modules/mapping';

const Article = ({ modulesCollection, noPadding, color, className }: any) => {
    return (
        <Styled.Container noPadding={noPadding} color={color} className={className}>
            {renderComponents(modulesCollection.items, Modules)}
        </Styled.Container>
    );
};

export default Article;
