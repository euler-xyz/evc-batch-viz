import { Alert, AlertDescription, AlertIcon, AlertTitle } from "@chakra-ui/react";

type Props = { msg: string };

function ErrorBox({ msg }: Props) {
    return (
        <Alert status="error">
            <AlertIcon />
            <AlertTitle>An error occured while decoding batch.</AlertTitle>
            <AlertDescription >{msg}</AlertDescription>
        </Alert>
    );
}

export default ErrorBox;
