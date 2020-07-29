import React from 'react';
import styled from 'styled-components/native';
import THEME_COLORS from '../styles/theme.styles';

const DarkenedPage = styled.ScrollView`
  background-color: ${THEME_COLORS.BACKGROUND_DARK};
  flex: 1
`;

export default DarkenedPage;
