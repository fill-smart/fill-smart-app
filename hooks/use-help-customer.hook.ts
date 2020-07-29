import { Platform } from 'react-native';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import { useContext, useEffect } from 'react';

export interface IHelpSendQuery {
    message: string;
    contactType: string;
}


export interface IHelpSendQueryResult {
    HelpCustomerSendQuery: {
        success: boolean;
    }
}

const HELP_SEND_QUERY_MUTATION = gql`
  mutation HelpCustomerSendQuery($message: String!, $contactType:String!){
  HelpCustomerSendQuery(data:{message: $message,  contactType:$contactType}){
     success
  }
}
`;

const useHelpCustomer = () => {
    const [execute, { loading, data, error }] = useMutation<IHelpSendQueryResult>(
        HELP_SEND_QUERY_MUTATION,
    );

    const executeSendHelpQuery = (data: IHelpSendQuery) => {
        execute({
            variables: {
                message: data.message,
                contactType: data.contactType
            }
        });
    };

    const result = data?.HelpCustomerSendQuery.success;
    return { result, loading, error, executeSendHelpQuery };
};

export default useHelpCustomer;
