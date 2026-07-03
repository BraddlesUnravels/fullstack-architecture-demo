// import { Elysia } from 'elysia';
// import { ApplicationModel } from './models.application';
// import { ApplicationResponse } from './response.application';
// import { applicationService } from './service.application';
// import { sessionGuard } from '../../plugins/session-guard.plugin';

// export const applications = new Elysia({ name: 'applications', prefix: '/applications' })
//   .use(sessionGuard)
//   .get(
//     '/',
//     async ({ session }) => await applicationService.findAllUserApplications(session.userId),
//     {
//       response: ApplicationResponse.list,
//     },
//   )
//   .get(
//     '/:id',
//     async ({ params, session }) =>
//       await applicationService.findUserApplicationById(session.userId, params.id),
//     {
//       params: ApplicationModel.getById,
//       response: ApplicationResponse.readOne,
//     },
//   )
//   .post(
//     '/',
//     async ({ body, session }) =>
//       await applicationService.createUserApplication(session.userId, body),
//     {
//       body: ApplicationModel.create,
//       response: ApplicationResponse.create,
//     },
//   )
//   .patch(
//     '/:id',
//     async ({ session, params, body }) =>
//       await applicationService.updateUserApplication(session.userId, params.id, body),
//     {
//       params: ApplicationModel.getById,
//       body: ApplicationModel.update,
//       response: ApplicationResponse.update,
//     },
//   );
