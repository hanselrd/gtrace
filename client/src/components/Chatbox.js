import React, { Component } from 'react';
import { Comment, Container, Form, Label } from 'semantic-ui-react';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import renderField from './renderField';
import { Link } from 'react-router-dom';
import { graphql, compose } from 'react-apollo';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

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
    const response = await this.props.mutate({
      variables: { text }
    });
    const { status, errors } = response.data.addMessage;
    if (!status) {
      errors.map(error => {
        throw new SubmissionError({
          [error.path]: error.message
        });
      });
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
                          return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
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

const messagesQuery = gql`
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

const addMessageMutation = gql`
  mutation($text: String!) {
    addMessage(text: $text) {
      status
      payload
      errors {
        path
        message
      }
    }
  }
`;

const messageAddedSubscription = gql`
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
  graphql(messagesQuery, {
    props: props => ({
      ...props,
      subscribeToMessageAdded: params =>
        props.data.subscribeToMore({
          document: messageAddedSubscription,
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
  graphql(addMessageMutation),
  reduxForm({ form: 'chatbox', destroyOnUnmount: false })
)(Chatbox);
