let User = require('../app/models/User');
let Document = require('../app/models/Document');

clearDatabase = () => {
  User.remove({}, err => {
    if(err) {
      console.error('User collection cannot be removed')
    }
  })

  Document.remove({}, err => {
    if(err) {
      console.error('Document collection cannot be removed')
    }
  })
}

module.exports = {
  clearDatabase: clearDatabase
};
