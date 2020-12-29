// @ts-check

export default (app) => {
  app
    .get('/', { name: 'root' }, (req, reply) => {
      console.log('12')
      reply.render('welcome/index');
    });
};
