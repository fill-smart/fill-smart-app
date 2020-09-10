import React, { useContext, useEffect, useState } from 'react';
import ShowStatusBarLayout from '../../layouts/show-status-bar.layout';
import styled from 'styled-components/native';
import Input from '../../components/input.component';
import THEME_COLORS from '../../styles/theme.styles';
import { Alert, TouchableOpacity, View } from 'react-native';
import useCustomerSearch from '../../hooks/use-customer-search.hook';
import { FlatList } from 'react-native-gesture-handler';
import { ICustomerModel } from '../../models/customer.model';
import Loader from '../../components/loader.component';
import { TRANSFER_ACTIONS, TransferContext } from '../../contexts/transfer.context';
import { useNavigation } from 'react-navigation-hooks';
import { HOME_ROUTE, getRoutePath } from '../../routing/routes';
import Button from '../../components/button.component';


const Container = styled.View`
    padding: 25px;
    flex: 1;
`;

const Title = styled.Text`
  align-self: center;
  font-family: 'LibreFranklin-Regular';
  font-size: 14px;
  margin-bottom: 15px;
  text-align: center;
`;

const NotificationCard = styled.View`
  background-color: ${THEME_COLORS.WHITE};
  border-radius: 10px;
  padding: 16px 14px;   
  margin: 2px 2px; 
  elevation: 2;
`;

const NotificationTitle = styled.Text`
  font-family: "LibreFranklin-Regular";
  font-size:16px;
  color: ${THEME_COLORS.FONT_REGULAR};
  margin-bottom:9px;
`;

const NotificationText = styled.Text`
  font-family: "LibreFranklin-Thin";
  font-size:14px;
  color: ${THEME_COLORS.FONT_REGULAR};
`;

const UserNotFoundText = styled.Text`
  align-self: center;
  font-family: 'LibreFranklin-Thin';
  font-size: 14px;
  text-align: center;
`;

const color: { label: string; border: string, text: string } | undefined = { label: THEME_COLORS.TRANSFER_LITRES, border: THEME_COLORS.TRANSFER_LITRES, text: THEME_COLORS.FONT_REGULAR };

const TransferSearchUserPage = () => {
    const navigation = useNavigation();
    const [search, setSearch] = useState('');
    const {searchCustomers, data, loading} = useCustomerSearch();
    const [_, dispatch] = useContext(TransferContext);

    const enterSearch = () => {
        searchCustomers(search);
    };

    const selectCustomer = (item: Pick<ICustomerModel, "id" | "firstName" | "lastName" | "documentNumber">) => {
        dispatch({
            type: TRANSFER_ACTIONS.SET_SELECTED_CUSTOMER,
            payload: { selectedCustomer: item },
        });
        navigation.navigate(getRoutePath(HOME_ROUTE.TransferAmountSelection, HOME_ROUTE));
    };

    return (
        <ShowStatusBarLayout>
            <Container>
                <Title>Busque por DNI</Title>
                <Input
                    onSubmitEditing={enterSearch}
                    returnKeyType="done"
                    blurOnSubmit={false}
                    autoCapitalize="none"
                    keyboardType="numeric"
                    colors={color}
                    key="search"
                    placeholder="Ingrese su búsqueda..."
                    text={search}
                    style={{backgroundColor: "white"}}
                    onChangeText={text => setSearch(text)}
                />
                <Button label="Buscar" style={{marginTop: 20}} colors={{background: THEME_COLORS.TRANSFER_LITRES}} onPress={enterSearch}/>

                <View style={{marginTop: 25}}>
                    {loading ? <Loader height={30} width={30} /> 
                        : data?.customerSearch.length === 0 ?
                        <UserNotFoundText>
                            No se encontró ningún usuario con ese DNI.
                        </UserNotFoundText> 
                        :
                        <FlatList data={data?.customerSearch} keyExtractor={(_, index) => index.toString()}
                            renderItem={({ item, index }) =>
                                <TouchableOpacity onPress={() => selectCustomer(item)}>
                                    <NotificationCard>
                                        <NotificationTitle>{item.firstName + ' ' + item.lastName}</NotificationTitle>
                                        <NotificationText>{"DNI: " + item.documentNumber}</NotificationText>
                                    </NotificationCard>
                                </TouchableOpacity>
                            }
                            showsVerticalScrollIndicator={false}
                        />
                    }
                </View>
            </Container>
        </ShowStatusBarLayout>
    );
};

TransferSearchUserPage.navigationOptions = {
    title: 'Transferir litros',
};

export default TransferSearchUserPage;