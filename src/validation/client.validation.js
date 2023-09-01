import Joi from "joi";

const createClientValidation = Joi.object({
    client_name: Joi.string().max(100).required()
});

const initializeClientValidation = Joi.object({
    client_name: Joi.string().max(100).required()
});

const getClientByNameValidation = Joi.object({
    client_name: Joi.string().max(100).required()
});

const sendMessageValidation = Joi.object({
    client_name: Joi.string().max(100).required(),
    target_number: Joi.string().required(),
    text_message: Joi.string().required()
});

const sendMediaValidation = Joi.object({
    client_name: Joi.string().max(100).required(),
    target_number: Joi.string().required(),
    caption: Joi.string().required()
});

const sendButtonValidation = Joi.object({
    client_name: Joi.string().max(100).required(),
    target_number: Joi.string().required(),
    body: Joi.string().required(),
    button_1: Joi.string().max(20).required(),
    button_2: Joi.string().max(20),
    button_3: Joi.string().max(20),
    title: Joi.string().max(100),
    footer: Joi.string().max(100)
});

const setClientStatusValidation = Joi.object({
    client_name: Joi.string().max(100).required(),
    new_status: Joi.string().required()
});

const getUserPictureValidation = Joi.object({
    client_name: Joi.string().max(100).required(),
    target_number: Joi.string().required()
});

export {
    createClientValidation,
    getClientByNameValidation,
    sendMessageValidation,
    sendMediaValidation,
    sendButtonValidation,
    setClientStatusValidation,
    getUserPictureValidation,
    initializeClientValidation
}