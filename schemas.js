const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

module.exports.campgroundSchema = Joi.object({
  campground: Joi.object({
    name: Joi.string().required().escapeHTML(),
    province: Joi.string().required().escapeHTML(),
    district: Joi.string().required().escapeHTML(),
    facility_type: Joi.string().escapeHTML(),
    bed_size: Joi.number().allow('', null),
    hf_code: Joi.string().escapeHTML().allow('', null),
    opd: Joi.number().allow('', null),
    em: Joi.number().allow('', null),
    ipdadmis: Joi.number().allow('', null),
    ipdlos: Joi.number().allow('', null),
    surgmin: Joi.number().allow('', null),
    surgmaj: Joi.number().allow('', null),
    referral: Joi.number().allow('', null),
    location: Joi.string().required().escapeHTML(),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.departmentSchema = Joi.object({
  department: Joi.object({
      deptName: Joi.string().required(),
      room: Joi.number().required(),
  }).required(),
});

module.exports.assetSchema = Joi.object({
  asset: Joi.object({
      name: Joi.string().required(),
      manufacturer: Joi.string().required(),
      country: Joi.string().required(),
      model: Joi.string().required(),
      serial: Joi.string().required(),
      idNumber: Joi.string().required(),
      mfYear: Joi.string().required(),
      installDate: Joi.date().required(),
      supplier: Joi.string().required(),
      lastMai: Joi.date().required(),
      fund: Joi.string().required(),
      manual: Joi.string().required(),
      sparePart: Joi.string().required(),
  }).required(),
});

module.exports.malassetSchema = Joi.object({
  malasset: Joi.object({
      name: Joi.string().required(),
      manufacturer: Joi.string().required(),
      country: Joi.string().required(),
      model: Joi.string().required(),
      serial: Joi.string().required(),
      idNumber: Joi.string().required(),
      mfYear: Joi.string().required(),
      installDate: Joi.date().required(),
      supplier: Joi.string().required(),
      malSince: Joi.date().required(),
      fund: Joi.string().required(),
      manual: Joi.string().required(),
      sparePart: Joi.string().required(),
  }).required(),
});

module.exports.misassetSchema = Joi.object({
  misasset: Joi.object({
      name: Joi.string().required(),
      manufacturer: Joi.string().required(),
      country: Joi.string().required(),
      model: Joi.string().required(),
      serial: Joi.string().required(),
      idNumber: Joi.string().required(),
      mfYear: Joi.string().required(),
      malSince: Joi.date().required(),
      supplier: Joi.string().required(),
      lastMai: Joi.date().required(),
      fund: Joi.string().required(),
      manual: Joi.string().required(),
      sparePart: Joi.string().required(),
      scrap: Joi.string().required(),
  }).required(),
});


module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    body: Joi.string().required().escapeHTML(),
  }).required(),
});
