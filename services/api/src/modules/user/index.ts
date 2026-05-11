import { Elysia } from 'elysia';
import { UserModel } from './models.user';
import { userService } from './service.user';
const readUserResponse = {
  200: UserModel.res,
  404: UserModel.apiError,
  500: UserModel.apiError,
} as const;

const createUserResponse = {
  201: UserModel.res,
  409: UserModel.apiError,
  500: UserModel.apiError,
} as const;

const mutateUserResponse = {
  200: UserModel.res,
  404: UserModel.apiError,
  422: UserModel.apiError,
  500: UserModel.apiError,
} as const;

export const users = new Elysia({ prefix: '/users' })
  .get('/', async ({ query }) => userService.findUserByEmail(query), {
    query: UserModel.getByEmailQuery,
    response: readUserResponse,
  })
  .get('/:id', async ({ params }) => userService.findUserById(params), {
    params: UserModel.getByIdParams,
    response: readUserResponse,
  })
  .post(
    '/new',
    async ({ body, status }) => {
      const createdUser = await userService.createUser(body);

      return status(201, createdUser);
    },
    {
      body: UserModel.createBody,
      response: createUserResponse,
    },
  )
  .patch('/:id', async ({ params, body }) => userService.updateUser(params.id, body), {
    params: UserModel.getByIdParams,
    body: UserModel.updateBody,
    response: mutateUserResponse,
  })
  .delete('/:id', async ({ params }) => userService.deleteUser(params.id), {
    params: UserModel.getByIdParams,
    response: mutateUserResponse,
  });
