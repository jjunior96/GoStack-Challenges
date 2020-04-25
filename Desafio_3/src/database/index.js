import Sequelize from 'sequelize';

import User from '../app/models/User';
import Recipient from '../app/models/Recipient';
import Files from '../app/models/Files';
import Deliveryman from '../app/models/Deliveryman';

import databaseConfig from '../config/database';

const models = [User, Recipient, Deliveryman, Files];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connectionDatabase = new Sequelize(databaseConfig);

    models
      .map((model) => model.init(this.connectionDatabase))
      .map(
        (model) => model.associate && model.associate(this.connectionDatabase)
      );
  }
}

export default new Database();
