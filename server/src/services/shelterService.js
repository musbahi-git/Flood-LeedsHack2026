const Shelter = require('../models/Shelter');

module.exports = {
  async getShelters() {
    return Shelter.find({});
  }
};
