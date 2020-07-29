import {gql} from 'apollo-boost';
import {useMutation} from '@apollo/react-hooks';


export interface IProfileUploadImageRequest {
    image: string;
}

export interface IProfileUploadImageResult {
    uploadImageProfile: {
        customer: {
            id: string;
            profileImage: string;
        }
    }
};

const PROFILE_UPLOAD_IMAGE_MUTATION = gql`
  mutation uploadImageProfile($image: String!) {
    uploadImageProfile(data: {image: $image}) {
        customer{
            id
        }
    }
  }
`;

const useProfileUploadImage = () => {
  const [execute, {loading, data, error}] = useMutation<IProfileUploadImageResult>(
    PROFILE_UPLOAD_IMAGE_MUTATION,
  );
  
  const executeUploadImage = (requestData: IProfileUploadImageRequest) => {
    execute({
      variables: {
        image: requestData.image
      }
    });
  };

  const customerId = data?.uploadImageProfile.customer.id;
  return {customerId, loading, error, executeUploadImage};
};

export default useProfileUploadImage;
