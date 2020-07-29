import {gql} from 'apollo-boost';
import {useMutation} from '@apollo/react-hooks';
import { useEffect, useContext } from 'react';
import { SecurityContext, SECURITY_ACTIONS } from '../contexts/security.context';
import { ICustomerModel } from '../models/customer.model';


export interface IEditProfileRequest {
    firstName: string;
    lastName: string;
    documentNumber: string;
    cbu: string;
    cbuAlias: string;
    mercadopagoAccount: string;
}

export interface IEditProfileResult {
    editProfile: {
      id: string;
      firstName: string;
      lastName: string;
      cbu: string;
      cbuAlias: string;
      mercadopagoAccount: string;
    };
};

const EDIT_PROFILE_MUTATION = gql`
  mutation editProfile(
    $firstName: String!, 
    $lastName: String!, 
    $documentNumber: String!, 
    $cbu: String, 
    $cbuAlias: String, 
    $mercadopagoAccount: String) {
    editProfile(data: {
      firstName: $firstName, 
      lastName: $lastName, 
      documentNumber: $documentNumber
      cbu: $cbu
      cbuAlias: $cbuAlias
      mercadopagoAccount: $mercadopagoAccount
    }) {
        id
        firstName
        lastName
        cbu
        cbuAlias
        mercadopagoAccount
    }
  }
`;

const useEditProfile = () => {
  const [execute, {loading, data, error}] = useMutation<IEditProfileResult>(
    EDIT_PROFILE_MUTATION,
  );
  
  const executeEditProfile = (requestData: IEditProfileRequest) => {
    execute({
      variables: {
        firstName: requestData.firstName,
        lastName: requestData.lastName,
        documentNumber: requestData.documentNumber,
        cbu: requestData.cbu,
        cbuAlias: requestData.cbuAlias,
        mercadopagoAccount: requestData.mercadopagoAccount,
      },
    });
  };

  const operationId = data?.editProfile.id;
  return {operationId, loading, error, executeEditProfile};
};

export default useEditProfile;
