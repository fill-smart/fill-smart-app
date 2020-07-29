import React, { useState } from 'react';
import styled from 'styled-components/native';
import Card from './card-component';
import THEME_COLORS from '../styles/theme.styles';
import { WalletRecord } from '../hooks/use-wallets';

const AccountCard = styled(Card)`   
  margin-top: 10px;   
  margin-bottom: 10px;
  padding-top: 10px;
  padding-bottom: 10px;  
`;

const UpperRow = styled.View`
    flex-direction: row; 
    justify-content: space-between; 
    margin-top: 8px; 
    margin-bottom: 4px;
`;

const LowerRow = styled.View`
    flex-direction: row; 
    justify-content: space-between; 
    margin-top: 4px; 
    margin-bottom: 8px;
`;

const LineSeparator = styled.View`
  border: 1px solid ${THEME_COLORS.LINES};
`;

const Title = styled.Text`
    color: ${THEME_COLORS.FONT_REGULAR};
    font-size: 14px;
    font-family: 'LibreFranklin-Regular';
    margin-bottom: 6px;
`;

const AccountLabel = styled.Text`
    color: ${THEME_COLORS.FONT_NORMAL};   
    font-size: 12px;    
    font-family: 'LibreFranklin-Regular';
`;

const AccountSubLabel = styled.Text`
    color: ${THEME_COLORS.FONT_NORMAL};
    font-size: 12px;    
    font-family: 'LibreFranklin-Thin';
`;

const AccountValue = styled.Text<{ color: string, size: number }>`
    color: ${props => props.color};
    font-size: ${props => props.size + 'px'};
    font-family: 'LibreFranklin-Regular';
`;


const MyAccountItem = ({ wallet }:
    { wallet: WalletRecord }) => {
    const title = wallet.fuelType.name;
    const litres = wallet.litres;
    const money = wallet.litres * wallet.fuelType.currentPrice.price;
    const availableLitres = wallet.availableLitres;
    const availableMoney = wallet.availableLitres * wallet.fuelType.currentPrice.price;

    return (
        <AccountCard>
            <Title >{title}</Title>

            <LineSeparator />

            <UpperRow>
                <AccountLabel>Mis litros</AccountLabel>
                <AccountValue color={THEME_COLORS.PRIMARY} size={14}>
                    {litres.toLocaleString("es-ar", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2})} lt
                </AccountValue>
            </UpperRow>

            <LowerRow>
                <AccountSubLabel>Equivale a</AccountSubLabel>
                <AccountValue color={THEME_COLORS.FONT_NORMAL} size={12}>
                    $ {money.toLocaleString("es-ar", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2})}
                </AccountValue>
            </LowerRow>

            <LineSeparator />

            <UpperRow>
                <AccountLabel>Mis litros disponibles</AccountLabel>
                <AccountValue color={THEME_COLORS.SUCCESS} size={14}>
                    {availableLitres.toLocaleString("es-ar", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2})} lt
                </AccountValue>
            </UpperRow>

            <LowerRow>
                <AccountSubLabel>Equivale a</AccountSubLabel>
                <AccountValue color={THEME_COLORS.FONT_NORMAL} size={12}>
                    $ {availableMoney.toLocaleString("es-ar", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2})}
                </AccountValue>
            </LowerRow>

        </AccountCard>
    );
}

export default MyAccountItem;