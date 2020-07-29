import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';

export interface IApiInfo {
    hash: string;
    version: string;
}

export interface IApiInfoResult {
    apiInfo: {
        hash: string;
        version: string;
    };
}

const APIINFO_QUERY = gql`
  query {    
        apiInfo{
            hash
            version
        }    
    }
  `;

const useApiInfo = () => {
    const { data, loading, error } = useQuery<IApiInfoResult>(APIINFO_QUERY);
    const apiVersion = data?.apiInfo.version;
    return { apiVersion, loading, error };
};

export default useApiInfo;
