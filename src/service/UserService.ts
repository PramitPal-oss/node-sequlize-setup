import { sequelize } from '@config/database';
import { AppError } from '@utils/AppError';
import { AppModel, UserAppModel, UserModel } from 'models';

export const createUserWithApps = async (data: UserModel) => {
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
