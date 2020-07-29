import { gql } from 'apollo-boost';
import { IPageInfoModel } from '../models/page-info.model';
import { IFuelTypeModel } from '../models/fuel-type.model';
import { useContext } from 'react';
import { SecurityContext } from '../contexts/security.context';
import { useQuery } from '@apollo/react-hooks';
import { INotificationModel } from 'models/notification.model';

export type NotificationRecord = Pick<
  INotificationModel,
  'id' | 'created' | 'title' | 'text'
>;

export interface INotificationResult {
  notifications: {
    result: NotificationRecord[];
  };
}

const NOTIFICATION_QUERY = gql`
  query getNotifications($maxRecords: Int!, $sort: String!) {
    notifications(criteria: {max: $maxRecords, sort: $sort}) {
      result {
        id
        text
        title
        created
      }
    }
  }
`;

const useNotifications = (max: number = 10) => {
  const [state] = useContext(SecurityContext);

  const { data, loading, error, refetch } = useQuery<INotificationResult>(
    NOTIFICATION_QUERY,
    {
      variables: {
        maxRecords: max,
        sort: JSON.stringify([
          {
            property: 'created',
            descending: true,
          },
        ]),
      },
      fetchPolicy: "no-cache"
    },
  );

  const notifications = data?.notifications.result;
  return { notifications, loading, error, refetch };
};

export default useNotifications;
