import React, {useContext} from 'react';
import {View} from 'react-native';
import {useNavigation} from 'react-navigation-hooks';
import ShowStatusBarLayout from '../../layouts/show-status-bar.layout';
import IconMessage from '../../components/icon-message.component';
import ErrorIcon from '../../assets/icons/ic_error.svg';
import styled from 'styled-components/native';
import Button from '../../components/button.component';
import {RefuelContext, REFUEL_ACTIONS} from '../../contexts/refuel.context';
import {NavigationActions, StackActions} from 'react-navigation';
import { getRoutePath, HOME_ROUTE, APP_ROUTES} from '../../routing/routes';

const Container = styled.View`
  background-color: white;
  height: 100%;
  padding: 25px;
  justify-content: center;
  align-items: center;
`;

const InfoPanel = styled.View`
  flex: 1;
  width: 100%;
  flex-grow: 1;
`;

const ActionPanel = styled.View`
  width: 100%;
  height: 100px;
`;

const RefuelDniRejectedPage = () => {
  const navigation = useNavigation();
  const [_, dispatch] = useContext(RefuelContext);
  const finish = () => {
    dispatch({type: REFUEL_ACTIONS.CLEAN_STORE});
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: getRoutePath(APP_ROUTES.Main, APP_ROUTES),
        }),
      ],
    });
    navigation.dispatch(resetAction);
  };
  return (
    <ShowStatusBarLayout>
      <Container>
        <InfoPanel>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <IconMessage
              icon={<ErrorIcon />}
              title="Confirmacion de DNI"
              text="Su DNI no pudo ser confirmado."
            />
          </View>
        </InfoPanel>
        <ActionPanel>
          <Button label="Ok" onPress={finish} />
        </ActionPanel>
      </Container>
    </ShowStatusBarLayout>
  );
};

RefuelDniRejectedPage.navigationOptions = {
  title: 'Cargar',
};


export default RefuelDniRejectedPage;
