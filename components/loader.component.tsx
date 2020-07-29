import React from 'react';
import styled from 'styled-components/native';
import LottieView from 'lottie-react-native';

const LoaderContainer = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const Loader = ({height, width}: {height?: number, width?: number}) => {
    const LottieWrapper = styled.View`
    width: ${width ?? 75}px;
    height: ${height ?? 75}px;
  `;

  return (
    <LoaderContainer>
      <LottieWrapper>
        <LottieView source={require('../lottie/loader.json')} autoPlay loop />
      </LottieWrapper>
    </LoaderContainer>
  );
};
export default Loader;
