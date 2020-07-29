import { Platform } from 'react-native';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import { RefuelContext } from '../contexts/refuel.context';
import { useContext, useEffect } from 'react';
import { ICustomerModel } from '../models/customer.model';
import { RegisterContext } from '../contexts/register-user.context';
import moment from 'moment';
import { IUserModel } from '../models/user.model';
import { SecurityContext, SECURITY_ACTIONS, ISetAuthenticationAction } from '../contexts/security.context';

export interface IRegisterRequest {
  firstName: string;
  lastName: string;
  documentNumber: string;
  born: Date;
  phone: string;
  username: string;
  password: string;
}

export interface IRegisterResult {
  register: {
    token: string;
    user: IUserModel & {
      customer: {
        firstName: string;
        lastName: string;
        status: 'ACTIVE' | 'INACTIVE';
      };
    };
  };
}

const REGISTER_MUTATION = gql`
  mutation register(
    $firstName: String!
    $lastName: String!
    $documentNumber: String!
    $born: Date!
    $phone: String!
    $username: String!
    $password: String!
    $dniFrontImage: String!
    $dniBackImage: String!
    $imagesRotation: Int
  ) {
    register(
      data: {
        firstName: $firstName
        lastName: $lastName
        documentNumber: $documentNumber
        born: $born
        phone: $phone
        username: $username
        password: $password
        dniFrontImage: $dniFrontImage
        dniBackImage: $dniBackImage
        imagesRotation: $imagesRotation
      }
    ) {
      token
      user {
        id
        username
        customer {
          firstName
          lastName
          status
        }
        roles {
          name
        }
      }
    }
  }
`;

const useRegistration = () => {
  const [execute, { loading, data, error }] = useMutation<IRegisterResult>(
    REGISTER_MUTATION,
  );
  const [register, _] = useContext(RegisterContext);
  const [__, dispatch] = useContext(SecurityContext);

  const executeRegister = () => {
    execute({
      variables: {
        firstName: register.firstName,
        lastName: register.lastName,
        documentNumber: register.documentNumber,
        born: moment(register.born!).format('YYYY-MM-DD'),
        phone: register.phone,
        username: register.username,
        password: register.password,
        dniFrontImage: register.documentImageFrontPath,
        dniBackImage: register.documentImageBackPath,
        imagesRotation: Platform.OS === 'ios' ? -180 : undefined,
      },
    });
  };

  useEffect(() => {
    if (data) {
      dispatch({
        type: SECURITY_ACTIONS.SET_AUTHENTICATION,
        payload: {
          token: data.register.token,
          user: {
            id: data.register.user.id,
            username: data.register.user.username,
            customer: {
              firstName: data.register.user.customer.firstName,
              lastName: data.register.user.customer.lastName,
              status: data.register.user.customer.status,
            },
            roles: data.register.user.roles,
          },
        },
      } as ISetAuthenticationAction);
    }
  }, [data]);

  const customer = data?.register.user.customer;
  return { customer, loading, error, executeRegister };
};

export default useRegistration;
