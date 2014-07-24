rivets.adapters['#'] = {
  subscribe: function(obj, keypath, callback) {
    console.log('subscrbe:', obj, keypath);
    if (obj.on) obj.on('update', callback);
  },
  unsubscribe: function(obj, keypath, callback) {
    console.log('unsubscrbe:', obj, keypath);
    if (obj.removeListener)
      obj.removeListener('update', callback);
  },
  read: function(obj, keypath) {
    return obj[keypath];
  },
  publish: function(obj, keypath, value) {
    obj[keypath] = value;
  }
}

rivets.config.rootInterface = '.'
rivets.config.templateDelimiters = ['{{', '}}']
