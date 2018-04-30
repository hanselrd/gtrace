import * as React from 'react';
import { graphql, compose } from 'react-apollo';
import { RouteComponentProps, Link } from 'react-router-dom';
import Dropzone, { ImageFile } from 'react-dropzone';
import { Button, Grid, Header, Icon, Label, Segment } from 'semantic-ui-react';
import Void from '@app/utils/Void';
import locale from '@app/core/locale';
import CURRENT_USER_QUERY, {
  CurrentUserQueryProps
} from '@app/graphql/queries/currentUser';
import USER_QUERY, {
  UserQueryProps,
  UserQueryData,
  UserQueryVariables
} from '@app/graphql/queries/user';
import SEND_FRIEND_REQUEST_MUTATION, {
  SendFriendRequestMutationProps
} from '@app/graphql/mutations/sendFriendRequest';
import HANDLE_FRIEND_REQUEST_MUTATION, {
  HandleFriendRequestMutationProps
} from '@app/graphql/mutations/handleFriendRequest';
import UPLOAD_PICTURE_MUTATION, {
  UploadPictureMutationProps
} from '@app/graphql/mutations/uploadPicture';

let currentUserQueryProps: CurrentUserQueryProps;
let userQueryProps: UserQueryProps;
let sendFriendRequestMutationProps: SendFriendRequestMutationProps;
let handleFriendRequestMutationProps: HandleFriendRequestMutationProps;
let uploadPictureMutationProps: UploadPictureMutationProps;

export type ProfileProps = RouteComponentProps<{ id: string }> & {
  currentUser: typeof currentUserQueryProps.data;
  user: typeof userQueryProps.data;
  sendFriendRequest: typeof sendFriendRequestMutationProps.mutate;
  handleFriendRequest: typeof handleFriendRequestMutationProps.mutate;
  uploadPicture: typeof uploadPictureMutationProps.mutate;
} & UserQueryProps;

class Profile extends React.Component<ProfileProps> {
  componentWillMount() {
    this.props.user.refetch();
  }

  onSendFriendRequest() {
    const {
      currentUser: { currentUser },
      user: { user }
    } = this.props;

    if (this.props.sendFriendRequest && currentUser && user) {
      this.props.sendFriendRequest({
        variables: {
          id: user.id
        },
        update: (cache, result) => {
          const userQuery: { user: typeof user } = cache.readQuery({
            query: USER_QUERY,
            variables: { id: user.id }
          }) as any;
          if (userQuery) {
            cache.writeQuery({
              query: USER_QUERY,
              variables: { id: user.id },
              data: {
                user: {
                  ...userQuery.user,
                  pendingFriends: [
                    ...userQuery.user.pendingFriends,
                    currentUser
                  ]
                }
              }
            });
          }
        }
      });
    }
  }

  onHandleFriendRequest(accept: boolean) {
    const {
      currentUser: { currentUser },
      user: { user }
    } = this.props;

    if (this.props.handleFriendRequest && currentUser && user) {
      this.props.handleFriendRequest({
        variables: {
          id: user.id,
          accept
        },
        update: (cache, result) => {
          const currentUserQuery: {
            currentUser: typeof currentUser;
          } = cache.readQuery({
            query: CURRENT_USER_QUERY
          }) as any;
          if (currentUserQuery) {
            cache.writeQuery({
              query: CURRENT_USER_QUERY,
              variables: { id: user.id },
              data: {
                currentUser: {
                  ...currentUserQuery.currentUser,
                  friends: accept
                    ? [...currentUserQuery.currentUser.friends, user]
                    : currentUserQuery.currentUser.friends,
                  pendingFriends: currentUserQuery.currentUser.pendingFriends.filter(
                    friend => friend.id !== user.id
                  )
                }
              }
            });
          }

          if (accept) {
            const userQuery: { user: typeof user } = cache.readQuery({
              query: USER_QUERY,
              variables: { id: user.id }
            }) as any;
            if (userQuery) {
              cache.writeQuery({
                query: USER_QUERY,
                variables: { id: user.id },
                data: {
                  user: {
                    ...userQuery.user,
                    friends: [...userQuery.user.friends, currentUser]
                  }
                }
              });
            }
          }
        }
      });
    }
  }

  onImageDrop(files: ImageFile[]) {
    const {
      user: { user }
    } = this.props;

    const reader = new FileReader();
    reader.readAsDataURL(files[0]);

    reader.onload = () => {
      if (this.props.uploadPicture && user) {
        this.props.uploadPicture({
          variables: {
            data: reader.result
          },
          update: (cache, result) => {
            const userQuery: { user: typeof user } = cache.readQuery({
              query: USER_QUERY,
              variables: { id: user.id }
            }) as any;

            if (userQuery) {
              cache.writeQuery({
                query: USER_QUERY,
                variables: { id: user.id },
                data: {
                  user: {
                    ...userQuery.user,
                    picture: reader.result
                  }
                }
              });
            }
          }
        });
      }
    };
  }

