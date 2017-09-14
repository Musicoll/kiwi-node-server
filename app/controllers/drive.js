// ------------------------------------------------------------------------- //
// Drive Controller
// ------------------------------------------------------------------------- //

const FileModel = require('../models/File');
const Document = require('../models/Document');
const { AbilityBuilder, Ability } = require('casl')

let Drive = class Drive {
  constructor(user) {
    this.user = user;
  }

  getAbilitiesForDocument(doc) {
    return AbilityBuilder.define((can, cannot) => {

      can(['access', 'read', 'update', 'copy', 'share', 'trash', 'delete'], doc, { owner: this.user._id })

    });
  }

  createDocumentRootFolder() {

    const userId = this.user._id;

    return new Promise((resolve, reject) => {

      let doc = new Document({
        name: 'usr-root-' + userId,
        mimeType: 'application/cicm.kiwiapp.folder',
        creator: userId,
        owner: userId,
        description: 'Documents root of user ' + userId,
      });

      doc.save()
      .then(root => {
        this.user.documentRoot = root;
        this.user.save()
        .then(user => {
            resolve(root);
        });
      })
      .catch(err => {
        console.log('err: ' + err);
        reject({status: 500, message: 'InternalError'})
      })
    });
  }

  static addUser(user) {

    let drive = new Drive(user)
    return drive.createDocumentRootFolder()
  }

  listFiles(options) {

    return new Promise((resolve, reject) => {

      const userId = this.user._id;

      var query = {
        // mongo condition
        condition: {
            owner: userId
        },
        // selected fields
        fields: {
          //path: 0
        },

        // sorting
        sort: {
          mimeType: 1,
          name: 1,
        }
      };

      const documentRootId = this.user.documentRoot;

      Document.GetChildren({_id: documentRootId}, query, (err, tree) => {
        if(err) {
          reject(err);
          return;
        }

        let data = {
          kind: "Kiwi#DocumentList",
          items: tree
        }

        resolve(data);
      });

    });
  }

  /**
   * Create a new file in a folder
   * @param {String} folderId - the ObjectId of the folder to put the new file in.
   * @param {Object} fileOptions - Option for file creation.
   * @return {Promise} A Promise
   */
  add(fileOptions = {}) {

    const userId = this.user._id;
    const parentId = fileOptions.parent || this.user.documentRoot;

    const options = Object.assign({}, {
      name: 'Untitled',
      isFolder: false,
      mimeType: fileOptions.isFolder ? "application/cicm.kiwiapp.folder" : "application/cicm.kiwiapp.patcher",
      owner: userId,
      creator: userId
    }, fileOptions);

    return new Promise((resolve, reject) => {

      Document.findById(parentId)
      .then(parentDocument => {

        if(parentDocument && parentDocument.isFolder) {

          parentDocument.appendChild(options, function(err, data) {
            if(err || !data) {
              reject({status: 500, message: 'CreatingDocumentError'})
            }
            else {
              resolve(data);
             }
          });
        }
        else {
          reject({status: 404, message: 'IsNotAFolder'});
        }
      })
      .catch(err => {
        reject({status: 404, message: 'FolderNotFound'})
      });

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
