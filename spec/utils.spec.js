const { expect } = require('chai');
const {
  formatDates,
  makeRefObj,
  formatComments
} = require('../db/utils/utils');

describe('formatDates', () => {
  it('returns a new array when passed an empty array', () => {
    let array = [];
    expect(formatDates(array)).not.equal(array);
  });
  it('takes a single object with a created_at key and converts the value to JS time', () => {
    let time = new Date().getTime();
    let formattedTime = new Date(time);
    let objArr = [
      {
        created_at: time
      }
    ];
    expect(formatDates(objArr)).deep.equal([
      {
        created_at: formattedTime
      }
    ]);
    expect(formatDates(objArr)[0].created_at).to.be.instanceof(Date);
  });
  it('takes an array of multiple objects with a created_at key and converts their values to JS time', () => {
    let time = new Date().getTime();
    let formattedTime = new Date(time);
    let objArr = [
      {
        id: 1,
        created_at: time
      },
      {
        id: 2,
        created_at: time
      },
      {
        id: 3,
        created_at: time
      }
    ];
    expect(formatDates(objArr)).deep.equal([
      {
        id: 1,
        created_at: formattedTime
      },
      {
        id: 2,
        created_at: formattedTime
      },
      {
        id: 3,
        created_at: formattedTime
      }
    ]);
  });
  it('does not mutate the original objects', () => {
    let time = new Date().getTime();
    let objArr = [
      {
        id: 1,
        created_at: time
      },
      {
        id: 2,
        created_at: time
      },
      {
        id: 3,
        created_at: time
      }
    ];
    formatDates(objArr);
    expect(objArr).deep.equal([
      {
        id: 1,
        created_at: time
      },
      {
        id: 2,
        created_at: time
      },
      {
        id: 3,
        created_at: time
      }
    ]);
  });
});

describe('makeRefObj', () => {
  it('takes an array containing an empty object and returns a new object', () => {
    let objArr = [{}];
    expect(makeRefObj(objArr[0])).to.not.equal(objArr[0]);
  });
  it('takes an array with one object containing article_id and title keys and returns a new object with the key of titles value and the value of article_ids value', () => {
    let objArr = [{ article_id: 1, title: 'A' }];
    expect(makeRefObj(objArr)).to.deep.equal({ A: 1 });
  });
  it('takes an array with mutliple objects and returns expected result', () => {
    let objArr = [
      { article_id: 1, title: 'A' },
      { article_id: 2, title: 'B' },
      { article_id: 3, title: 'C' }
    ];
    expect(makeRefObj(objArr)).to.deep.equal({ A: 1, B: 2, C: 3 });
  });
  it('does not mutate the original objects', () => {
    let objArr = [
      { article_id: 1, title: 'A' },
      { article_id: 2, title: 'B' },
      { article_id: 3, title: 'C' }
    ];
    makeRefObj(objArr);
    expect(objArr).to.deep.equal([
      { article_id: 1, title: 'A' },
      { article_id: 2, title: 'B' },
      { article_id: 3, title: 'C' }
    ]);
  });
});

describe('formatComments', () => {
  it('when passed an empty array returns a new array', () => {
    let array = [];
    expect(formatComments(array)).to.not.equal(array);
  });
  it('when passed an array containing one comment object and a reference obj returns a new array of the comment correctly formatted', () => {
    let oldTime = new Date().getTime();
    let newTime = new Date(oldTime);
    let objArray = [
      {
        comment_id: 1,
        created_by: 'Adam',
        belongs_to: 'A',
        created_at: oldTime,
        body: 'Hello'
      }
    ];
    let refObj = {
      A: 1,
      B: 2,
      C: 3
    };
    expect(formatComments(objArray, refObj)).to.deep.equal([
      {
        comment_id: 1,
        author: 'Adam',
        article_id: 1,
        created_at: newTime,
        body: 'Hello'
      }
    ]);
  });
  it('when passed an array containing multiple comment objects and a reference obj returns the correct result', () => {
    let oldTime = new Date().getTime();
    let newTime = new Date(oldTime);
    let objArray = [
      {
        comment_id: 1,
        created_by: 'Adam',
        belongs_to: 'A',
        created_at: oldTime,
        body: 'Hello'
      },
      {
        comment_id: 2,
        created_by: 'Terry',
        belongs_to: 'B',
        created_at: oldTime,
        body: 'New'
      },
      {
        comment_id: 3,
        created_by: 'Andy',
        belongs_to: 'C',
        created_at: oldTime,
        body: 'World'
      }
    ];
    let refObj = {
      A: 1,
      B: 2,
      C: 3
    };
    expect(formatComments(objArray, refObj)).to.deep.equal([
      {
        comment_id: 1,
        author: 'Adam',
        article_id: 1,
        created_at: newTime,
        body: 'Hello'
      },
      {
        comment_id: 2,
        author: 'Terry',
        article_id: 2,
        created_at: newTime,
        body: 'New'
      },
      {
        comment_id: 3,
        author: 'Andy',
        article_id: 3,
        created_at: newTime,
        body: 'World'
      }
    ]);
  });
  it('doesnt mutate the original objects', () => {
    let oldTime = new Date().getTime();
    let objArray = [
      {
        comment_id: 1,
        created_by: 'Adam',
        belongs_to: 'A',
        created_at: oldTime,
        body: 'Hello'
      },
      {
        comment_id: 2,
        created_by: 'Terry',
        belongs_to: 'B',
        created_at: oldTime,
        body: 'New'
      },
      {
        comment_id: 3,
        created_by: 'Andy',
        belongs_to: 'C',
        created_at: oldTime,
        body: 'World'
      }
    ];
    let refObj = {
      A: 1,
      B: 2,
      C: 3
    };
    formatComments(objArray, refObj);
    expect(objArray).to.deep.equal([
      {
        comment_id: 1,
        created_by: 'Adam',
        belongs_to: 'A',
        created_at: oldTime,
        body: 'Hello'
      },
      {
        comment_id: 2,
        created_by: 'Terry',
        belongs_to: 'B',
        created_at: oldTime,
        body: 'New'
      },
      {
        comment_id: 3,
        created_by: 'Andy',
        belongs_to: 'C',
        created_at: oldTime,
        body: 'World'
      }
    ]);
    expect(refObj).to.deep.equal({
      A: 1,
      B: 2,
      C: 3
    });
  });
});
