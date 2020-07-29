import {
  IPushNotification,
  FcmContext,
  PushNotificationTypesEnum,
} from './../contexts/fcm.context';
import {useState, useContext, useEffect} from 'react';

const useFcmNotifications = <T>(filteredType: PushNotificationTypesEnum) => {
  const [notification, setNotification] = useState<T | null>(null);
  const [state, dispatch] = useContext(FcmContext);
  useEffect(() => {
    if (state.notification) {
      const {type, ...rest} = state.notification;
      if (type === filteredType) {
        setNotification(rest as T);
      }
    }
  }, [state.notification]);
  return {notification};
};

export default useFcmNotifications;
