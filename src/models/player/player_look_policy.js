var PlayerLookPolicy = module.exports = function(looker, target) {
    this.looker = looker;
    this.target = target;
    this.look = this._judgeLook();
}

PlayerLookPolicy.prototype.anonymousClassName = 'Unknown';

PlayerLookPolicy.prototype._judgeLook = function () {
  imports = lazyLoad();

  if (this.target.look.mordred && !this.looker.ability.findMordred)
    return this.anonymousClassName;

  if (this.target.look.merlin && this.looker.ability.findMerlin)
    return imports.merlin.classMethods.className;

  if (this.target.look.evil && this.looker.ability.findEvil)
    return imports.evil.classMethods.className;

  return this.anonymousClassName;
}

function lazyLoad() {
  return {
    merlin: require('./merlin'),
    evil: require('./evil')
  };
}
