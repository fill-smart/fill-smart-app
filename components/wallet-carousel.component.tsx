import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { FlatList, Dimensions, View, Animated } from 'react-native';
import WalletCard from './wallet-card.component';
import useWallets from '../hooks/use-wallets';
import Loader from './loader.component';
import Card from './card-component';
import THEME_COLORS from '../styles/theme.styles';
import crashlytics from '@react-native-firebase/crashlytics';


const screenWidth = Math.round(Dimensions.get('window').width);
const cardWidth = (screenWidth - 15 * 5) / 2;
const expandedCardWidth = cardWidth * 2 + 25;

const WalletCarouselSeparator = styled.View`
  width: 15px;
`;

const WalletCarouselHorizontalPadding = styled.View`
  width: 25px;
  background-color: blue;
`;

const LoadingContainer = styled.View`
  flex-direction: row;
`;

const ErrorContainer = styled.View`
  justify-content: center;
`;

const ErrorLabel = styled.Text`
  text-align: center;
`;

const LitresCard = styled(Card)`
  height: 120px;
  width: ${cardWidth}px;
  margin: 1px;
`;

const CarouselPointContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: 18px;
`;

const CarouselPoint = styled.View`
  height: 10px;
  width: 10px;
  border-radius: 5px;
  background-color: ${THEME_COLORS.INFO_LIGHT};
  margin-right: 9px;
  margin-left: 9px;
  overflow: hidden;
`;

const CarouselPointActive = styled(Animated.View)` 
  height: 10px;
  width: 10px;
  border-radius: 5px;
  background-color: ${THEME_COLORS.INFO};
  position: absolute;
  top: 0px;
  left: 0px;
`;

let pressedItemIndex = 0;

const WalletCarousel = () => {
  const { wallets, loading, error } = useWallets();
  const walletList = useRef<FlatList<any>>(null);
  const [expandItems, setExpandItems] = useState(false);
  let animVal = new Animated.Value(0);

  if (loading) {
    return (
      <LoadingContainer>
        <LitresCard>
          <Loader height={40} width={40} />
        </LitresCard>
        <WalletCarouselSeparator />
        <LitresCard>
          <Loader height={40} width={40} />
        </LitresCard>
      </LoadingContainer>
    );
  };

  if (error) {
    crashlytics().recordError(error);
    return (
      <ErrorContainer>
        <ErrorLabel>Error al obtener los datos de billeteras.</ErrorLabel>
      </ErrorContainer>
    );
  };

  const onItemPressed = (index: number) => {
    pressedItemIndex = index;
    setExpandItems(!expandItems);
  };

  const onAnimationFinish = () => {
    walletList?.current?.scrollToIndex({ index: pressedItemIndex, viewOffset: 25 });
  };

  const handleScroll = ({ nativeEvent }: any) => {
    if (expandItems) {
      walletList?.current?.scrollToOffset({ offset: (expandedCardWidth + 17) * Math.floor(nativeEvent.contentOffset.x / expandedCardWidth) });
    };
  };

  return (
    <View>
      <FlatList
        ref={walletList}
        data={wallets}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <WalletCard
            expand={expandItems}
            key={item.id}
            title={item.fuelType.name}
            totalLitres={item.litres}
            totalMoney={item.fuelType.currentPrice.price * item.litres}
            availableLitres={item.availableLitres}
            availableMoney={item.fuelType.currentPrice.price * item.availableLitres}
            fuelPrice={item.fuelType.currentPrice.price}
            onPress={() => onItemPressed(index)}
            onAnimationFinish={() => onAnimationFinish()}
          />
        )}
        horizontal
        pagingEnabled
        ListHeaderComponent={WalletCarouselHorizontalPadding}
        ItemSeparatorComponent={WalletCarouselSeparator}
        ListFooterComponent={WalletCarouselHorizontalPadding}
        style={{ marginHorizontal: -25 }}
        onMomentumScrollEnd={handleScroll}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: animVal } } }]
        )}
        onScrollToIndexFailed={()=>{}}
      // scrollEventThrottle={16}
      />

      {expandItems ?
        <CarouselPointContainer>
          {wallets?.map((_, index) => {
            const scrollBarVal = animVal.interpolate({
              inputRange: [(expandedCardWidth + 17) * (index - 1), (expandedCardWidth + 17) * (index + 1)],
              outputRange: [-20, 20],
              extrapolate: 'clamp',
            });

            return (
              <CarouselPoint key={index}>
                <CarouselPointActive
                  style={{
                    transform: [
                      { translateX: scrollBarVal },
                    ]
                  }}
                />
              </CarouselPoint>
            )
          })
          }
        </CarouselPointContainer>
        :
        <CarouselPointContainer>
          {wallets?.slice(0, Math.ceil(wallets.length / 2)).map((_, index) => {
            const scrollBarVal = animVal.interpolate({
              inputRange: [(expandedCardWidth + 17) * (index - 1), (expandedCardWidth + 17) * (index + 1)],
              outputRange: [-20, 20],
              extrapolate: 'clamp',
            });

            return (
              <CarouselPoint key={index}>
                <CarouselPointActive
                  style={{
                    transform: [
                      { translateX: scrollBarVal },
                    ]
                  }}
                />
              </CarouselPoint>
            )
          })
          }
        </CarouselPointContainer>
      }
    </View>
  );
};

export default WalletCarousel;