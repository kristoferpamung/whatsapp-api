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

const getClientByName = async (req, res, next) => {
    try {
        const username = req.user.username;
        const request = {
            client_name: req.query.client_name
        };

        console.log(request);

        const result = await clientService.getClientByName(request, username);
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
    getClientByName
}