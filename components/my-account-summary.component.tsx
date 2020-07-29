import React, { useState } from 'react';
import { Text } from 'react-native';
import styled from 'styled-components/native';
import Card from './card-component';
import THEME_COLORS from '../styles/theme.styles';
import ArrowUpGrayIcon from '../assets/icons/ic_arrow_up_gray.svg';
import moment from 'moment';
import useSummary from '../hooks/use-summary.hook';
import Loader from './loader.component';
import THEME_MEASUREMENTS from '../styles/measurements.styles';
import crashlytics from '@react-native-firebase/crashlytics';


const SummaryCard = styled(Card)`
  margin: 20px 0px;
`;

const HeaderCard = styled.View`
  flex-direction: row;
  justify-content: space-between;
  border-top-left-radius: ${THEME_MEASUREMENTS.BORDER_RADIUS.CARDS};
  border-top-right-radius: ${THEME_MEASUREMENTS.BORDER_RADIUS.CARDS};
  background-color: ${THEME_COLORS.PRIMARY};
  padding: 10px;
  margin-bottom: 12px;
  position:absolute;
  top:0;
  left:0;
  right:0;  
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 8px;
  margin-bottom: 8px;
`;

const LineSeparator = styled.View`
  border: 1px solid ${THEME_COLORS.LINES};
`;

const SummaryDateLabel = styled.Text`
  font-family: 'LibreFranklin-Light';  
  color: ${THEME_COLORS.WHITE};  
  font-size: 12px;
  right: 8px;
`;

const SummaryTotalLabel = styled.Text`
  font-family: 'LibreFranklin-Medium';  
  color: ${THEME_COLORS.WHITE};  
  font-size: 12px;
`;

const SummaryLabel = styled.Text<{ color: string; flex?: number }>`
  color: ${props => props.color};
  flex: ${props => props.flex || undefined};
  font-size: 12px;
  font-family: 'LibreFranklin-Regular';
`;

const SummaryValue = styled.Text<{ color: string }>`
  color: ${props => props.color};
  font-size: 16px;
  font-family: 'LibreFranklin-Medium';
  right: 8px;
`;

const ErrorLabel = styled.Text`
  text-align: center;
`;

const SummaryValueContainer = styled.View`
  flex-direction: row;
  flex: 1;
  justify-content: space-between;
`;

const MyAccountSummary = () => {
  const {
    loading,
    error,
    litres,
    availableLitres,
    money,
    availableMoney,
    annualProfitability,
    monthlyProfitability,
  } = useSummary();

  if (loading) {
    return (
      <SummaryCard style={{ height: 100 }}>
        <Loader height={40} width={40} />
      </SummaryCard>);
  }

  if (error) {
    crashlytics().recordError(error);
    return (
      <SummaryCard style={{ height: 100, justifyContent: "center" }}>
        <ErrorLabel>
          Error al obtener los datos de resumen.
        </ErrorLabel>
      </SummaryCard>);
  }

  return (
    <SummaryCard>
      <HeaderCard>
        <SummaryTotalLabel>Totales</SummaryTotalLabel>
        <SummaryDateLabel>{moment().format('DD/MM/YYYY')}</SummaryDateLabel>
      </HeaderCard>

      <Row style={{ marginTop: 40 }}>
        <SummaryLabel color={THEME_COLORS.PRIMARY}>
          Total en Litros
        </SummaryLabel>
        <SummaryValue color={THEME_COLORS.PRIMARY}>
          {Math.floor(litres).toLocaleString("es-ar")} lt
        </SummaryValue>
      </Row>

      <Row>
        <SummaryLabel color={THEME_COLORS.SUCCESS}>
          Total Disponible en Litros
        </SummaryLabel>
        <SummaryValue color={THEME_COLORS.SUCCESS}>
          {Math.floor(availableLitres).toLocaleString("es-ar")} lt
        </SummaryValue>
      </Row>

      <LineSeparator />

      <Row>
        <SummaryLabel color={THEME_COLORS.PRIMARY}>
          Dinero en cuenta
        </SummaryLabel>
        <SummaryValue color={THEME_COLORS.PRIMARY}>
          ${' '}
          {Math.floor(money).toLocaleString("es-ar")}
        </SummaryValue>
      </Row>

      <Row style={{ marginBottom: 0 }}>
        <SummaryLabel color={THEME_COLORS.SUCCESS}>
          Dinero Disponible
        </SummaryLabel>
        <SummaryValue color={THEME_COLORS.SUCCESS}>
          ${' '}
          {Math.floor(availableMoney).toLocaleString("es-ar")}
        </SummaryValue>
      </Row>

      {/*<LineSeparator />

      <Row>
        <SummaryLabel color={THEME_COLORS.FONT_REGULAR} flex={4}>
          Rentabilidad Anual
        </SummaryLabel>
        <SummaryValueContainer>
          <ArrowUpGrayIcon style={{marginTop: 2, marginRight: 2}} />
          <SummaryValue color={THEME_COLORS.FONT_REGULAR}>
            {Math.floor(annualProfitability)}%
          </SummaryValue>
        </SummaryValueContainer>
      </Row>

      <Row style={{marginTop: 0}}>
        <SummaryLabel color={THEME_COLORS.FONT_REGULAR} flex={4}>
          Rentabilidad Mensual
        </SummaryLabel>
        <SummaryValueContainer>
          <ArrowUpGrayIcon style={{marginTop: 2, marginRight: 2}} />
          <SummaryValue color={THEME_COLORS.FONT_REGULAR}>
            {Math.floor(monthlyProfitability)}%
          </SummaryValue>
        </SummaryValueContainer>
      </Row>*/}
    </SummaryCard>
  );
};

export default MyAccountSummary;
