import * as React from 'react';
import { graphql, compose } from 'react-apollo';
import { Link } from 'react-router-dom';
import * as Scroll from 'react-scroll';
import {
  Comment,
  Dimmer,
  Form,
  Header,
  Label,
  Loader,
  Segment
} from 'semantic-ui-react';
import { withFormik, FormikProps } from 'formik';
import yup from 'yup';
import locale from '@app/core/locale';
import MESSAGES_QUERY, {
  MessagesQueryProps,
  MessagesQueryData
} from '@app/graphql/queries/messages';
import ADD_MESSAGE_MUTATION, {
  AddMessageMutationProps,
  AddMessageMutationVariables
} from '@app/graphql/mutations/addMessage';
import MESSAGE_ADDED_SUBSCRIPTION, {
  MessageAddedSubscriptionData
} from '@app/graphql/subscriptions/messageAdded';
import '@app/styles/Chat.css';

export type ChatProps = MessagesQueryProps &
  AddMessageMutationProps &
  FormikProps<AddMessageMutationVariables>;

class Chat extends React.Component<ChatProps> {
  componentWillMount() {
    this.props.data.subscribeToMore({
      document: MESSAGE_ADDED_SUBSCRIPTION,
      updateQuery: (prev: MessagesQueryData, { subscriptionData }) => {
        if (!subscriptionData) {
          return prev;
        }
        this.scrollToNewestMessage();
        const {
          messageAdded
        }: MessageAddedSubscriptionData = subscriptionData.data;
        return { ...prev, messages: [...prev.messages, messageAdded] };
      }
    });
  }

  componentDidMount() {
    if (this.props.data.messages) {
      this.scrollToNewestMessage();
    }
  }

  componentDidUpdate(prevProps: ChatProps) {
    if (prevProps.data.loading && !this.props.data.loading) {
      this.scrollToNewestMessage();
    }
  }

  localizeCreatedAt(createdAt: string) {
    const date = new Date(createdAt);
    return date.toLocaleString(locale.getLanguage());
  }

  scrollToNewestMessage() {
    Scroll.scroller.scrollTo('newestMessage', {
      duration: 2000,
      delay: 100,
      smooth: true,
      containerId: 'containerElement'
    });
  }

  render() {
    const { data: { loading, messages } } = this.props;
    if (loading) {
      return <p>{locale.loading}...</p>;
    }
    if (!messages) {
      return <p>{locale.notFound}</p>;
    }

    const {
      values,
      handleChange,
      handleBlur,
      handleSubmit,
      isSubmitting
    } = this.props;
    return (
      <div>
        <Segment inverted>
          <Header as="h2">{locale.chat}</Header>
          <Dimmer active={isSubmitting}>
            <Loader />
          </Dimmer>
          <Comment.Group
            style={{ height: 300, overflowY: 'auto' }}
            id="containerElement"
          >
            <div>
              {messages.map(message => (
                <Comment key={message.id}>
                  <Comment.Content>
                    <Comment.Author
                      as={Link}
                      to={'/profile/' + message.user.id}
                    >
                      <Label
                        circular
                        color={
                          message.user.role
                            ? message.user.role.color
                            : (null as any)
                        }
                        size="small"
                      >
                        {message.user.name}
                        {message.user.role && (
                          <Label.Detail>
                            {message.user.role.abbreviation}
                          </Label.Detail>
                        )}
                      </Label>
                    </Comment.Author>
                    <Comment.Metadata>
                      <div className="Chat-metadata">
                        {this.localizeCreatedAt(message.createdAt)}
                      </div>
                    </Comment.Metadata>
                    <Comment.Text>
                      <span className="Chat-text">{message.text}</span>
                    </Comment.Text>
                  </Comment.Content>
                </Comment>
              ))}
              <Scroll.Element name="newestMessage" />
            </div>
          </Comment.Group>
          <Form inverted onSubmit={handleSubmit}>
            <Form.Input
              fluid
              name="text"
              value={values.text}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Form>
        </Segment>
      </div>
    );
  }
}

export default compose(
  graphql(MESSAGES_QUERY),
  graphql(ADD_MESSAGE_MUTATION),
  withFormik<ChatProps, AddMessageMutationVariables>({
    mapPropsToValues: props => ({ text: '' }),
    validationSchema: yup.object().shape({
      text: yup
        .string()
        .required()
        .max(256)
    }),
    handleSubmit: async ({ text }, { props, resetForm }) => {
      if (props.mutate) {
        try {
          await props.mutate({
            variables: { text }
          });
          resetForm({ text: '' });
        } catch (error) {
          console.log(error.graphQLErrors[0].data);
        }
      }
    }
  })
)(Chat);
