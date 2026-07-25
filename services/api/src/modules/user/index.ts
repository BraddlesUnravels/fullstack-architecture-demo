import { Elysia } from 'elysia';
import { UserModel } from './models.user';
import { userService } from './service.user';
import { UserResponse } from './response.user';
import { sessionGuard } from '../../plugins/session-guard.plugin';

export const users = new Elysia({ name: 'users', prefix: '/users' })
  .use(sessionGuard)
  .get(
    '/',
    async ({ session }) =>
      await userService.findUserById({ id: session.userId }),
    {
      session: UserModel.summary,
      response: UserResponse,
    },
  )
  .get('/:email', async ({ params }) => userService.findUserByEmail(params), {
    params: UserModel.getByEmail,
    response: UserResponse.read,
  })
  .post(
    '/',
    async ({ body, status }) => {
      const createdUser = await userService.createUser(body);

      return status(201, createdUser);
    },
    {
      body: UserModel.create,
      response: UserResponse.create,
    },
  )
  .patch(
    '/:id',
    async ({ params, body }) => await userService.updateUser(params.id, body),
    {
      params: UserModel.getById,
      body: UserModel.update,
      response: UserResponse.mutate,
    },
  )
  .delete(
    '/:id',
    async ({ params, status }) => {
      await userService.deleteUser(params.id);

      return status(204, { success: true });
    },
    {
      params: UserModel.getById,
      response: UserResponse.delete,
    },
  );
