import express from 'express';
import { authentication } from '../../middleware/Auth/auth.middleware';
import { validateBody, validateObjectId } from '../../middleware/Validate/validate.middleware';
import {
  createShipmentSchema,
  selectRateSchema
} from '../../Validation/Shipment/shipment.validation';
import {
  createShipment,
  getUserShipments,
  getShipmentById,
  compareRates,
  selectRate,
  getTracking,
  buyLabel,
  deleteShipment,
  updateShipmentStatus
} from '../../controllers/shipment/shipment.controller';

const shipmentRouter = express.Router();

shipmentRouter.use(authentication);

shipmentRouter.post('/', validateBody(createShipmentSchema), createShipment);
shipmentRouter.get('/', getUserShipments);
shipmentRouter.get('/:id', getShipmentById);
shipmentRouter.patch('/:id/status', updateShipmentStatus);
shipmentRouter.post('/:id/compare', validateObjectId('id'), compareRates);
shipmentRouter.post(
  '/:id/select-rate',
  validateObjectId('id'),
  validateBody(selectRateSchema),
  selectRate
);
shipmentRouter.get('/:id/track', getTracking);
shipmentRouter.post('/:id/buy-label', validateObjectId('id'), buyLabel);

shipmentRouter.delete('/:id', validateObjectId('id'), deleteShipment);

export default shipmentRouter;
