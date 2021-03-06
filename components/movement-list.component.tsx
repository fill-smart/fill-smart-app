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
      <TouchableOpacity onPress={onPress ?? undefined}>
        <FooterContainer>
          <FooterText>Ver todos los movimientos   </FooterText>
          <ArrowSimpleRightIcon />
        </FooterContainer>
      </TouchableOpacity>
    </React.Fragment>
  );
};


let latestOp: IOperation[] | undefined = [];

const MovementList = ({
  onRefetchChange,
}: {
  onRefetchChange?: (refetch: (variables?: Record<string, any> | undefined) => Promise<ApolloQueryResult<IOperationsResult>>) => void,
}) => {

  const [operationList, setOperationList] = useState<Array<IOperation>>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingPage, setLoadingPage] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState(false);
  const [state] = useContext(SecurityContext);

  const listCriteria: QueryCriteria = {
    pagination: {
      current: currentPage,
      pageSize: 15
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

  const onRefresh = () => {
    refetch({
      filter: JSON.stringify(listCriteria.filter),
      max: listCriteria.pagination.pageSize,
      skip: 0,
      sort: JSON.stringify(listCriteria.sort),
    })
    setRefreshing(true);
  };

  useEffect(() => {
    let timer: any;
    if (refreshing) {
      timer = setTimeout(() => setRefreshing(false), 4000);
    }
    return () => { timer ?? clearTimeout(timer) };
  }, [refreshing])

  useEffect(() => {
    if (onRefetchChange) {
      onRefetchChange(refetch);
    }
  }, [refetch]);

  useEffect(() => {
    if (operations) {
      if (refreshing) {
        setCurrentPage(1);
        setOperationList([...operations!]);
        setRefreshing(false);
      } else {
        setOperationList([...operationList, ...operations!]);
      }
    }
  }, [operations])

  useEffect(() => {
    latestOp = operations;
    if (operations) {
      setLoadingPage(false);
    }
  }, [operationList])

  const changeCurrentPage = () => {
    if (!loadingPage) {
      setCurrentPage(currentPage + 1);
      setLoadingPage(true);
    }
  }

  if (loadingPage && operationList.length === 0) {
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
    <Container style={{ borderRadius: 0 }}>
      {
        operationList && operationList.length > 0 ?
          <FlatList
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            data={operationList} keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => <MovementListItem item={item} isTouchable={true} />}
            ItemSeparatorComponent={MovementListSeparator}
            ListFooterComponent={loadingPage ?
                <ActivityIndicator animating size="large" />
                : null}
            showsVerticalScrollIndicator={false}
            onEndReached={(latestOp?.length === 0) ? null : changeCurrentPage}
            onEndReachedThreshold={0.1}
          />
          :
          <ErrorLabel>
            No tienes operaciones realizadas.
          </ErrorLabel>
      }
    </Container>
  );
};

export default MovementList;
