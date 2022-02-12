import { renderComponents } from '@nextful/packages/module-connector';
import * as Styled from './styles';
import Modules from '@nextful/modules/mapping';

const Article = ({ modulesCollection, noPadding, color }: any) => {
    return (
        <Styled.Container noPadding={noPadding} color={color}>
            {renderComponents(modulesCollection.items, Modules)}
        </Styled.Container>
    );
};

export default Article;
