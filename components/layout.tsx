import { FC } from "react";
import Footer from "./footer";

const Layout : FC<{}> = ({ children }) => {
    return (
        <>
            {children}
            <Footer />
        </>
    );
}

export default Layout;