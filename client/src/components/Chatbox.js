import React, { Component } from 'react';
import { Comment, Container, Form, Label } from 'semantic-ui-react';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import renderField from './renderField';
import { Link } from 'react-router-dom';
import { graphql, compose } from 'react-apollo';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import locales from '../locales';

class Chatbox extends Component {
  componentWillMount() {
    this.props.subscribeToMessageAdded();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.data.messages && this.props.data.messages) {
      if (prevProps.data.messages.length !== this.props.data.messages.length) {
        this.chatboxRef.scrollTop =
          this.chatboxRef.scrollHeight - this.chatboxRef.clientHeight > 0
            ? this.chatboxRef.scrollHeight - this.chatboxRef.clientHeight
            : 0;
      }
    }
  }

  onSubmit = async ({ text }) => {
    this.props.reset();
    try {
      await this.props.mutate({
        variables: { text }
      });
    } catch (error) {
      throw new SubmissionError(error.graphQLErrors[0].data);
    }
  };

  render() {
    const { data: { loading, messages } } = this.props;

    if (loading) {
      return <p>Loading...</p>;
    }

    if (!messages) {
      return <p>No messages found</p>;
    }

    const { handleSubmit, users } = this.props;

    return (
      <div className="Chatbox">
        <Container
          text
          style={{
            border: '2px solid black',
            borderRadius: 7,
            padding: 5
          }}
        >
          <Comment.Group>
            <div
              ref={div => {
                this.chatboxRef = div;
              }}
              style={{
                height: 300,
                overflowY: 'auto'
              }}
            >
              {messages.map(message => (
                <Comment key={message.id}>
                  <Comment.Content>
                    <Comment.Author
                      as={Link}
                      to={'/profile/' + message.user.id}
                    >
                      {(() => {
                        let role = null;
                        const user = users.filter(
                          user => user.id === message.user.id
                        );

                        if (user.length === 1) {
                          if (user[0].role) {
                            role = user[0].role;
                          }
                        }

                        return (
                          <Label color={role ? role.color : null} size="small">
                            {message.user.name}
                            {role && (
                              <Label.Detail>{role.abbreviation}</Label.Detail>
                            )}
                          </Label>
                        );
                      })()}
                    </Comment.Author>
                    <Comment.Metadata>
                      <div>
                        {(() => {
                          const date = new Date(message.createdAt);
                          return `${date.toLocaleDateString(
                            locales.getLanguage()
                          )} ${date.toLocaleTimeString(locales.getLanguage())}`;
                        })()}
                      </div>
                    </Comment.Metadata>
                    <Comment.Text>{message.text}</Comment.Text>
                  </Comment.Content>
                </Comment>
              ))}
            </div>
          </Comment.Group>
          <Form onSubmit={handleSubmit(this.onSubmit)}>
            <Field name="text" type="text" component={renderField} />
          </Form>
        </Container>
      </div>
    );
  }
}

Chatbox.propTypes = {
  users: PropTypes.array.isRequired
};

const MESSAGES_QUERY = gql`
  query {
    messages {
      id
      text
      user {
        id
        name
      }
      createdAt
    }
  }
`;

const ADD_MESSAGE_MUTATION = gql`
  mutation($text: String!) {
    addMessage(text: $text) {
      id
    }
  }
`;

const MESSAGE_ADDED_SUBSCRIPTION = gql`
  subscription {
    messageAdded {
      id
      text
      user {
        id
        name
      }
      createdAt
    }
  }
`;

export default compose(
  graphql(MESSAGES_QUERY, {
    props: props => ({
      ...props,
      subscribeToMessageAdded: params =>
        props.data.subscribeToMore({
          document: MESSAGE_ADDED_SUBSCRIPTION,
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData) {
              return prev;
            }

            const { data: { messageAdded } } = subscriptionData;
            return { ...prev, messages: [...prev.messages, messageAdded] };
          }
        })
    })
  }),
  graphql(ADD_MESSAGE_MUTATION),
  reduxForm({ form: 'chatbox', destroyOnUnmount: false })
)(Chatbox);
