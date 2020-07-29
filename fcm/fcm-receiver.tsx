import React, { useContext } from 'react';
import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react';
import { FcmContext, FCM_ACTIONS } from '../contexts/fcm.context';
import crashlytics from '@react-native-firebase/crashlytics';

const requestPermission = async () => {
  try {
    return await messaging().requestPermission();
  }
  catch (err) {
    crashlytics().recordError(err);
    console.log("Error when requesting permissions: ", err)
    throw err;
  }
};

const registerAppWithFCM = async () => {
  await messaging().registerForRemoteNotifications();
};

const FcmReceiver = ({ children }: { children: Element }) => {
  const [fcm, dispatch] = useContext(FcmContext);
  useEffect(() => {
    console.log("FCM Receiver loaded")
    requestPermission().then(() => {
      console.log("Permission Granted")
      registerAppWithFCM();
      //Handle Push On Focused App
      messaging().onMessage(async remoteMessage => {
        console.log("On message Push Received: ", remoteMessage)
        const stringifiedPayload = remoteMessage.data!.payload;
        const payload = JSON.parse(stringifiedPayload);
        const { type, ...rest } = payload;
        dispatch({
          type: FCM_ACTIONS.SET_NOTIFICATION,
          payload: {
            notification: {
              type,
              ...rest,
            },
          },
        });
      });
      messaging()
        .getToken()
        .then(token => {
          console.log("FCM Token: ", token)
          dispatch({
            type: FCM_ACTIONS.SET_TOKEN,
            payload: {
              token,
            },
          });
        }).catch(err => {
          console.log("Error getting token:", err);
          crashlytics().recordError(err);
        });
    }).catch(err => { console.log("Error when requesting permission: ", err); crashlytics().recordError(err); });
  }, []);
  return <React.Fragment>{children}</React.Fragment>;
};

export default FcmReceiver;
