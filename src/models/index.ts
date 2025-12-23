import AppModel from './app.model';
import UserModel from './user.model';
import UserAppModel from './userApp.model';

UserModel.belongsToMany(AppModel, {
  through: UserAppModel,
  foreignKey: 'user_id',
  otherKey: 'app_id',
});

AppModel.belongsToMany(UserModel, {
  through: UserAppModel,
  foreignKey: 'app_id',
  otherKey: 'user_id',
});

export { AppModel, UserAppModel, UserModel };
