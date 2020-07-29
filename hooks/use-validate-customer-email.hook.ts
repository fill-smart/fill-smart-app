import { gql } from 'apollo-boost';
import { apolloClient } from '../graphql/apollo-client';

export interface ICustomerEmailValidation {
  customers: {
    result: [
      {
        id: number;
        user: {
          username: string;
        };
      },
    ];
  };
}

const CUSTOMER_VALIDATE_EMAIL_QUERY = gql`
  query customerByEmail($filter: String!) {
    customers(criteria: {filter: $filter}) {
      result {
        id
        user {
          username
        }
      }
    }
  }
`;

export const emailExists = async (email: string) => {
  const result = await apolloClient.query<ICustomerEmailValidation>({
    query: CUSTOMER_VALIDATE_EMAIL_QUERY,
    variables: {
      filter: JSON.stringify({
        type: 'eq',
        property: 'user.username',
        value: email,
      }),
    },
    fetchPolicy: "no-cache"
  });

  return result.data.customers.result.length > 0;
};
