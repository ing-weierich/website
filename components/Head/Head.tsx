import { GoogleFonts } from 'next-google-fonts';
import NextHead from 'next/head';

export default function Head({ children, title }: any) {
    return (
        <>
            <NextHead>
                <meta charSet='UTF-8' />
                <meta name='viewport' content='width=device-width, initial-scale=1.0' />
                <meta httpEquiv='x-ua-compatible' content='ie=edge' />
                <title>{title}</title>

                <link href='/fonts.css' rel='stylesheet' />
                {children}
            </NextHead>
        </>
    );
}
