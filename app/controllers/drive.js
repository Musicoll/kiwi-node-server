/**
Drive Controller
*/

const FileModel = require('../models/File');

let Drive = class Drive {
  constructor(user) {
    this.user = user;
  }

  /**
   * Create a new file in a folder
   * @param {String} folderId - the ObjectId of the folder to put the new file in.
   * @param {Object} fileOptions - Option for file creation.
   * @return {Promise} A Promise
   */
  add(folderId, fileOptions = {}) {

    const options = Object.assign({}, {
      name: 'Untitled',
      isFolder: false,
    }, fileOptions);

    return new Promise((resolve, reject) => {

      FileModel.findById(folderId).exec()
      .then(parentFile => {

        if(parentFile.isFolder == true) {

          parentFile.appendChild(options, function(err, data) {
            if(err) { reject({status: 500, message: 'CreatingFileError'}) }
            else    { resolve(data); }
          });
        }
        else {
          reject({status: 404, message: 'IsNotAFolder'});
        }
      })
      .catch(err => reject({status: 404, message: 'FolderNotFound'}));

    });
  }
}

module.exports = Drive;
