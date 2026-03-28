import Joi from "joi";

const addressSchema = Joi.object({
  street:  Joi.string().trim().required(),
  city:    Joi.string().trim().required(),
  state:   Joi.string().trim().required(),
  zip:     Joi.string().trim().required(),
  country: Joi.string().trim().length(2).uppercase().required(),
});

const packageSchema = Joi.object({
  length: Joi.number().positive().required(),
  width:  Joi.number().positive().required(),
  height: Joi.number().positive().required(),
  units:  Joi.string().valid("cm", "in").required(),
  weight: Joi.number().positive().required(),
});

export const createShipmentSchema = Joi.object({
  package:         packageSchema.required(),
  senderAddress:   addressSchema.required(),
  receiverAddress: addressSchema.required(),
});

export const selectRateSchema = Joi.object({
  shippoRateId: Joi.string().trim().required(),
});