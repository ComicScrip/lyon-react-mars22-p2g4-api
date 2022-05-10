function filters(filterObject) {
  let sql = 'SELECT * FROM path';
  const array = [];

  for (const filterName in filterObject) {
    const filterValue = filterObject[filterName];

    if (typeof filterValue === 'string') {
      array.push(`${filterName} LIKE '${filterValue}'`);
    } else if (typeof filterValue === 'number') {
      array.push(`${filterName} = ${filterValue}`);
    }
  }
  return (sql += ` WHERE ${array.join(' AND ')}`);
}

describe('test', () => {
  it('should return one filter', () => {
    expect(filters({ city_location: 'Lyon' })).toBe(
      "SELECT * FROM path WHERE city_location LIKE 'Lyon'"
    );
  });
  it('should return number filter', () => {
    expect(filters({ length: 12 })).toBe(
      'SELECT * FROM path WHERE length = 12'
    );
  });
  it('should return another number filter', () => {
    expect(filters({ difficulty: 3 })).toBe(
      'SELECT * FROM path WHERE difficulty = 3'
    );
  });
  it('should return two filter', () => {
    expect(filters({ city_location: 'Lyon', length: 12 })).toBe(
      "SELECT * FROM path WHERE city_location LIKE 'Lyon' AND length = 12"
    );
  });
  it('should return three filter', () => {
    expect(filters({ city_location: 'Lyon', length: 12, difficulty: 3 })).toBe(
      "SELECT * FROM path WHERE city_location LIKE 'Lyon' AND length = 12 AND difficulty = 3"
    );
  });
});
