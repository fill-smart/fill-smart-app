import React from 'react';
import styled from 'styled-components/native';
import THEME_COLORS from '../../styles/theme.styles';
import Card from '../../components/card-component';
import ArrowUpGreenIcon from '../../assets/icons/ic_arrow_up_green.svg';
import ArrowDownRedIcon from '../../assets/icons/ic_arrow_down_red.svg';
import EqualsIcon from '../../assets/icons/ic_equals_orange.svg';
import useFuelPriceVariations, {
  IFuelTypePriceWithVariation,
} from '../../hooks/use-fuel-price-variations.hook';
import moment from 'moment';
import Loader from '../../components/loader.component';
import { View } from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import { ApolloError } from 'apollo-boost';

const PricesCard = styled(Card)`
  height: 180px;  
  margin-bottom: 25px;
`;

const FuelPriceVariationName = styled.Text`
  font-family: 'LibreFranklin-Regular';
  color: ${THEME_COLORS.FONT_REGULAR};
  flex: 4;
  font-size: 12px;
`;

const FuelPriceVariationValueContainer = styled.View`
  flex-direction: row;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

const FuelPriceVariationValue = styled.Text`
  font-family: 'LibreFranklin-Regular';
  color: ${THEME_COLORS.FONT_REGULAR};
  margin-left: 2px;
  font-size: 14px;
  right: 10px;
`;

const FuelPriceVariationItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const LineSeparator = styled.View`
  border: 1px solid ${THEME_COLORS.LINES};
  margin-bottom: 15px;
`;

const SummaryDate = styled.Text`
  color: ${THEME_COLORS.INFO};
  font-size: 12px;
  font-family: 'LibreFranklin-Thin';
`;

const Equals = styled(EqualsIcon)`
  position: absolute;
  top: 4px;
  right: 2px;
`;

const ArrowUp = styled(ArrowUpGreenIcon)`
  position: absolute;
  top: 4px;
  right: 2px;
`;

const ArrowDown = styled(ArrowDownRedIcon)`
  position: absolute;
  top: 4px;
  right: 2px;
`;

const ErrorLabel = styled.Text`
  text-align: center;
`;

const FuelPriceVariation = ({ type }: { type: IFuelTypePriceWithVariation }) => {
  const Icon =
    type.priceVariationType === 'equals' ? (
      <Equals />
    ) : type.priceVariationType === 'decrease' ? (
      <ArrowDown />
    ) : (
          <ArrowUp />
        );
  return (
    <FuelPriceVariationItem>
      <FuelPriceVariationName>{type.name}</FuelPriceVariationName>
      <FuelPriceVariationValueContainer>
        <FuelPriceVariationValue>
          ${' '}
          {type.price.toLocaleString("es-ar", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })}
        </FuelPriceVariationValue>
        {Icon}
      </FuelPriceVariationValueContainer>
    </FuelPriceVariationItem>
  );
};

const FuelPricesVariation = ({
  fuelTypesWithPrices,
  loading,
  error,
}: {
  fuelTypesWithPrices: IFuelTypePriceWithVariation[] | undefined,
  loading: boolean,
  error: ApolloError | undefined,
}) => {
  if (loading) {
    return (
      <PricesCard>
        <Loader height={40} width={40} />
      </PricesCard>);
  }

  if (error) {
    crashlytics().recordError(error);
    return (
      <PricesCard style={{ height: 100, justifyContent: "center" }}>
        <ErrorLabel>
          Error al obtener los datos de precios de combustibles.
        </ErrorLabel>
      </PricesCard>);
  }

  return (
    <PricesCard>
      <SummaryDate>{moment().format('DD/MM/YYYY')}</SummaryDate>

      <LineSeparator />
      {fuelTypesWithPrices?.map((type, index) => (
        <FuelPriceVariation type={type} key={index} />
      ))}
    </PricesCard>
  );
};

export default FuelPricesVariation;
