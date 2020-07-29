import { gql } from 'apollo-boost';
import { apolloClient } from '../graphql/apollo-client';

export interface ICustomerValidation {
  customers: {
    result: [
      {
        id: number;
        documentNumber: string;
      },
    ];
  };
}

const CUSTOMER_VALIDATE_DOCUMENT_QUERY = gql`
  query customerByDocumentNumber($filter: String!) {
    customers(criteria: {filter: $filter}) {
      result {
        id
        documentNumber
      }
    }
  }
`;

export const dniExists = async (dni: string) => {
  const result = await apolloClient.query<ICustomerValidation>({
    query: CUSTOMER_VALIDATE_DOCUMENT_QUERY,
    variables: {
      filter: JSON.stringify({
        and: [
          {
            type: 'eq',
            property: 'documentNumber',
            value: dni,
          },
          {
            type: 'eq',
            property: 'status',
            value: 'active',
          }
        ]
      }),
    },
    fetchPolicy: "no-cache"
  });

  return result.data.customers.result.length > 0;
};
