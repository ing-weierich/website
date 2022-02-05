import { renderComponents } from '@nextful/packages/module-connector';
import * as Styled from './styles';
import Modules from '@nextful/modules/mapping';

const Article = ({ modulesCollection, greyBackground }: any) => {
    return <Styled.Container greyBackground={greyBackground}>{renderComponents(modulesCollection.items, Modules)}</Styled.Container>;
};

export default Article;
