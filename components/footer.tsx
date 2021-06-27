import { FC } from "react"
import Link from "next/link";
import styles from "../styles/Footer.module.scss"

const Footer : FC<{}> = () => {
    return (
        <footer className={styles.Footer}>
            <div className={styles.links}>
                <Link href="/unsubscribe">Unsubscribe</Link>
                <Link href="/">Subscribe</Link>
                <Link href="/admin">Admin</Link>
            </div>
        </footer>
    );
}

export default Footer;