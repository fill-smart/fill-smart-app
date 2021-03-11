import React, { useEffect, useContext, useState } from 'react';
import useFcmNotifications from '../hooks/use-fcm-notification.hook';
import { PushNotificationTypesEnum } from '../contexts/fcm.context';
import useParameters from '../hooks/use-parameters.hook';
import useLogin from '../hooks/use-login.hook';
import useNotifications from '../hooks/use-notifications';
import useWallets from '../hooks/use-wallets';
import useFuelPriceVariations from '../hooks/use-fuel-price-variations.hook';
import TransferNotificationModal from '../components/transfer-notification-modal.component';
import { operationsRefetch } from '../pages/home/home';


const FcmHandler = ({ children }: { children: Element }) => {
  const [showTransferNotification, setShowTransferNotification] = useState(false);
  const { isAuthenticated } = useLogin();
  const purchaseSuccessHandler = useFcmNotifications<{ receiptId: number }>(
    PushNotificationTypesEnum.PurchaseSuccess,
  );

  //Cash Withdrawal Request Push Handler
  const cashWithdrawPaymentRequestHandler = useFcmNotifications<{
    ammount: number;
  }>(PushNotificationTypesEnum.CashWithdrawalPaymentRequest);

  useEffect(() => {
    if (cashWithdrawPaymentRequestHandler.notification) {
      console.log(
        'Cash Withdrawal Request: ',
        cashWithdrawPaymentRequestHandler.notification,
      );
    }
  }, [cashWithdrawPaymentRequestHandler.notification]);

  const shopPurchasePaymentRequestHandler = useFcmNotifications<{
    ammount: number;
    description: string;
  }>(PushNotificationTypesEnum.ShopPurchasePaymentRequest);

  useEffect(() => {
    if (shopPurchasePaymentRequestHandler.notification) {
      console.log(
        'Shop Purchase Request: ',
        shopPurchasePaymentRequestHandler.notification,
      );
    }
  }, [shopPurchasePaymentRequestHandler.notification]);


  //Grace Period Changed
  const gracePeriodChanged = useFcmNotifications(PushNotificationTypesEnum.GracePeriodChanged);
  const exchangeGracePeriodChanged = useFcmNotifications(PushNotificationTypesEnum.ExchangeGracePeriodChanged);
  const { refetch: refetchGracePeriod } = useParameters();

  useEffect(() => {
    if (isAuthenticated && gracePeriodChanged) {
      console.log("Grace period changed!");
      refetchGracePeriod();
    }
  }, [gracePeriodChanged.notification])

  useEffect(() => {
    if (isAuthenticated && exchangeGracePeriodChanged) {
      console.log("Exchange grace period changed!");
      refetchGracePeriod();
    }
  }, [exchangeGracePeriodChanged.notification])

  useEffect(() => {
    if (isAuthenticated && exchangeGracePeriodChanged) {
      console.log("Exchange grace period changed!");
      refetchGracePeriod();
    }
  }, [exchangeGracePeriodChanged.notification])

  //Fuel Type Name Changed
  const fuelTypeNameChanged = useFcmNotifications(PushNotificationTypesEnum.FuelTypeNameChanged);
  const { refetch: refetchWallets } = useWallets();
  const { refetch: refetchFuelPriceVariations } = useFuelPriceVariations();
  
  useEffect(() => {
    if (isAuthenticated && fuelTypeNameChanged) {
      refetchWallets();
      operationsRefetch();
      refetchFuelPriceVariations();
    }
  }, [fuelTypeNameChanged.notification])

  //Global notifications
  const globalNotifications = useFcmNotifications<{
    id: number;
    title: string;
    text: string;
  }>(PushNotificationTypesEnum.GlobalMessage);
  const { refetch: refetchGlobalNotifications } = useNotifications();

  useEffect(() => {
    if (globalNotifications.notification) {
      console.log('Global Notification Received', globalNotifications.notification);
      refetchGlobalNotifications();
    }
  }, [globalNotifications.notification]);

  const transferWithdrawalAuthorized = useFcmNotifications(PushNotificationTypesEnum.TransferWithdrawalAuthorized);

  useEffect(() => {
    if (isAuthenticated && transferWithdrawalAuthorized) {
      refetchWallets();
      operationsRefetch();
    }
  }, [transferWithdrawalAuthorized.notification]);

  //Transfer recieved
  const transferRecieved = useFcmNotifications(PushNotificationTypesEnum.TransferRecieved);

  useEffect(() => {
    if (isAuthenticated && transferRecieved) {
      refetchWallets();
      operationsRefetch();
      setShowTransferNotification(true);
    }
  }, [transferRecieved.notification])

  return(
    <React.Fragment>
      {transferRecieved.notification ? 
        <TransferNotificationModal 
          isModalVisible={showTransferNotification} 
          onClose={() => { setShowTransferNotification(false) }}
          data={transferRecieved.notification as {name: string, amount: number, wallet: string}}
        />
      : null}
      {children}
    </React.Fragment>
  );
};

export default FcmHandler;
