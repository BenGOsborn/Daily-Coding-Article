import { FC } from "react";
import Footer from "./footer";
import Head from "next/head";

const Layout: FC<{}> = ({ children }) => {
    return (
        <>
            <Head>
                <meta charSet="UTF-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <meta
                    name="keywords"
                    content="daily, coding, article, email, subscribe, unsubscribe, subscription"
                />
                <meta name="robots" content="index, follow" />
                <link rel="manifest" href="/manifest.json" />
            </Head>
            <main>{children}</main>
            <Footer />
        </>
    );
};

export default Layout;
