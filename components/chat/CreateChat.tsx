import { FC } from 'react';

import * as yup from 'yup';

import { Formik, Form, FormikProps, FormikHelpers } from 'formik';

import Modal from 'components/common/Modal';
import ChatTypeSwitch from 'components/chat/ChatTypeSwitch';
import MembersSelect from 'components/chat/MembersSelect';
import LoadingOverlay from 'components/loading/LoadingOverlay';

import useModal from 'hooks/useModal';

import CONVERSATIONS_QUERY from 'graphql/queries/conversations';

import { OptionsType } from 'react-select';
import { MutationUpdaterFn } from '@apollo/client';
import { CreateConversationMutation, useCreateConversationMutation } from 'generated/graphql';

interface MemberOption {
  label: string;
  value: string;
}

interface FormValues {
  multiple: boolean;
  members: OptionsType<MemberOption>;
}

const initialValues: FormValues = {
  multiple: false,
  members: [],
};

const MemberSchema = yup.object({
  label: yup.string(),
  value: yup.string(),
});

const ChatSchema = yup.object().shape({
  multiple: yup.bool().required(),
  members: yup
    .array()
    .of(MemberSchema)
    .transform(function (value, originalValue?: MemberOption | MemberOption[]) {
      if (!originalValue) return [];
      if (Array.isArray(originalValue)) return originalValue;
      return [originalValue];
    })
    .min(1),
});

const CreateChat: FC = () => {
  const { closeModal } = useModal();

  const [createChat, { loading }] = useCreateConversationMutation();

  const handleSubmit = ({ members, ...values }: FormValues, { setErrors, resetForm }: FormikHelpers<FormValues>) => {
    const convertedMembers: MemberOption[] = Array.isArray(members) ? members : [members];

    const variables = {
      ...values,
      members: convertedMembers.map(({ value }) => value),
    };

    const optimisticConversation = {
      id: `optimistic-chat-${Date.now()}`,
      members: convertedMembers.map(({ label }, index) => ({ id: `optimistic-user-${index}`, name: label })),
    };

    const handleUpdateCache: MutationUpdaterFn<CreateConversationMutation> = (cache, { data }) => {
      if (!data) return;

      const query = { query: CONVERSATIONS_QUERY };

      const { conversations = [] } = cache.readQuery(query);

      cache.writeQuery({
        ...query,
        data: {
          conversations: [optimisticConversation, ...conversations],
        },
      });
    };

    void createChat({
      variables,
      optimisticResponse: {
        __typename: 'Mutation',
        createConversation: {
          __typename: 'Conversation',
          ...optimisticConversation,
        },
      },
      update: handleUpdateCache,
    })
      .then(() => {
        closeModal();
        resetForm();
      })
      .catch(error => {
        const { extensions } = error.graphQLErrors[0] || {};

        if (extensions?.code === 'VALIDATION_SCHEMA_ERROR') {
          setErrors(extensions.validationErrors);
        }

        console.error(error);
      });
  };

  return (
    <Modal
      className="w-11/12 sm:w-8/12 md:w-6/12 lg:w-5/12 xl:w-3/12"
      title="Start a new conversation"
      name="CREATE_CHAT"
    >
      <Formik validationSchema={ChatSchema} initialValues={initialValues} onSubmit={handleSubmit} className="w-">
        {({ values: { multiple } }: FormikProps<FormValues>) => (
          <Form>
            <ChatTypeSwitch className="mb-3" />
            <MembersSelect multiple={multiple} className="mb-3" />
            <button
              type="submit"
              className="transition-colors p-2 rounded-md w-full bg-indigo-100 text-indigo-500 hover:bg-indigo-200 hover:text-indigo-600 focus:outline-none"
            >
              Submit
            </button>
          </Form>
        )}
      </Formik>
      {loading && <LoadingOverlay />}
    </Modal>
  );
};

export default CreateChat;
