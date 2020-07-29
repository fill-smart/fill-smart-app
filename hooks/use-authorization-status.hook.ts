import { gql } from 'apollo-boost';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';

export interface IAuthorizationStatusInfo {
    authorizationById: {
        id: string,
        status: "PENDING" | "AUTHORIZED" | "REJECTED",
    }
}

const AUTHORIZATION_STATUS_QUERY = gql`
  query getAuthorizationStatus($authorizationId:ID!){
  authorizationById(id:$authorizationId){
    id
    status    
  }
}
  `;

const useAuthorizationStatus = () => {
    const [execute, { data, loading, error }] = useLazyQuery<IAuthorizationStatusInfo>(AUTHORIZATION_STATUS_QUERY, {
        fetchPolicy: "no-cache"
    });

    const getAuthorizationStatusById = (authorizationId: string) => {
        execute({
            variables: { authorizationId },
        })
    }
    return { getAuthorizationStatusById, data, loading, error };
};

export default useAuthorizationStatus;