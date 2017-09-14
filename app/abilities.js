// ------------------------------------------------------------------------- //
// Abilities
// ------------------------------------------------------------------------- //

const { AbilityBuilder, Ability } = require('casl')

function defineAbilitiesForDocument(user, doc) {

  return AbilityBuilder.define((can, cannot) => {

    /*
    let user_permission = doc.permissions[user];

    if(user_permission.has_role('edit')){
      can('edit', doc);
    }

    can(['read', 'create'], ['User', 'File'])
    can('create', 'User')

    //can(['read', 'update'], 'User', { _id: user.id })
    //can(['read', 'update', 'create', 'trash', 'delete'], 'File', { owner: user.id })
    */
  })
}

function defineAbilitiesFor(user) {
  return AbilityBuilder.define((can, cannot) => {

    can(['read', 'create'], ['User', 'File'])
    can('create', 'User')

  });
}

const ANONYMOUS_ABILITY = defineAbilitiesFor(null);

module.exports = function getUserAbilities(user) {
  return user ? defineAbilitiesFor(user) : ANONYMOUS_ABILITY
}

module.exports = function getUserAbilitiesForDocument(user, doc) {
  return user ? defineAbilitiesForDocument(user, doc) : ANONYMOUS_ABILITY
}

module.exports = function createAbilities(req, res, next) {
  req.ability = req.user.email ? defineAbilitiesFor(req.user) : ANONYMOUS_ABILITY
  next()
}
