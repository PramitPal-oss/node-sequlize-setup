import AppModel from './app.model';
import TodoModel from './todo.model';
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

UserModel.hasMany(TodoModel, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

TodoModel.belongsTo(UserModel, {
  foreignKey: 'user_id',
});

export { AppModel, TodoModel, UserAppModel, UserModel };
