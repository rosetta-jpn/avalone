rivets.adapters['#'] = {
  subscribe: function(obj, keypath, callback) {
    // console.log('subscrbe:', obj, keypath);
    if (obj.on) obj.on('update', callback);
  },
  unsubscribe: function(obj, keypath, callback) {
    // console.log('unsubscrbe:', obj, keypath);
    if (obj.removeListener)
      obj.removeListener('update', callback);
  },

  read: function(obj, keypath) {
    var value = obj[keypath]
    if (value && value.read) return value.read;
    else return value;
  },

  publish: function(obj, keypath, value) {
    if (obj[keypath] && obj[keypath].publish)
      obj[keypath].publish(value);
    else
      obj[keypath] = value;
  }
}

rivets.config.rootInterface = '.'
rivets.config.templateDelimiters = ['{{', '}}']
