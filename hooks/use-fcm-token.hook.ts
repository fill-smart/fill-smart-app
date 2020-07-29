import {SecurityContext} from './../contexts/security.context';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {ApolloClient} from 'apollo-client';
import {setContext} from 'apollo-link-context';
import {createHttpLink} from 'apollo-link-http';
import {gql} from 'apollo-boost';
import {useMutation} from '@apollo/react-hooks';
import {useState, useEffect, useContext} from 'react';
import Environment from '../environment/environment';

const SEND_FCM_TOKEN_MUTATION = gql`
  mutation registerFcmToken($token: String!) {
    registerFcmToken(data: {token: $token}) {
      success
    }
  }
`;

const UNREGISTER_FCM_TOKEN_MUTATION = gql`
  mutation unregisterFcmToken($token: String!) {
    unregisterFcmToken(data: {token: $token}) {
      success
    }
  }
`;

const useFcmToken = () => {
  const registerMutation = useMutation(SEND_FCM_TOKEN_MUTATION);
  const executeRegister = registerMutation[0];
  const registerToken = (token: string) => {
    executeRegister({
      variables: {
        token: token,
      },
    });
  };

  /* We need to create a custom apollo client, because the JWT token will arleady removed from the AsyncStorage*/
  const [security] = useContext(SecurityContext);
  //we save the last token before it gets deleted due to logout
  const [lastJwtToken, setLastJwtToken] = useState('');
  useEffect(() => {
    if (security.token !== '') {
      setLastJwtToken(security.token);
    }
  }, [security.token]);

  //Custom apollo client for this mutation
  const httpLink = createHttpLink({
    uri: Environment.apiUrl,
  });
  const authLink = setContext(async (_, {headers}) => {
    // get the authentication token from local storage if it exists
    const token = lastJwtToken;
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  const unregisterMutation = useMutation(UNREGISTER_FCM_TOKEN_MUTATION, {
    client: apolloClient,
  });
  const executeUnregister = unregisterMutation[0];

  const unregisterToken = (token: string) => {
    executeUnregister({
      variables: {
        token: token,
      },
    });
  };

  return {registerToken, unregisterToken};
};

export default useFcmToken;
