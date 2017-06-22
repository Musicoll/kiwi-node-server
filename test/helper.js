let User = require('../app/models/User');
let PatcherDocument = require('../app/models/PatcherDocument');

clearDatabase = () => {
  User.remove({}, err => {
    if(err) {
      console.error('User collection cannot be removed')
    }
  })

  PatcherDocument.remove({}, err => {
    if(err) {
      console.error('PatcherDocument collection cannot be removed')
    }
  })
}

module.exports = {
  clearDatabase: clearDatabase
};
