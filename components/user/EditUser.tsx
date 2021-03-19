import { FC, useCallback } from 'react';

import { get } from 'lodash';

import { Formik, Form, FormikHelpers } from 'formik';

import Modal from 'components/common/Modal';
import Input from 'components/common/Input';
import AvatarPicker from 'components/avatar/AvatarPicker';
import LoadingOverlay from 'components/loading/LoadingOverlay';

import useUser from 'hooks/useUser';
import useModal from 'hooks/useModal';

import USER_QUERY from 'graphql/queries/user';

import { User, useUpdateUserMutation, UpdateUserMutation } from 'generated/graphql';
import { MutationUpdaterFn } from '@apollo/client';

type FormValues = Pick<User, 'name' | 'status' | 'avatarColor' | 'avatarIcon'>;

const EditUser: FC = () => {
  const me = useUser();

  const { closeModal } = useModal();

  const [updateUser, { loading }] = useUpdateUserMutation();

  const intitalValues: FormValues = {
    name: me?.name || '',
    status: me?.status || '',
    avatarIcon: me?.avatarIcon || 'sheep',
    avatarColor: me?.avatarColor || '#eee',
  };

  const handleSubmit = useCallback(
    (values: FormValues, { setErrors }: FormikHelpers<FormValues>) => {
      const handleUpdateCache: MutationUpdaterFn<UpdateUserMutation> = (cache, { data }) => {
        if (!data) return;

        const { name, status, avatarIcon, avatarColor } = get(data, 'updateUser', {} as any);

        const query = {
          query: USER_QUERY,
          variables: {
            name,
            status,
            avatarIcon,
            avatarColor,
          },
        };

        const { user: prevUser } = cache.readQuery(query);

        if (!prevUser) return;

        cache.writeQuery({
          ...query,
          data: {
            ...prevUser,
            ...query.variables,
          },
        });
      };

      void updateUser({
        variables: {
          id: me?.id,
          data: values,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateUser: {
            __typename: 'User',
            id: me?.id,
            ...values,
          },
        },
        update: handleUpdateCache,
      })
        .then(closeModal)
        .catch(error => {
          const { extensions } = error.graphQLErrors[0] || {};

          if (extensions?.code === 'VALIDATION_SCHEMA_ERROR') {
            setErrors(extensions.validationErrors);
          }
        });
    },
    [closeModal, me?.id, updateUser],
  );

  return (
    <Modal name="EDIT_USER" title="Edit User" className="w-11/12 sm:w-9/12 md:w-6/12 lg:w-3/12">
      <Formik initialValues={intitalValues} enableReinitialize onSubmit={handleSubmit}>
        <Form className="p-1 flex flex-col items-stretch w-full">
          <div className="flex justify-center">
            <AvatarPicker iconField="avatarIcon" colorField="avatarColor" />
          </div>
          <Input name="name" inputProps={{ placeholder: 'Name' }} />
          <Input name="status" inputProps={{ placeholder: 'Status' }} />
          <button
            type="submit"
            className="transition-colors focus:outline-none hover:bg-indigo-300 hover:text-indigo-50 click:bg-indigo-400 rounded-md bg-indigo-100 py-2 mt-1 mb-3 text-lg text-indigo-600"
          >
            Submit
          </button>
        </Form>
      </Formik>
      {loading && <LoadingOverlay />}
    </Modal>
  );
};

export default EditUser;
