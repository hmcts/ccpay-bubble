'use strict';

module.exports = () => {
  const idamUrl = process.env.IDAM_URL || 'http://localhost:8001';
  const createUserJson = {
    createUser: (email, password) => {
      return ({
        uri: `${idamUrl}/testing-support/accounts`,
        method: 'POST',
        json: {
          email,
          forename: 'forename',
          surname: 'surname',
          password,
          roles: ['payments']
        }
      });
    }
  };
  return createUserJson;
};
