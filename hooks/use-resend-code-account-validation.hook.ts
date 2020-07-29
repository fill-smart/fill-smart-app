import {gql} from 'apollo-boost';
import {useMutation} from '@apollo/react-hooks';

export interface IResendCodeResult {
  resendActivationCode: {
    success: boolean;
  };
}

const RESEND_CODE_ACTIVATION = gql`
  mutation resendActivationCode {
    resendActivationCode {
      success
    }
  }
`;

const useResendActivationCode = () => {
  const [execute, {loading, data, error}] = useMutation<IResendCodeResult>(
    RESEND_CODE_ACTIVATION,
  );

  const reSendCode = () => execute();

  const isSuccess = data?.resendActivationCode.success;
  return {isSuccess, loading, error, reSendCode};
};

export default useResendActivationCode;
