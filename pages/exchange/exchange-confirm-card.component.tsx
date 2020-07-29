import React, {useContext} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import ExchangeWalletsWhiteIcon from '../../assets/icons/ic_exchange_wallets_white.svg';
import THEME_COLORS from '../../styles/theme.styles';
import {DateUtils} from '@silentium-apps/fill-smart-common';
import styled from 'styled-components/native';
import { ExchangeWalletContext } from '../../contexts/exchange-wallets.context';

const Separator = () => {
  return (
    <View
      style={{backgroundColor: THEME_COLORS.LINES, width: '100%', height: 1}}
    />
  );
};

const IconTitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

const DetailContainer = styled.View`
  background-color: ${THEME_COLORS.WHITE};
  border-radius: 10px;
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
  align-self: flex-start;
  background-color: ${THEME_COLORS.SECONDARY};
`;

const TitleLabel = styled.Text`
  font-family: 'LibreFranklin-Regular';
  font-size: 16px;
  color: ${THEME_COLORS.FONT_NORMAL};
`;

const SubtitleLabel = styled.Text`
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
  flex: 1;
`;

const ValueContainer = styled.View`
  align-items: flex-end;
  align-self: flex-start;
`;

const RowContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  min-height: 40px;
  font-family: 'LibreFranklin-Regular';
  font-size: 12px;
`;

const RowText = styled.Text`
  color: ${THEME_COLORS.FONT_NORMAL};
`;

const ExchangeConfirmCard = () => {
  const [exchangeContext, _] = useContext(ExchangeWalletContext);
  const title = exchangeContext.sourceFuelType?.name! + " a " + exchangeContext.targetFuelType?.name!;
  const leftSubtitle = 'Canje billeteras';
  const date = DateUtils.format(new Date(), 'DD/MM/YYYY');
  const time = DateUtils.format(new Date(), 'hh:mm');
  const value = exchangeContext.targetLitres!;
  const total = exchangeContext.targetLitres! * exchangeContext.targetFuelType?.currentPrice.price!;

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
        <Separator />
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
        <Separator />
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
    const icon = <ExchangeWalletsWhiteIcon width={20.38} height={21.74}/>;
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
      <RowContainer style={{marginBottom: 10}}>
        <IconTitleContainer>
          <IconRender />
          <TitleSubtitleContainer>
            <TitleLabel>{title}</TitleLabel>
            <SubtitleLabel>{leftSubtitle}</SubtitleLabel>
          </TitleSubtitleContainer>
        </IconTitleContainer>
        <ValueContainer>
          <ValueLabel />
        </ValueContainer>
      </RowContainer>
      <Separator />
      <TotalRow />
      <DateRow />
      <TimeRow />
    </DetailContainer>
  );
};

export default ExchangeConfirmCard;
