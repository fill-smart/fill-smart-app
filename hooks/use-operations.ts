import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { useContext, useEffect } from "react";
import { SecurityContext } from "../contexts/security.context";
import crashlytics from '@react-native-firebase/crashlytics';
import { IFilterCriteria, IAndFilterCriteria } from "../filters";
import { StringValueNode } from "graphql";


export interface IOperation {
  id: number;
  stamp: Date;
  fuelTypeId: number;
  fuelTypeName: string;
  gasStationName: string;
  gasStationId: number;
  customerFirstName: string;
  customerLastName: string;
  customerDocumentNumber: string;
  fuelPrice: number;
  litres: number;
  operationTypeId: number;
  operationTypeName: string;
  pumpExternalId: string;
  exchangeSourceFuelType: string;
  userId: number;
  targetCustomerFirstName: string;
  targetCustomerLastName: string;
  targetUserId: number;
  transferWithdrawalId: number | null;
  transferWithdrawalAuthorized: boolean | null;
}

export interface IOperationsResult {
  operations: {
    pageInfo: {
      total: number;
    };
    result: IOperation[];
  };
}

const LIST_OPERATIONS_QUERY = gql`
  query listOperations(
    $max: Int
    $skip: Int
    $sort: String
    $filter: String
  ) {
    operations(criteria: {max: $max, skip: $skip, sort: $sort, filter: $filter}) {
      pageInfo {
        total
      }
      result {
        id
        stamp
        fuelTypeId
        fuelTypeName
        gasStationName
        gasStationId
        customerFirstName
        customerLastName
        customerDocumentNumber
        fuelPrice
        litres
        operationTypeId
        operationTypeName
        pumpExternalId
        exchangeSourceFuelType
        targetCustomerFirstName
        targetCustomerLastName
        targetUserId
        userId
        transferWithdrawalId
        transferWithdrawalAuthorized
      }
    }
  }
`;

const useOperations = (criteria?: {
  pagination?: { current: number; pageSize: number };
  sort?: Array<{ property: string; descending: boolean }>;
  filter?: IFilterCriteria;
}) => {
  const max = criteria?.pagination ? criteria.pagination.pageSize : undefined;
  const skip = criteria?.pagination
    ? criteria.pagination.current * criteria.pagination.pageSize - criteria.pagination.pageSize : undefined;

  const { data, loading, error, refetch } = useQuery<IOperationsResult>(
    LIST_OPERATIONS_QUERY,
    {
      variables: {
        filter: criteria?.filter ? JSON.stringify(criteria?.filter) : undefined,
        max,
        skip,
        sort: JSON.stringify(criteria?.sort),
      },
      fetchPolicy: 'network-only'
    }
  );

  if (error) {
    crashlytics().recordError(error);
    //show a message
  }

  const operations = data?.operations.result;
  const total = data?.operations.pageInfo.total;
  return { operations, loading, error, total, refetch };
};

export default useOperations;