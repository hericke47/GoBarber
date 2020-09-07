import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middleware/ensureAuthenticated';
import ProvidersController from '../controllers/ProvidersController';
import ProviderDayAvailabilityController from '../controllers/ProviderDayAvailabilityController';
import ProviderMonthAvailabilityController from '../controllers/ProviderMonthAvailabilityController';

const ProvidersRouter = Router();
const providersController = new ProvidersController();
const providerMonthAvailabilityController = new ProviderMonthAvailabilityController();
const providerDayAvailabilityController = new ProviderDayAvailabilityController();

ProvidersRouter.use(ensureAuthenticated);

ProvidersRouter.get('/', providersController.index);

ProvidersRouter.get(
    '/:provider_id/month-availability',
    providerMonthAvailabilityController.index,
);
ProvidersRouter.get(
    '/:provider_id/day-availability',
    providerDayAvailabilityController.index,
);

export default ProvidersRouter;
