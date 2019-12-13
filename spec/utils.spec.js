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
});

describe('makeRefObj', () => {});

describe('formatComments', () => {});
