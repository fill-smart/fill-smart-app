import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import THEME_COLORS from '../styles/theme.styles';
import PumpWatermark from '../assets/icons/ic_pump_background.svg';
import {
  GestureResponderEvent,
  Dimensions,
  TouchableWithoutFeedback,
  UIManager,
  Platform,
  LayoutAnimation,
} from 'react-native';
import Card from './card-component';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
};

const screenWidth = Math.round(Dimensions.get('window').width);
const cardWidth = (screenWidth - 15 * 5) / 2;
const expandedCardWidth = cardWidth * 2 + 25;
const cardHeight = 120;
const expandedCardHeight = cardHeight * 2;

const LitresCard = styled(Card)`
  height: ${cardHeight}px;
  width: ${cardWidth}px;
  margin: 1px;
`;

const TitleContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const Separator = styled.View`
  background-color: ${THEME_COLORS.LINES};
  height: 1px;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const TotalQuantitiesContainer = styled.View`
  justify-content: flex-end;
  flex: 1;
`;

const AvailableQuantitiesContainer = styled.View`
  justify-content: flex-end;
`;

const TotalMoney = styled.Text`
  font-family: LibreFranklin-Light;
  font-size: 12px;
  color: ${THEME_COLORS.FONT_NORMAL};
`;

const TotalLitres = styled.Text`
  font-family: LibreFranklin-Medium;
  font-size: 20px;
  color: ${THEME_COLORS.PRIMARY};
`;

const LitresTitle = styled.Text`
  font-family: LibreFranklin-Thin;
  font-size: 16px;
  text-align: center;
  color: ${THEME_COLORS.FONT_REGULAR};
`;

const AvailableMoney = styled.Text`
  font-family: LibreFranklin-Light;
  font-size: 12px;
  color: ${THEME_COLORS.FONT_NORMAL};
`;

const AvailableLitres = styled.Text`
  font-family: LibreFranklin-Medium;
  font-size: 20px;
  color: ${THEME_COLORS.SUCCESS};
  text-align: center;
`;

const Title = styled.Text`
  font-family: LibreFranklin-Thin;
  font-size: 20px;
  color: ${THEME_COLORS.FONT_REGULAR};
`;

const LitrePrice = styled.Text`
  font-family: LibreFranklin-Thin;
  font-size: 20px;
`;

const EquivalentTo = styled.Text`
  font-family: LibreFranklin-Thin;
  font-size: 12px;
  color: ${THEME_COLORS.FONT_NORMAL};
`;

const AvailableMoneyContainer = styled.Text`
  text-align: center;
`;

const TotalMoneyContainer = styled.View`
  flex-direction: row;
`;

const WatermarkWrapper = styled.View`
  position: absolute;
  left: 14px;
  bottom: 11px;
`;

const WalletCard = ({
  title,
  totalLitres,
  totalMoney,
  availableLitres,
  availableMoney,
  fuelPrice,
  expand,
  onPress,
  onAnimationFinish,
}: {
  title: string;
  totalLitres: number;
  totalMoney: number;
  availableLitres: number;
  availableMoney: number;
  fuelPrice: number;
  expand?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  onAnimationFinish?: () => void,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    LayoutAnimation.configureNext({
      duration: 300,
      create: 
      {
         type: LayoutAnimation.Types.easeInEaseOut,
         property: LayoutAnimation.Properties.opacity,
      },
      update: 
      {
         type: LayoutAnimation.Types.easeInEaseOut,
      }
     }, onAnimationFinish);
    setIsExpanded(expand!);
  }, [expand]);


  return (
    <TouchableWithoutFeedback onPress={onPress ?? undefined}>
      <LitresCard style={{ width: isExpanded ? expandedCardWidth : cardWidth, height: isExpanded ? expandedCardHeight : cardHeight }}>
        <TitleContainer>
          <Title>{title}</Title>
          <LitrePrice style={{ opacity: isExpanded ? 1 : 0 }}> ${fuelPrice.toLocaleString("es-ar", { maximumFractionDigits: 2 })}</LitrePrice>
        </TitleContainer>

        {isExpanded ? <Separator /> : null}

        <TotalQuantitiesContainer style={{ alignItems: isExpanded ? "center" : "flex-end" }}>
          <LitresTitle style={{ opacity: isExpanded ? 1 : 0, marginBottom: isExpanded ? 10 : 0 }}>Mis Litros</LitresTitle>
          <TotalLitres style={{ marginBottom: isExpanded ? 10 : 0 }}>
            {Math.floor(totalLitres).toLocaleString("es-ar") + ' lt'}
          </TotalLitres>
          <TotalMoneyContainer>
            {isExpanded ? <EquivalentTo>Equivale a </EquivalentTo> : null}
            <TotalMoney>
              {'$ ' + Math.floor(totalMoney).toLocaleString("es-ar")}
            </TotalMoney>
          </TotalMoneyContainer>
        </TotalQuantitiesContainer>

        {isExpanded ? <Separator /> : null}

        {isExpanded ?
          <AvailableQuantitiesContainer style={{ opacity: isExpanded ? 1 : 0 }}>
            <LitresTitle style={{ opacity: isExpanded ? 1 : 0, marginBottom: isExpanded ? 10 : 0 }}>Litros Disponibles</LitresTitle>
            <AvailableLitres style={{ marginBottom: isExpanded ? 10 : 0 }}>
              {Math.floor(availableLitres).toLocaleString("es-ar") + ' lt'}
            </AvailableLitres>
            <AvailableMoneyContainer>
              <EquivalentTo>Equivale a </EquivalentTo>
              <AvailableMoney>
                {'$ ' + Math.floor(availableMoney).toLocaleString("es-ar")}
              </AvailableMoney>
            </AvailableMoneyContainer>
          </AvailableQuantitiesContainer>
          : null}

        <WatermarkWrapper style={{ opacity: isExpanded ? 0 : 1 }}>
          <PumpWatermark />
        </WatermarkWrapper>
      </LitresCard>
    </TouchableWithoutFeedback>
  );
};

export default WalletCard;
