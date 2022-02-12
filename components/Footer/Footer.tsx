import { ST } from 'next/dist/shared/lib/utils';
import * as Styled from './styles';

const FooterComponent = ({ footerNavigation }: any) => {
    const currentYear = new Date().getFullYear();

    return (
        <Styled.Container>
            <Styled.TopContainer>
                <Styled.Fish src='/fish.svg' />
                <Styled.TopContainerInside>
                    <Styled.Box>
                        <Styled.Headline>
                            Fundiertes Fachwissen und ein Höchstmaß an <strong>professioneller Bearbeitung</strong>
                        </Styled.Headline>
                        <Styled.Link href='tel:015115381245'>
                            <Styled.Icon src='/phone_white.svg' alt='Handy' />
                            <Styled.Data>0151 / 15 38 12 45</Styled.Data>
                        </Styled.Link>

                        <Styled.Link href='mailto:info@Ing-Weierich.de'>
                            <Styled.Icon src='/mail_white.svg' alt='E-Mail' />
                            <Styled.Data>info@Ing-Weierich.de</Styled.Data>
                        </Styled.Link>
                    </Styled.Box>
                    <Styled.Box>
                        <Styled.Text>
                            Sie suchen nach einem kompetenten Partner in den Bereichen Gewässerökologie und Fischereibiologie?{' '}
                        </Styled.Text>
                        <Styled.Text>
                            <strong>Wir helfen Ihnen gerne unverbindlich weiter. </strong>
                        </Styled.Text>
                    </Styled.Box>
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
