module.exports = `
  type Response {
    status: Boolean!
    payload: JSON
    errors: [Error!]
  }
`;
