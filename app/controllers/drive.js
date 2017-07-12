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

    const userId = this.user._id;

    const options = Object.assign({}, {
      name: 'Untitled',
      isFolder: false,
      createdBy: userId
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
  };

  /**
   * Remove a file or a folder.
   * @param {String} folderId - the ObjectId of the file/folder to delete.
   * @return {Promise} A Promise
   */
  remove(fileId) {
    return new Promise((resolve, reject) => {
      FileModel.findById(fileId).exec()
      .then(file => {
        let name = file.name;
        let isFolder = file.isFolder;
        file.remove()
        .then(resolve({message: (isFolder ? 'Folder' : 'File') + ' "' + name + '" removed'}))
        .catch(err => reject({status: 500, message: 'DeleteFileError'}))
      })
      .catch(err => reject({status: 404, message: 'FileNotFound'}));
    });
  }
}

module.exports = Drive;
