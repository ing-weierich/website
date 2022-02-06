import { ST } from 'next/dist/shared/lib/utils';
import * as Styled from './styles';

const FooterComponent = ({ footerNavigation }: any) => {
    const currentYear = new Date().getFullYear();

    return (
        <Styled.Container>
            <Styled.TopContainer>
                <Styled.TopContainerInside>
                    <Styled.Box></Styled.Box>
                    <Styled.Box></Styled.Box>
                </Styled.TopContainerInside>
            </Styled.TopContainer>

            <Styled.BottomContainer>
                <Styled.CopyrightContainer>
                    <Styled.Copyright>©KAIZEN VEREIN FÜR KAMPFKUNST E.V. {currentYear}</Styled.Copyright>
                </Styled.CopyrightContainer>

                <Styled.Navigation>
                    {footerNavigation?.map((item: any) => {
                        return (
                            <Styled.NavigationItem key={item.slug} href={item.slug}>
                                <Styled.NavigationValue>{item.title}</Styled.NavigationValue>
                            </Styled.NavigationItem>
                        );
                    })}
                </Styled.Navigation>
            </Styled.BottomContainer>
        </Styled.Container>
    );
};

export default FooterComponent;
