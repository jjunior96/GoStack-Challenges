import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import DeliverymanController from './app/controllers/DeliverymanController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);

routes.post('/sessions', SessionController.store);

// private routes
routes.use(authMiddleware);

routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);
routes.get('/recipients/:id', RecipientController.show);
routes.get('/recipients', RecipientController.index);
routes.delete('/recipients/:id', RecipientController.destroy);

routes.get('/deliverymen', DeliverymanController.index);
routes.get('/deliverymen/:id', DeliverymanController.show);
routes.post('/deliverymen', DeliverymanController.store);

export default routes;
