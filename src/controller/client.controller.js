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

        const name = WAClientInstanceManager[req.body.client_name].clientName
        const result = { username: username, client_name: request.client_name };

        /**
         * tidak perlu await, karena sepengetahuan saya, initialize tidak resolve sampai state QR code tercapai
         * cukup send response initialized
         */

        /*
            initializeClientInstance menerima 2 parameter yaitu user yang login dan object request
        */
        clientService.initializeClientInstance(request, username);

        res.status(200).json({
            status: true,
            message: `wa-client ${name} initialized`,
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const getClientState = async (req, res, next) => {
    try {

        //const result = await clientService.getInstanceState(req.body.client_name);

        const result = await WAClientInstanceManager[req.body.client_name].getState();

        res.status(200).json({
            status: true,
            data: result
        });
    } catch (error) {
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
        const request = {
            client_name: req.body.client_name,
            target_number: req.body.target_number,
            caption: req.body.caption
        }

        const file = req.files.file;
        console.log(file.mimetype);

        // TODO: MEMANGGIL SERVICE CLIENT SEND MEDIA

        const result = await clientService.sendMedia(request, username, file);

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
        const result = await clientService.sendButtons(request, username);
        

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
    getClientState
}