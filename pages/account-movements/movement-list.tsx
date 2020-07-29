import React from 'react';
import MovementList from '../../components/movement-list.component';
import styled from 'styled-components/native';

const Container = styled.View`
  /* padding:24px; */
`;

const MovementListPage = () => {
  return (
    <Container>
      <MovementList />
    </Container>
  );
};

MovementListPage.navigationOptions = {
  title: 'Movimientos',
};

export default MovementListPage;