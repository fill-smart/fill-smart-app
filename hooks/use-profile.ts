import {ICustomerModel} from '../models/customer.model';
import {gql} from 'apollo-boost';
import {useQuery} from '@apollo/react-hooks';
import { useEffect, useContext } from 'react';
import { SECURITY_ACTIONS, SecurityContext } from '../contexts/security.context';

export type ProfileRecord = Pick<
  ICustomerModel,
  | 'id'
  | 'firstName'
  | 'lastName'
  | 'documentNumber'
  | 'born'
  | 'phone'
  | 'profileImage'  
  | 'cbu'
  | 'cbuAlias'
  | 'mercadopagoAccount'
>;

export interface IProfileResult {
  me: {
    username: string;
    customer: ProfileRecord;
  };
}

const PROFILE_QUERY = gql`
  query getProfile {
    me {        
      username
      customer {
          firstName
          lastName
          documentNumber
          born
          phone
          profileImage
          cbu
          cbuAlias
          mercadopagoAccount          
      }
    }
  }
`;

const useProfile = () => {
  const {data, loading, error, refetch} = useQuery<IProfileResult>(PROFILE_QUERY, {fetchPolicy: "no-cache"});
  const [_, dispatch] = useContext(SecurityContext);
  
  useEffect(() => {
    if (data){
      dispatch({
        type: SECURITY_ACTIONS.UPDATE_CUSTOMER,
        payload: {
          firstName: data.me.customer.firstName,
          lastName: data.me.customer.lastName,
          status: "ACTIVE",
          profileImage: data.me.customer.profileImage,
          cbu: data.me.customer.cbu,
          cbuAlias: data.me.customer.cbuAlias,
          mercadopagoAccount: data.me.customer.mercadopagoAccount
        },
      });
    }
  }, [data]);

  const profile = data?.me;
  return {profile, loading, error, refetch};
};

export default useProfile;
