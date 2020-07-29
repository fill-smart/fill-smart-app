import {ApolloClient} from 'apollo-client';
import {setContext} from 'apollo-link-context';
import {createHttpLink} from 'apollo-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import AsyncStorage from '@react-native-community/async-storage';
import Environment from '../environment/environment';


const httpLink = createHttpLink({
  uri: Environment.apiUrl,
});
const authLink = setContext(async (_, {headers}) => {
  // get the authentication token from local storage if it exists
  const token = await AsyncStorage.getItem('jwt-token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});
const cache = new InMemoryCache();
export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
});

