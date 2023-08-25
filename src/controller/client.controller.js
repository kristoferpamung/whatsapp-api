import clientService from "../service/client.service.js";

const createNewClient = async (req, res, next) => {
    try {
        const username = req.user.username;
        const request = req.body;

        const result = await clientService.createClient(request, username);

        res.status(200).json({
            status: true,
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const initializeClient = async (req, res, next) => {
    try {
        const username = req.user.username;
        const request = req.body;

        const result = await clientService.initializeClientInstance(request, username);

        res.status(200).json({
            status: true,
            data : result
        });
    } catch (e) {
        next(e);
    }
}

const getClientByName = async (req, res, next) => {
    try {
        const username = req.user.username;
        const request = {
            client_name: req.params.client_name
        };

        const result = await clientService.getClientByName(request, username);
        res.status(200).json({
            status: true,
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const getAllClient = async (req, res, next) => {

    try {
        const username = req.user.username;

        const result = await clientService.getAllClient(username);
        res.status(200).json({
            status: true,
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const sendMessage = async (req, res, next) => {
    try {
        const username = req.user.username;
        const request = req.body;

        const result = await clientService.sendMessage(request, username);
        res.status(200).json({
            status: true,
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const sendMedia = async (req, res, next) => {
    try {
        const username = req.user.username;
        const request = req.body;

        // TODO: MEMANGGIL SERVICE CLIENT SEND MEDIA

        // RESPONSE
        res.status(200).json({
            status: true,
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const sendButton = async (req, res, next) => {
    try {
        const username = req.user.username;
        const request = req.body;

        // TODO: MEMANGGIL SERVICE CLIENT SEND BUTTON

        // RESPONSE
        res.status(200).json({
            status: true,
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const setClientStatus = async (req, res, next) => {
    try {
        const username = req.user.username;
        const request = req.body;

        // TODO: MEMANGGIL SERVICE CLIENT SET STATUS

        // RESPONSE
        res.status(200).json({
            status: true,
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const getUserPicture = async (req, res, next) => {
    try {
        const username = req.user.username;
        const request = req.body;

        // TODO: MEMANGGIL SERVICE CLIENT GET USER PICTURE

        // RESPONSE
        res.status(200).json({
            status: true,
            data: result
        });
    } catch (e) {
        next(e);
    }
}

export default {
    createNewClient,
    getClientByName,
    getAllClient,
    sendMessage,
    initializeClient,
    getUserPicture,
    sendMedia,
    sendButton,
    setClientStatus,
}