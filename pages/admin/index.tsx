import { GetServerSideProps } from "next";
import { FC, useState } from "react";
import { SendParams } from "../api/emails/send";

interface LoginProps {

}

const Login : FC<LoginProps> = (props : LoginProps) => {
    const [params, setParams] = useState<SendParams | null>(null);

    const [subject, setSubject] = useState();

    return (
        <h1>Admin</h1>
    );
}

export const getServerSideProps : GetServerSideProps = async (context) => {
    return { props: {  } as LoginProps }
}