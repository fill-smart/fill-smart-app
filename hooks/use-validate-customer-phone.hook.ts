import { gql } from 'apollo-boost';
import { apolloClient } from '../graphql/apollo-client';

export interface ICustomerPhoneValidation {
  customers: {
    result: [
      {
        id: number;
        phone: string;
      },
    ];
  };
}

const CUSTOMER_VALIDATE_PHONE_QUERY = gql`
  query customerByPhoneNumber($filter: String!) {
  customers(criteria: {filter: $filter}){    
    result{  
      id    
      phone
    }
  }  
}
`;

export const phoneExists = async (phoneNumber: string) => {
  const result = await apolloClient.query<ICustomerPhoneValidation>({
    query: CUSTOMER_VALIDATE_PHONE_QUERY,
    variables: {
      filter: JSON.stringify({
        and: [
          {
            type: 'eq',
            property: 'phone',
            value: phoneNumber,
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
