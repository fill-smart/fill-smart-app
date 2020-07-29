import React from 'react';
import {ApolloProvider} from '@apollo/react-hooks';
import {apolloClient} from './graphql/apollo-client';
import Navigator from './routing/routes';

import ContextsContainer from './ContextsContainer';
import FcmReceiver from './fcm/fcm-receiver';
import FcmHandler from './fcm/fcm-handler';
import Environment from './environment/environment';
import { Text } from 'react-native';
import { enableScreens } from 'react-native-screens';

enableScreens();

(Text as any).defaultProps = (Text as any).defaultProps || {};
(Text as any).defaultProps.allowFontScaling = false;

const App = () => {
  console.log("Environment: ", Environment);
  return(
  <ApolloProvider client={apolloClient}>
    <ContextsContainer>
      <FcmReceiver>
        <FcmHandler>
          <Navigator />
        </FcmHandler>
      </FcmReceiver>
    </ContextsContainer>
  </ApolloProvider>
)};
export default App;
