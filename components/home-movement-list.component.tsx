import React, { useEffect, useContext, useState, useRef } from 'react';
import styled from "styled-components/native";
import { FlatList, TouchableOpacity, GestureResponderEvent, ActivityIndicator, View, RefreshControl } from "react-native";
import THEME_COLORS from '../styles/theme.styles';
import ArrowSimpleRightIcon from '../assets/icons/ic_arrow_simple_right.svg';
import useOperations, { IOperation, IOperationsResult } from '../hooks/use-operations';
import MovementListItem from './movement-list-item.component';
import Loader from './loader.component';
import crashlytics from '@react-native-firebase/crashlytics';
import { QueryCriteria, FilterTypesEnum } from '../filters';
import { SecurityContext } from '../contexts/security.context';
import { ApolloQueryResult } from 'apollo-boost';
import { PurchaseStatusEnum } from '../models/purchase.model';


const Container = styled.View`
    background-color: ${THEME_COLORS.WHITE};
    /* border-radius: 10px;  */
    padding: 10px;
    padding-top: 0px;    
    elevation: 2;
`;

const ErrorLabel = styled.Text`
  margin-top: 10px;
  text-align: center;
  font-family: "LibreFranklin-Regular";
  font-size: 14px;
  color: ${THEME_COLORS.FONT_REGULAR};
`;

const MovementListSeparator = styled.View`
    background-color: ${THEME_COLORS.LINES};
    width: 100%;
    height: 1px;
`;

const FooterContainer = styled.View`
    flex-direction: row;
    background-color: ${THEME_COLORS.WHITE};
    width: 100%;
    height: 35px;
    justify-content: center;
    align-items: center;
    padding-top: 10px;
`;

const FooterText = styled.Text`
    color: ${THEME_COLORS.INFO};
    font-family: "LibreFranklin-Regular";
    font-size: 12px;
`;

const MovementListFooter = ({ onPress }: { onPress?: (event: GestureResponderEvent) => void }) => {
  return (
    <React.Fragment>
      <MovementListSeparator />
      <TouchableOpacity onPress={onPress}>
        <FooterContainer>
          <FooterText>Ver todos los movimientos   </FooterText>
          <ArrowSimpleRightIcon />
        </FooterContainer>
      </TouchableOpacity>
    </React.Fragment>
  );
};

const HomeMovementList = ({
  onFooterPress,
  onRefetch,
}: {
  onFooterPress?: (event: GestureResponderEvent) => void,
  onRefetch?: (refetch: (variables?: Record<string, any> | undefined) => Promise<ApolloQueryResult<IOperationsResult>>) => void,
}) => {

  const [state] = useContext(SecurityContext);

  const listCriteria: QueryCriteria = {
    pagination: {
      current: 1,
      pageSize: 6
    },
    sort: [{
      property: "stamp",
      descending: true
    }],
    filter: {
      and: [
        {
          or: [
            {
              property: "authorizationStatus",
              value: "",
              type: FilterTypesEnum.IsNull
            },
            {
              property: "authorizationStatus",
              value: "authorized",
              type: FilterTypesEnum.Equals
            }
          ],
        },
        {
          or: [
            {
              property: "transferWithdrawalAuthorized",
              value: true,
              type: FilterTypesEnum.Equals
            },
            {
              property: "transferWithdrawalAuthorized",
              value: "",
              type: FilterTypesEnum.IsNull
            },
          ]
        },
        {
          or: [
            {
              property: "userId",
              value: state?.user?.id,
              type: FilterTypesEnum.Equals
            },
            {
              property: "targetUserId",
              value: state?.user?.id,
              type: FilterTypesEnum.Equals
            },
          ]
        },
        {
          or: [
            {
              property: "purchaseStatus",
              value: PurchaseStatusEnum.Completed,
              type: FilterTypesEnum.Equals
            },
            {
              property: "purchaseStatus",
              value: "",
              type: FilterTypesEnum.IsNull
            },
          ]
        }
      ]
    }
  };

  const { operations, loading, error, refetch } = useOperations(listCriteria);

  useEffect(() => {
    if (onRefetch) {
      onRefetch(refetch);
    }
  }, [refetch]);

  if (loading) {
    return (
      <Container style={{ height: 100 }}>
        <Loader height={40} width={40} />
      </Container>);
  }

  if (error) {
    crashlytics().recordError(error);
    return (
      <Container style={{ height: 100, justifyContent: "center" }}>
        <ErrorLabel>
          Error al obtener los datos de movimientos.
        </ErrorLabel>
      </Container>
    );
  }

  return (
    <Container style={{ borderRadius: 10 }}>
      {
        operations && operations.length > 0 ?
          <FlatList
            data={operations} keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => <MovementListItem item={item} isTouchable={false} />}
            ItemSeparatorComponent={MovementListSeparator}
            ListFooterComponent={<MovementListFooter onPress={onFooterPress ?? undefined} />}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
          :
          <ErrorLabel>
            No tenes operaciones realizadas.
          </ErrorLabel>
      }
    </Container>
  );
};

export default HomeMovementList;
