import {useMutation} from '@apollo/react-hooks';
import {IUserModel} from './../models/user.model';
import {gql} from 'apollo-boost';
import {
  SecurityContext,
  SECURITY_ACTIONS,
} from './../contexts/security.context';
import {useContext, useEffect} from 'react';

interface ILoginMutationResult {
  token: string;
  user: IUserModel & {
    customer: {      
      firstName: string;
      lastName: string;
      profileImage: string;
      status: 'ACTIVE' | 'INACTIVE'
      cbu: string;
      cbuAlias: string;
      mercadopagoAccount: string;
    };
  };
}

const SIGN_IN_QUERY = gql`
  mutation SignIn($username: String!, $password: String!) {
    login(credentials: {username: $username, password: $password}) {
      token
      user {
        id
        username
        customer {          
          firstName
          lastName
          profileImage
          status
          cbu
          cbuAlias
          mercadopagoAccount
        }
        roles {
          name
        }
      }
    }
  }
`;

const useLogin = () => {
  const [signIn, {loading, data, error}] = useMutation<{
    login: ILoginMutationResult;
  }>(SIGN_IN_QUERY);
  const [state, dispatch] = useContext(SecurityContext);

  const doLogin = (username: string, password: string) => {
    signIn({
      variables: {
        username,
        password,
      },
    });
  };

  const doLogout = () => {
    dispatch({
      type: SECURITY_ACTIONS.CLEAR_AUTHENTICATION,
    });
  };

  const isAuthenticated = state.token !== '';
  const isActive = state.user?.customer.status === 'ACTIVE';
  const jwt = state.token;

  useEffect(() => {
    if (data) {
      dispatch({
        type: SECURITY_ACTIONS.SET_AUTHENTICATION,
        payload: {
          token: data.login.token,
          user: {
            id: data.login.user.id,
            username: data.login.user.username,
            customer: {              
              firstName: data.login.user.customer.firstName,
              lastName: data.login.user.customer.lastName,
              status: data.login.user.customer.status,
              profileImage: data.login.user.customer.profileImage,
              cbu: data.login.user.customer.cbu,
              cbuAlias: data.login.user.customer.cbuAlias,
              mercadopagoAccount: data.login.user.customer.mercadopagoAccount,
            },
            roles: data.login.user.roles,
          },
        },
      });
    }
  }, [data]);

  return {isAuthenticated, isActive, loading, error, jwt, doLogin, doLogout};
};

export default useLogin;
