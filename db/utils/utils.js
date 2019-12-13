exports.formatDates = list => {
  return list.map(function(obj) {
    let newObj = { ...obj };
    let oldTime = newObj.created_at;
    let newTime = new Date(oldTime);
    newObj.created_at = newTime;
    return newObj;
  });
};

exports.makeRefObj = list => {};

exports.formatComments = (comments, articleRef) => {};
