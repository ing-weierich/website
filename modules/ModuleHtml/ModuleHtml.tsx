import * as Styled from './styles';

const ModuleHtml = ({ className, ...props }: any) => {
    return <Styled.Container dangerouslySetInnerHTML={{ __html: props?.moduleHtml?.html }} />;
};

export default ModuleHtml;
