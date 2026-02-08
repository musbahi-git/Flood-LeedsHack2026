const Incident = require('../src/models/Incident');

describe('Incident model', () => {
  it('should require type and location', () => {
    const incident = new Incident({});
    const err = incident.validateSync();
    expect(err.errors.type).toBeDefined();
    expect(err.errors.location).toBeDefined();
  });
});
