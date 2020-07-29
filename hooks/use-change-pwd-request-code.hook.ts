import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';


export interface IRequestPasswordCode {
    requestResetPasswordCode: {
        success: boolean
    }
}

const REQUEST_PASSWORD_CODE = gql`
  mutation requestPwdCode($username:String!){
      requestResetPasswordCode(data:{username:$username} ){
        success    
      }
    }
`;

const useChangePwdRequestCode = () => {
    const [execute, { loading, data, error }] = useMutation<IRequestPasswordCode>(
        REQUEST_PASSWORD_CODE,
    );

    const executeRequestCode = (username: string) => {
        execute({
            variables: {
                username
            },
        });
    };

    const isSuccess = data?.requestResetPasswordCode.success
    return { isSuccess, loading, error, executeRequestCode };
};

export default useChangePwdRequestCode;
