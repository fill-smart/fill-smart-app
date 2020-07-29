import React, {useContext} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import PumpWhiteIcon from '../assets/icons/ic_pump_white.svg';
import THEME_COLORS from '../styles/theme.styles';
import {DateUtils} from '@silentium-apps/fill-smart-common';
import styled from 'styled-components/native';
import {PurchaseFuelContext} from '../contexts/purchase-fuel.context';

const MovementDetailSeparator = () => {
  return (
    <View
      style={{backgroundColor: THEME_COLORS.LINES, width: '100%', height: 1}}
    />
  );
};

const IconTitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const FirstRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const DetailContainer = styled.View`
  background-color: ${THEME_COLORS.WHITE};
  border-radius: 5px;
  elevation: 2;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 10px;
`;

const IconContainer = styled.View`
  border-radius: 10px;
  height: 35px;
  width: 35px;
  align-items: center;
  justify-content: center;
  background-color: ${THEME_COLORS.PRIMARY};
`;
const TitleLabel = styled.Text`
  font-family: 'LibreFranklin-Regular';
  font-size: 16px;
  color: ${THEME_COLORS.FONT_NORMAL};
`;

const LeftSubtitleLabel = styled.Text`
  font-family: 'LibreFranklin-Thin';
  font-size: 14px;
  color: ${THEME_COLORS.FONT_NORMAL};
`;

const ValueText = styled.Text`
  font-family: 'LibreFranklin-Regular';
  font-size: 16px;
`;

const TitleSubtitleContainer = styled.View`
  margin-left: 10px;
  margin-right: 10px;
`;

const ValueContainer = styled.View`
  align-items: flex-end;
  align-self: flex-start;
`;

const RowContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  font-family: 'LibreFranklin-Regular';
  font-size: 12px;
`;

const RowText = styled.Text`
  color: ${THEME_COLORS.FONT_NORMAL};
`;

const PurchaseDetail = () => {
  const [purchase, _] = useContext(PurchaseFuelContext);
  const title = purchase.purchaseFuelAndQuantity?.fuelType.name!;
  const leftSubtitle = 'Compra';
  const date = DateUtils.format(new Date(), 'DD/MM/YYYY');
  const time = DateUtils.format(new Date(), 'hh:mm');
  const value = purchase.purchaseFuelAndQuantity?.litres!;
  const total = value * purchase.purchaseFuelAndQuantity?.fuelPrice.price!;

  const TotalRow = () => {
    return (
      <React.Fragment>
        <RowContainer>
          <RowText>Total</RowText>
          <RowText>
            $
            {total.toLocaleString("es-ar", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}
          </RowText>
        </RowContainer>
        <MovementDetailSeparator />
      </React.Fragment>
    );
  };

  const DateRow = () => {
    return (
      <React.Fragment>
        <RowContainer>
          <RowText>Fecha</RowText>
          <RowText>{date}</RowText>
        </RowContainer>
        <MovementDetailSeparator />
      </React.Fragment>
    );
  };

  const TimeRow = () => {
    return (
      <React.Fragment>
        <RowContainer>
          <RowText>Hora</RowText>
          <RowText>{time}</RowText>
        </RowContainer>
      </React.Fragment>
    );
  };

  const IconRender = () => {
    const icon = <PumpWhiteIcon width={21.43} height={15.77} />;
    return <IconContainer>{icon}</IconContainer>;
  };

  const ValueLabel = () => {
    let formattedValue =
      '+' +
      value?.toLocaleString("es-ar", {maximumFractionDigits: 2}) +
      ' lt';
    let textColor = THEME_COLORS.PRIMARY;

    return <ValueText style={{color: textColor}}>{formattedValue}</ValueText>;
  };

  return (
    <DetailContainer>
      <FirstRow>
        <IconTitleContainer>
          <IconRender />
          <TitleSubtitleContainer>
            <TitleLabel>{title}</TitleLabel>
            <LeftSubtitleLabel>{leftSubtitle}</LeftSubtitleLabel>
          </TitleSubtitleContainer>
        </IconTitleContainer>
        <ValueContainer>
          <ValueLabel />
        </ValueContainer>
      </FirstRow>
      <MovementDetailSeparator />
      <TotalRow />
      <DateRow />
      <TimeRow />
    </DetailContainer>
  );
};

export default PurchaseDetail;
