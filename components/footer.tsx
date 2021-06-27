import { FC } from "react"
import Link from "next/link";

const Footer : FC<{}> = () => {
    return (
        <footer>
            <Link href="/unsubscribe">Unsubscribe</Link>
            <Link href="/admin">Admin</Link>
        </footer>
    );
}

export default Footer;