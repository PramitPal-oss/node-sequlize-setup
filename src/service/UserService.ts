import { sequelize } from '@config/database';
import { AppError } from '@utils/AppError';
import { generateToken } from '@utils/jwt';
import { LoginInterface, UserInterface } from 'interface/authInterface';
import { AppModel, UserAppModel, UserModel } from 'models';
import { Op } from 'sequelize';

export const createUserWithApps = async (data: UserInterface) => {
  const { app_ids, username, first_name, last_name, email, password } = data;

  return sequelize.transaction(async (t) => {
    if (!app_ids || app_ids.length === 0) throw new AppError('Apps are required', 400);

    const apps = await AppModel.findAll({
      where: { id: app_ids },
      transaction: t,
    });

    if (apps.length !== app_ids.length) throw new AppError('One or more App IDs are invalid', 400, 'InvalidAppIDs');

    const user = await UserModel.create(
      {
        username,
        first_name,
        last_name,
        email,
        password,
        phone: data.phone ?? null,
        address: data.address ?? null,
      },
      { transaction: t },
    );

    await UserAppModel.bulkCreate(
      app_ids.map((appId) => ({
        user_id: user.id,
        app_id: appId,
        assigned_at: new Date(),
      })),
      { transaction: t },
    );

    return user;
  });
};

export const loginUser = async (data: LoginInterface) => {
  const { username, password, app_ids } = data;

  const user = await UserModel.scope('withPassword').findOne({
    where: {
      [Op.or]: [{ email: username }, { username: username }],
    },
  });

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid username or password', 401, 'AuthenticationFailed');
  }

  const userApps = await UserAppModel.findAll({
    where: {
      user_id: user.id,
      app_id: app_ids,
    },
  });

  if (userApps.length === 0) throw new AppError('User does not have access to the specified apps', 403, 'AccessDenied');

  const token = generateToken({
    userId: user.id,
    email: user.email,
  });

  return { user, token };
};

export const forgotPassword = async (email: string) => {
  const user = await UserModel.findOne({ where: { email } });

  if (!user) throw new AppError('No user found with the provided email', 404, 'NoUserFound');

  const resetToken = user.createPasswordResetToken();
  await user.save({ validate: false });

  return resetToken;
};
