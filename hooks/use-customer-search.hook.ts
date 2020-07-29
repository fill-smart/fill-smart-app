import { gql } from 'apollo-boost';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { ICustomerModel } from '../models/customer.model';

export interface ICustomerSearch {
    customerSearch: Pick<ICustomerModel, "id" | "firstName" | "lastName" | "documentNumber">[]
}

const CUSTOMER_SEARCH_QUERY = gql`
  query customerSearch($search:String!) {
    customerSearch(search:$search){
        id
        firstName
        lastName
        documentNumber    
    }
  }   
`;

const useCustomerSearch = () => {
    const [execute, { data, loading, error }] = useLazyQuery<ICustomerSearch>(CUSTOMER_SEARCH_QUERY);

    const searchCustomers = (search: string) => {
        execute({
            variables: { search },
        })
    }
    return { searchCustomers, data, loading, error };
};

export default useCustomerSearch;