import {GoogleLogin} from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode';


export const GoogleLoginComponent = () => {
    return (
        <GoogleLogin
            onSuccess={credentialResponse => {
                if (credentialResponse.credential) {
                    const decoded = jwtDecode(credentialResponse.credential);
                    console.log(decoded);
                } else {
                    console.log('Credential is undefined');
                }
            }}
            onError={() => {
                console.log('Login Failed');
            }}
        />);
};
