const axios = require('axios');

const url = `http://localhost:4000/graphql`;

jest.setTimeout(30000);

describe('User', () => {
  describe('queries', () => {
    test('users: [User!]', async () => {
      const response = await axios.post(url, {
        query: `
          query {
            users {
              id
            }
          }
        `
      });

      const { data: { data: { users } } } = response;
      expect(users).toHaveLength(3);
    });

    describe('user(id: Int!): User', () => {
      test('id: <valid>)', async () => {
        const response = await axios.post(url, {
          query: `
            query {
              user(id: 1) {
                id
              }
            }
          `
        });

        const { data } = response;
        expect(data).toMatchObject({ data: { user: { id: 1 } } });
      });

      test('id: <invalid>', async () => {
        const response = await axios.post(url, {
          query: `
            query {
              user(id: 40) {
                id
              }
            }
          `
        });

        const { data } = response;
        expect(data).toMatchObject({ data: { user: null } });
      });
    });

    describe('currentUser: User', () => {
      test('guest', async () => {
        const response = await axios.post(url, {
          query: `
            query {
              currentUser {
                id
              }
            }
          `
        });

        const { data } = response;
        expect(data).toMatchObject({ data: { currentUser: null } });
      });

      test('auth', async () => {
        const loginResponse = await axios.post(url, {
          query: `
            mutation {
              login(email: "test1@gmail.com", password: "123456") {
                payload
              }
            }
          `
        });

        const { data: { login: { payload: { token } } } } = loginResponse.data;

        const currentUserResponse = await axios.post(
          url,
          {
            query: `
              query {
                currentUser {
                  name
                }
              }
            `
          },
          {
            headers: {
              authorization: `Bearer ${token}`
            }
          }
        );

        const { data } = currentUserResponse;
        expect(data).toMatchObject({
          data: { currentUser: { name: 'test1' } }
        });
      });
    });

    describe('newToken: String', () => {
      test('guest', async () => {
        const response = await axios.post(url, {
          query: `
            query {
              newToken
            }
          `
        });

        const { data } = response;
        expect(data).toMatchObject({ data: { newToken: null } });
      });

      test('auth', async () => {
        const loginResponse = await axios.post(url, {
          query: `
            mutation {
              login(email: "test1@gmail.com", password: "123456") {
                payload
              }
            }
          `
        });

        const { data: { login: { payload: { token } } } } = loginResponse.data;

        const newTokenResponse = await axios.post(
          url,
          {
            query: `
              query {
                newToken
              }
            `
          },
          {
            headers: {
              authorization: `Bearer ${token}`
            }
          }
        );

        const { data } = newTokenResponse;
        expect(data).toMatchObject({
          data: {
            newToken: expect.stringContaining(
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
            )
          }
        });
      });
    });

    test('onlineUsers: [User!]', async () => {
      const response = await axios.post(url, {
        query: `
          query {
            onlineUsers {
              id
            }
          }
        `
      });

      const { data } = response;
      expect(data).toMatchObject({ data: { onlineUsers: [] } });
    });
  });
});

