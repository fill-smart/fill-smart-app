import React from 'react';
import styled from "styled-components/native";
import { TouchableOpacity, GestureResponderEvent } from "react-native";
import THEME_COLORS from '../styles/theme.styles';
import ArrowSimpleRightIcon from '../assets/icons/ic_arrow_simple_right.svg';
import { IOperation } from '../hooks/use-operations';
import MovementListItem from './movement-list-item.component';
import Loader from './loader.component';
import crashlytics from '@react-native-firebase/crashlytics';
import { ApolloError } from 'apollo-boost';
import Card from './card-component';


const Container = styled(Card)`
  padding-top: 0px;    
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
  operations,
  loading,
  error,
  onFooterPress,
}: {
  operations: IOperation[] | undefined,
  loading: boolean,
  error: ApolloError | undefined,
  onFooterPress?: (event: GestureResponderEvent) => void,
}) => {  
  if (error) {
    crashlytics().recordError(error);
    return (
      <Container style={{ minHeight: 100, justifyContent: "center" }}>
        <ErrorLabel>
          Error al obtener los datos de movimientos.
        </ErrorLabel>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container style={{ minHeight: 100 }}>
        <Loader height={40} width={40} />
      </Container>);
  }

  return (
    <Container style={{ borderRadius: 10 }}>
      {
        operations && operations.length > 0 ?
          <>
            {operations.map((op, index) => {
              return(
                  <React.Fragment key={index.toString()}>
                    <MovementListItem item={op} isTouchable={false} />
                    <MovementListSeparator />
                  </React.Fragment>
              )
            })}
            <MovementListFooter onPress={onFooterPress ?? undefined} />
          </>
          :
          <ErrorLabel>
            No tenes operaciones realizadas.
          </ErrorLabel>
      }
    </Container>
  );
};

export default HomeMovementList;
