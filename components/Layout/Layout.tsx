import * as Styled from './styles';
import Header from '../Header';
import Footer from '../Footer';

const Layout = ({ children, mainNavigation, footerNavigation }: any) => {
    return (
        <Styled.Container>
            <Header mainNavigation={mainNavigation} />
            {children}
            <Footer footerNavigation={footerNavigation} />
        </Styled.Container>
    );
};

export default Layout;
