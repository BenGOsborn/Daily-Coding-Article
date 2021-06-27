import { FC } from "react";
import Footer from "./footer";

const Layout: FC<{}> = ({ children }) => {
    return (
        <>
            <main>{children}</main>
            <Footer />
        </>
    );
};

export default Layout;
