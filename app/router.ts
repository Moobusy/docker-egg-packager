import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/', controller.project.index);
  router.post('/build', controller.project.build);

  router.get('/backup', controller.backup.index);
  router.get('/backup/use', controller.backup.use);
};
