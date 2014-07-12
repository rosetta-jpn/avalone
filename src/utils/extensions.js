if (!Object.values) {
  Object.values = function (obj) {
    var values = [], i = 0;
    for (var prop in obj)
      if (obj.hasOwnProperty(prop)) {
        values.push(obj[prop]);
      }
    return values;
  };
}