describe('mutations', () => {
  describe('login(email: String!, password: String!): Response!', () => {
    test('email: <valid>, password: <valid>', async () => {
      const response = await axios.post(url, {
        query: `
          mutation {
            login(email: "test1@gmail.com", password: "123456") {
              status
              errors {
                path
              }
              payload
            }
          }
        `
      });

      const { data } = response;
      expect(data).toMatchObject({
        data: {
          login: {
            status: true,
            errors: null,
            payload: {
              token: expect.stringContaining(
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
              )
            }
          }
        }
      });
    });

    test('email: <invalid>, password: <valid>', async () => {
      const response = await axios.post(url, {
        query: `
          mutation {
            login(email: "test1gmail.com", password: "123456") {
              status
              errors {
                path
              }
              payload
            }
          }
        `
      });

      const { data } = response;
      expect(data).toMatchObject({
        data: {
          login: {
            status: false,
            errors: [{ path: 'email' }],
            payload: null
          }
        }
      });
    });

    test('email: <valid>, password: <invalid>', async () => {
      const response = await axios.post(url, {
        query: `
          mutation {
            login(email: "test1@gmail.com", password: "12345") {
              status
              errors {
                path
              }
              payload
            }
          }
        `
      });

      const { data } = response;
      expect(data).toMatchObject({
        data: {
          login: {
            status: false,
            errors: [{ path: 'password' }],
            payload: null
          }
        }
      });
    });

    test('email: <invalid>, password: <invalid>', async () => {
      const response = await axios.post(url, {
        query: `
          mutation {
            login(email: "test1gmail.com", password: "12345") {
              status
              errors {
                path
              }
              payload
            }
          }
        `
      });

      const { data } = response;
      expect(data).toMatchObject({
        data: {
          login: {
            status: false,
            errors: [{ path: 'email' }],
            payload: null
          }
        }
      });
    });
  });

  describe('signup(name: String!, email: String!, password: String!, language: String): Response!', () => {
    test('name: <valid>, email: <valid>, password: <valid>', async () => {
      const response = await axios.post(url, {
        query: `
          mutation {
            signup(name: "test4", email: "test4@gmail.com", password: "123456") {
              status
              errors {
                path
              }
              payload
            }
          }
        `
      });

      const { data } = response;
      expect(data).toMatchObject({
        data: {
          signup: {
            status: true,
            errors: null,
            payload: {
              token: expect.stringContaining(
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
              )
            }
          }
        }
      });
    });

    test('name: <invalid>, email: <valid>, password: <valid>', async () => {
      const response = await axios.post(url, {
        query: `
          mutation {
            signup(name: "test4", email: "test5@gmail.com", password: "123456") {
              status
              errors {
                path
              }
              payload
            }
          }
        `
      });

      const { data } = response;
      expect(data).toMatchObject({
        data: {
          signup: {
            status: false,
            errors: [{ path: 'name' }],
            payload: null
          }
        }
      });
    });

    test('name: <valid>, email: <invalid>, password: <valid>', async () => {
      const response = await axios.post(url, {
        query: `
          mutation {
            signup(name: "test5", email: "test4@gmail.com", password: "123456") {
              status
              errors {
                path
              }
              payload
            }
          }
        `
      });

      const { data } = response;
      expect(data).toMatchObject({
        data: {
          signup: {
            status: false,
            errors: [{ path: 'email' }],
            payload: null
          }
        }
      });
    });

    test('name: <valid>, email: <valid>, password: <invalid>', async () => {
      const response = await axios.post(url, {
        query: `
          mutation {
            signup(name: "test5", email: "test5@gmail.com", password: "12345") {
              status
              errors {
                path
              }
              payload
            }
          }
        `
      });

      const { data } = response;
      expect(data).toMatchObject({
        data: {
          signup: {
            status: false,
            errors: [{ path: 'password' }],
            payload: null
          }
        }
      });
    });

    test('name: <invalid>, email: <invalid>, password: <valid>', async () => {
      const response = await axios.post(url, {
        query: `
          mutation {
            signup(name: "test4", email: "test4@gmail.com", password: "123456") {
              status
              errors {
                path
              }
              payload
            }
          }
        `
      });

      const { data } = response;
      expect(data).toMatchObject({
        data: {
          signup: {
            status: false,
            errors: [{ path: 'name' }],
            payload: null
          }
        }
      });
    });

    test('name: <invalid>, email: <valid>, password: <invalid>', async () => {
      const response = await axios.post(url, {
        query: `
          mutation {
            signup(name: "test4", email: "test5@gmail.com", password: "12345") {
              status
              errors {
                path
              }
              payload
            }
          }
        `
      });

      const { data } = response;
      expect(data).toMatchObject({
        data: {
          signup: {
            status: false,
            errors: [{ path: 'password' }],
            payload: null
          }
        }
      });
    });

    test('name: <valid>, email: <invalid>, password: <invalid>', async () => {
      const response = await axios.post(url, {
        query: `
          mutation {
            signup(name: "test5", email: "test4@gmail.com", password: "12345") {
              status
              errors {
                path
              }
              payload
            }
          }
        `
      });

      const { data } = response;
      expect(data).toMatchObject({
        data: {
          signup: {
            status: false,
            errors: [{ path: 'password' }],
            payload: null
          }
        }
      });
    });

    test('name: <invalid>, email: <invalid>, password: <invalid>', async () => {
      const response = await axios.post(url, {
        query: `
          mutation {
            signup(name: "test4", email: "test4@gmail.com", password: "12345") {
              status
              errors {
                path
              }
              payload
            }
          }
        `
      });

      const { data } = response;
      expect(data).toMatchObject({
        data: {
          signup: {
            status: false,
            errors: [{ path: 'password' }],
            payload: null
          }
        }
      });
    });
  });

  describe('changePassword(oldPassword: String!, password: String!): Response!', async () => {
    test('guest', async () => {
      const response = await axios.post(url, {
        query: `
          mutation {
            changePassword(oldPassword: "123456", password: "1234567") {
              status
              errors {
                path
              }
              payload
            }
          }
        `
      });

      const { data } = response;
      expect(data).toMatchObject({
        data: {
          changePassword: {
            status: false,
            errors: [{ path: 'auth' }],
            payload: null
          }
        }
      });
    });

    describe('auth', () => {
      test('oldPassword: <valid>, password: <valid>', async () => {
        const loginResponse = await axios.post(url, {
          query: `
            mutation {
              login(email: "test1@gmail.com", password: "123456") {
                payload
              }
            }
          `
        });

        const { data: { login: { payload: { token } } } } = loginResponse.data;

        const changePasswordResponse = await axios.post(
          url,
          {
            query: `
              mutation {
                changePassword(oldPassword: "123456", password: "1234567") {
                  status
                  errors {
                    path
                  }
                  payload
                }
              }
            `
          },
          {
            headers: {
              authorization: `Bearer ${token}`
            }
          }
        );

        const { data } = changePasswordResponse;
        expect(data).toMatchObject({
          data: {
            changePassword: {
              status: true,
              errors: null,
              payload: {
                token: expect.stringContaining(
                  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
                )
              }
            }
          }
        });
      });

      test('oldPassword: <invalid>, password: <valid>', async () => {
        const loginResponse = await axios.post(url, {
          query: `
            mutation {
              login(email: "test1@gmail.com", password: "1234567") {
                payload
              }
            }
          `
        });

        const { data: { login: { payload: { token } } } } = loginResponse.data;

        const changePasswordResponse = await axios.post(
          url,
          {
            query: `
              mutation {
                changePassword(oldPassword: "12345", password: "123456") {
                  status
                  errors {
                    path
                  }
                  payload
                }
              }
            `
          },
          {
            headers: {
              authorization: `Bearer ${token}`
            }
          }
        );

        const { data } = changePasswordResponse;
        expect(data).toMatchObject({
          data: {
            changePassword: {
              status: false,
              errors: [{ path: 'oldPassword' }],
              payload: null
            }
          }
        });
      });

      test('oldPassword: <valid>, password: <invalid>', async () => {
        const loginResponse = await axios.post(url, {
          query: `
            mutation {
              login(email: "test1@gmail.com", password: "1234567") {
                payload
              }
            }
          `
        });

        const { data: { login: { payload: { token } } } } = loginResponse.data;

        const changePasswordResponse = await axios.post(
          url,
          {
            query: `
              mutation {
                changePassword(oldPassword: "1234567", password: "12345") {
                  status
                  errors {
                    path
                  }
                  payload
                }
              }
            `
          },
          {
            headers: {
              authorization: `Bearer ${token}`
            }
          }
        );

        const { data } = changePasswordResponse;
        expect(data).toMatchObject({
          data: {
            changePassword: {
              status: false,
              errors: [{ path: 'password' }],
              payload: null
            }
          }
        });
      });

      test('oldPassword: <invalid>, password: <invalid>', async () => {
        const loginResponse = await axios.post(url, {
          query: `
            mutation {
              login(email: "test1@gmail.com", password: "1234567") {
                payload
              }
            }
          `
        });

        const { data: { login: { payload: { token } } } } = loginResponse.data;

        const changePasswordResponse = await axios.post(
          url,
          {
            query: `
              mutation {
                changePassword(oldPassword: "123456", password: "12345") {
                  status
                  errors {
                    path
                  }
                  payload
                }
              }
            `
          },
          {
            headers: {
              authorization: `Bearer ${token}`
            }
          }
        );

        const { data } = changePasswordResponse;
        expect(data).toMatchObject({
          data: {
            changePassword: {
              status: false,
              errors: [{ path: 'oldPassword' }],
              payload: null
            }
          }
        });
      });
    });
  });
});
