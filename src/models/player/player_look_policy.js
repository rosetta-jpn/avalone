var PlayerLookPolicy = module.exports = function(looker, target) {
    this.looker = looker;
    this.target = target;
    this.look = _judgeLook();
}

PlayerLookPolicy.prototype.anonymousClassName = '*********';

PlayerLookPolicy.prototype._judgeLook = function () {
  imports = lazyLoad();

  if (target.look.mordred && !looker.ability.findMordred)
    return this.anonymousClassName;

  if (target.look.merlin && looker.ability.findMerlin)
    return imports.merlin.classMethods.className;

  if (target.look.evil && looker.ability.findEvil)
    return imports.evil.classMethods.className;

  return this.anonymousClassName;
}

function lazyLoad() {
  return {
    merlin: require('./merlin'),
    evil: require('./evil')
  };
}
