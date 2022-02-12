import * as Styled from './styles';
import { useState } from 'react';

const Header = ({ mainNavigation, className }: any) => {
    const [open, setOpen] = useState(false);

    const handleButtonClick = () => {
        setOpen(!open);
    };

    return (
        <>
            <Styled.Container className={className}>
                <Styled.Inner>
                    <Styled.MobileNavigation open={open}>
                        {mainNavigation?.map((item: any) => {
                            return (
                                <Styled.NavLink key={item.slug} href={item.slug}>
                                    <Styled.NavValue
                                        onClick={() => {
                                            setOpen(false);
                                        }}
                                    >
                                        {item.title}
                                    </Styled.NavValue>
                                </Styled.NavLink>
                            );
                        })}
                    </Styled.MobileNavigation>

                    <Styled.LogoLink href='/startseite'>
                        <Styled.Logo open={open} src='/logo.svg' />
                    </Styled.LogoLink>

                    <Styled.DesktopNavigation>
                        {mainNavigation?.map((item: any) => {
                            return (
                                <Styled.NavLink key={item.slug} href={item.slug}>
                                    <Styled.NavValue>{item.title}</Styled.NavValue>
                                </Styled.NavLink>
                            );
                        })}
                    </Styled.DesktopNavigation>

                    <Styled.Burger onClick={handleButtonClick} open={open}>
                        <Styled.BurgerInner>
                            <Styled.Line />
                            <Styled.Line />
                            <Styled.Line />
                        </Styled.BurgerInner>
                    </Styled.Burger>
                </Styled.Inner>
            </Styled.Container>
        </>
    );
};

export default Header;
