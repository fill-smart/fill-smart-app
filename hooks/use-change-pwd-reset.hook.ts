import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';


export interface IResetPasswordCode {
    resetPassword: {
        success: boolean
    }
}

const RESET_PASSWORD_MUTATION = gql`
  mutation resetPwd($username:String!, $code: String!, $newPassword: String!){
      resetPassword(data:{username:$username, code:$code, newPassword:$newPassword} ){
        success    
  }
}
`;

const useChangePwdReset = () => {
    const [execute, { loading, data, error }] = useMutation<IResetPasswordCode>(
        RESET_PASSWORD_MUTATION,
    );

    const executeResetPwd = (username: string, code: string, newPassword: string) => {
        execute({
            variables: {
                username,
                code,
                newPassword
            },
        });
    };

    const isSuccess = data?.resetPassword.success
    return { isSuccess, loading, error, executeResetPwd };
};

export default useChangePwdReset;
