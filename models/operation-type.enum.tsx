import React from 'react';
import THEME_COLORS from "../styles/theme.styles";
import PumpWhiteIcon from '../assets/icons/ic_pump_white.svg';
import PumpBuyWhiteIcon from '../assets/icons/ic_pump_buy_white.svg';
import WithdrawalWhiteIcon from '../assets/icons/ic_topup_white.svg';
import PayInStoreWhiteIcon from '../assets/icons/ic_pay_in_store_white.svg';
import ExchangeWalletsWhiteIcon from '../assets/icons/ic_exchange_wallets_white.svg';
import TransferWhiteIcon from '../assets/icons/ic_transfer_litres_white.svg';


enum OperationType {
    Refuel = "1",
    Purchase = "2",
    PaymentInStore = "3",
    Withdrawal = "4",
    Exchange = "5",
    Transfer = "6"
};

interface IOperationStyle {
    iconBackgroundColor: string,
    iconComponent: Element,
    fontColor: string,
}

export const OperationStyles = new Map<string, IOperationStyle>([
    [OperationType.Refuel, {
            iconBackgroundColor: THEME_COLORS.WARNING, 
            iconComponent: <PumpWhiteIcon width={21.43} height={15.77}/>, 
            fontColor: THEME_COLORS.FONT_NORMAL
    }],
    [OperationType.Purchase, {
        iconBackgroundColor: THEME_COLORS.PRIMARY, 
        iconComponent: <PumpBuyWhiteIcon width={16.2} height={17.28}/>, 
        fontColor: THEME_COLORS.PRIMARY
    }],
    [OperationType.PaymentInStore, {
        iconBackgroundColor: THEME_COLORS.VIOLET, 
        iconComponent: <PayInStoreWhiteIcon width={15.39} height={22.6}/>, 
        fontColor: THEME_COLORS.DANGER
    }],
    [OperationType.Withdrawal, {
        iconBackgroundColor: THEME_COLORS.SUCCESS, 
        iconComponent: <WithdrawalWhiteIcon width={17.45} height={20.45}/>, 
        fontColor: THEME_COLORS.DANGER
    }],
    [OperationType.Exchange, {
        iconBackgroundColor: THEME_COLORS.SECONDARY, 
        iconComponent: <ExchangeWalletsWhiteIcon width={20.38} height={21.74}/>, 
        fontColor: THEME_COLORS.PRIMARY
    }],
    [OperationType.Transfer, {
        iconBackgroundColor: THEME_COLORS.TRANSFER_LITRES, 
        iconComponent: <TransferWhiteIcon width={20.32} height={21.52}/>, 
        fontColor: THEME_COLORS.DANGER
    }],
]);

export default OperationType;