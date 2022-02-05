import { ST } from 'next/dist/shared/lib/utils';
import * as Styled from './styles';

const FooterComponent = ({ footerNavigation }: any) => {
    const currentYear = new Date().getFullYear();

    return (
        <Styled.Container>
            <Styled.TopContainer>
                <Styled.Head>
                    <Styled.Headline>Komm doch mal auf einen sprung vorbei.</Styled.Headline>
                    <Styled.Text>
                        Du hast Lust auf ein kostenloses Probetraining? Hervorragend. Schreibe uns eine Mail, ruf uns an oder komm einfach
                        vorbei. Wir freuen uns auf dich.
                    </Styled.Text>
                </Styled.Head>
                <Styled.ContactData>
                    <Styled.Label>Finde uns</Styled.Label>
                    <Styled.BoldValue>Kaizen - Verein für Kampfkunst e.V</Styled.BoldValue>
                    <Styled.Value>
                        Ecke Voßbrucher Str
                        <br />
                        Carola Lob Weg
                        <br />
                        51789 Lindlar
                    </Styled.Value>
                </Styled.ContactData>
                <Styled.LocationData>
                    <Styled.Label>Erreiche uns</Styled.Label>
                    <Styled.BoldValue>Telefon:</Styled.BoldValue>
                    <Styled.Value>0162 925 67 86</Styled.Value>
                    <Styled.BoldValue>E-Mail:</Styled.BoldValue>
                    <Styled.Value>info@kaizen-kampfkunst.de</Styled.Value>
                </Styled.LocationData>
            </Styled.TopContainer>
            <Styled.BottomContainer>
                <Styled.CopyrightContainer>
                    <Styled.Logo src='/logo.svg' alt='Logo' />
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
