import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';


export interface IChangePasswordResult {
    changePassword: {
        success: boolean
    }
}

const CHANGE_PASSWORD_MUTATION = gql`
  mutation changePassword($currentPassword:String!, $newPassword: String!){
      changePassword(data:{currentPassword:$currentPassword, newPassword:$newPassword} ){
        success    
  }
}
`;

const useChangePassword = () => {
    const [execute, { loading, data, error }] = useMutation<IChangePasswordResult>(
        CHANGE_PASSWORD_MUTATION,
    );

    const executeChangePassword = (currentPassword: string, newPassword: string) => {
        execute({
            variables: {
                currentPassword,
                newPassword
            },
        });
    };

    const isSuccess = data?.changePassword.success
    return { isSuccess, loading, error, executeChangePassword };
};

export default useChangePassword;