  render() {
    const {
      currentUser: { currentUser },
      user: { loading, user }
    } = this.props;

    if (loading) {
      return <p>{locale.loading}...</p>;
    }

    if (!currentUser || !user) {
      return <p>{locale.notFound}</p>;
    }

    const dateFormat = { month: 'long', day: 'numeric', year: 'numeric' };

    return (
      <div>
        <Segment inverted>
          <Grid stackable>
            {currentUser.id !== user.id && (
              <Grid.Row>
                <Grid.Column textAlign="center">
                  {(() => {
                    if (
                      currentUser.friends.some(friend => friend.id === user.id)
                    ) {
                      return (
                        <Button inverted fluid color="blue" disabled>
                          {locale.friends}
                        </Button>
                      );
                    } else if (
                      currentUser.pendingFriends.some(
                        friend => friend.id === user.id
                      )
                    ) {
                      return (
                        <Button.Group fluid>
                          <Button
                            inverted
                            color="green"
                            onClick={() => this.onHandleFriendRequest(true)}
                          >
                            {locale.accept} {locale.friendRequest}
                          </Button>
                          <Button
                            inverted
                            color="red"
                            onClick={() => this.onHandleFriendRequest(false)}
                          >
                            {locale.decline} {locale.friendRequest}
                          </Button>
                        </Button.Group>
                      );
                    } else if (
                      user.pendingFriends.some(
                        friend => friend.id === currentUser.id
                      )
                    ) {
                      return (
                        <Button inverted fluid disabled>
                          {locale.friendRequestSent}
                        </Button>
                      );
                    } else {
                      return (
                        <Button
                          inverted
                          fluid
                          color="green"
                          onClick={() => this.onSendFriendRequest()}
                        >
                          {locale.sendFriendRequest}
                        </Button>
                      );
                    }
                  })()}
                </Grid.Column>
              </Grid.Row>
            )}
            <Grid.Row>
              <Grid.Column width={8} textAlign="center">
                <h2>
                  {user.name}
                  <Icon name="circle" color={user.online ? 'green' : 'grey'} />
                </h2>
                {user.picture ? (
                  <img src={user.picture} alt="profile" width={200} />
                ) : (
                  <img
                    src="https://via.placeholder.com/200x200"
                    alt="profile"
                  />
                )}
                {currentUser.id === user.id && (
                  <Dropzone
                    style={{}}
                    multiple={false}
                    accept="image/*"
                    onDrop={files => this.onImageDrop(files)}
                  >
                    <Button inverted>{locale.uploadProfilePicture}</Button>
                  </Dropzone>
                )}
              </Grid.Column>
              <Grid.Column width={8} verticalAlign="middle">
                <p>
                  {locale.dob}:{' '}
                  {new Date(user.dob).toLocaleString(
                    locale.getLanguage(),
                    dateFormat
                  )}
                </p>
                <p>
                  {locale.email}: {user.email}
                </p>
                <p>
                  {locale.language}:{' '}
                  {user.language === 'en'
                    ? locale.english
                    : user.language === 'es'
                      ? locale.spanish
                      : null}
                </p>
                <p>
                  {locale.online}: {user.online ? locale.yes : locale.no}
                </p>
                <p>
                  {user.role && (
                    <Void>
                      {locale.role}:{' '}
                      <Label as="span" color={user.role.color as any}>
                        {user.role.abbreviation}
                      </Label>
                    </Void>
                  )}
                </p>
                <p>
                  {locale.joined}:{' '}
                  {new Date(user.createdAt).toLocaleString(
                    locale.getLanguage(),
                    dateFormat
                  )}
                </p>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        <Segment inverted>
          <Header as="h2">
            {locale.friends} ({user.friends.length})
          </Header>
          {user.friends.map(friend => (
            <Link key={friend.id} to={'/profile/' + friend.id}>
              {friend.name}
            </Link>
          ))}
        </Segment>
        {currentUser.id == user.id && (
          <Segment inverted>
            <Header as="h2">
              {locale.friendRequests} ({user.pendingFriends.length})
            </Header>
            {user.pendingFriends.map(friend => (
              <Link key={friend.id} to={'/profile/' + friend.id}>
                {friend.name}
              </Link>
            ))}
          </Segment>
        )}
      </div>
    );
  }
}

export default compose(
  graphql(CURRENT_USER_QUERY, {
    name: 'currentUser',
    options: { errorPolicy: 'all' }
  }),
  graphql<ProfileProps, UserQueryData, UserQueryVariables>(USER_QUERY, {
    name: 'user',
    options: ({ match }) => ({
      variables: {
        id: match.params.id
      },
      errorPolicy: 'all'
    })
  }),
  graphql(SEND_FRIEND_REQUEST_MUTATION, { name: 'sendFriendRequest' }),
  graphql(HANDLE_FRIEND_REQUEST_MUTATION, { name: 'handleFriendRequest' }),
  graphql(UPLOAD_PICTURE_MUTATION, { name: 'uploadPicture' })
)(Profile);
