exports.formatDates = list => {
  return list.map(function(obj) {
    let newObj = { ...obj };
    let oldTime = newObj.created_at;
    let newTime = new Date(oldTime);
    newObj.created_at = newTime;
    return newObj;
  });
};

exports.makeRefObj = list => {
  if (!list.length) return {};
  else {
    let refObj = {};
    list.forEach(function(obj) {
      refObj[obj.title] = obj.article_id;
    });
    return refObj;
  }
};

exports.formatComments = (comments, articleRef) => {
  if (!comments.length) return [];
  return comments.map(function(comment) {
    newComment = { ...comment };
    newComment.author = newComment.created_by;
    delete newComment.created_by;
    newComment.article_id = articleRef[newComment.belongs_to];
    delete newComment.belongs_to;
    newComment.created_at = new Date(newComment.created_at);
    return newComment;
  });
};
