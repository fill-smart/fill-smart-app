import {gql} from 'apollo-boost';
import {useMutation} from '@apollo/react-hooks';


export interface IActivateAccountRequest {
  code: number;
}

export interface IActivateAccountResult {
  activateAccount: {
    success: boolean;
  };
}

const ACTIVATE_ACCOUNT_MUTATION = gql`
  mutation activateAccount($code: String!) {
    activateAccount(data: {code: $code}) {
      success
    }
  }
`;

const useActivateAccount = () => {
  const [execute, {loading, data, error}] = useMutation<IActivateAccountResult>(
    ACTIVATE_ACCOUNT_MUTATION,
  );

  const executeActivateAccount = (code: string) => {
    execute({
      variables: {
        code,
      },
    });
  };

  const isSuccess = data?.activateAccount.success
  return {isSuccess, loading, error, executeActivateAccount};
};

export default useActivateAccount;
