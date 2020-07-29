import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';

export type TermsConditions = {
  id: string;
  terms: string;
  created: Date;
};

export interface ITermsConditionsResult {
  termsAndConditions: {
    result: TermsConditions[];
  };
}

const TERMS_CONDITIONS_QUERY = gql`
  query lastTermsAndConditions($sort: String!) {
    termsAndConditions(criteria: {max: 1, sort: $sort}) {
      result {
        id
        terms
      }
    }
  }
`;

const useTermsConditions = () => {
  const { data, loading, error } = useQuery<ITermsConditionsResult>(
    TERMS_CONDITIONS_QUERY,
    {
      variables: {
        sort: JSON.stringify([{
          property: 'created',
          descending: true,
        }]),
      },
    },
  );

  let terms = data?.termsAndConditions.result[0]?.terms;

  return { terms, loading, error };
};

export default useTermsConditions;
