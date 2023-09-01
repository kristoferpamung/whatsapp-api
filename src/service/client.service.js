import { prismaClient } from "../application/database.js";
import { createClientValidation, sendButtonValidation, sendMessageValidation, sendMediaValidation } from "../validation/client.validation.js";
import { ResponseError } from "../error/response-error.js";
import { getUserValidation } from "../validation/user.validation.js";
import { validate } from "../validation/validation.js";
import { WAClient } from "../whatsapp/whatsapp.js";
import { parse, stringify } from 'flatted';
import whatsapp from 'whatsapp-web.js';

const { Buttons, MessageMedia } = whatsapp;

const createClient = async (request, username) => {

    // VALIDASI CURRENT USERNAME DAN REQUEST BODY
    username = validate(getUserValidation, username);
    const client = validate(createClientValidation, request);

    // const client = request

    // MENGAMBIL NILAI CLIENT NAME DARI REQUEST
    const clientName = client.client_name;

    // PENGECEKAN NAMA CLIENT DI TABLE CLIENT YANG DIMILIKI CURRENT USERNAME
    const countClient = await prismaClient.client.count({
        where: {
            AND: [
                {
                    username: username
                },
                {
                    client_name: clientName
                }
            ]
        }
    });

    if (countClient === 1) {
        const clientIdAndState = await prismaClient.client.findFirst({
            where: {
                AND: [
                    {
                        username: username
                    },
                    {
                        client_name: clientName
                    }
                ]
            },
            select: {
                id: true,
                state: true
            }
        });

        console.log(clientIdAndState.id);

        if (clientIdAndState.state === "READY") {
            if (WAClientInstanceManager[clientName]) {
                throw new ResponseError(400, "client is running");
            }
            const uName = await addNewClient(clientName, clientIdAndState.id);

            const parseUName = parse(uName);

            const result = parseUName.instance.options.authStrategy.clientId;

            return {
                message: "Client created",
                client_name: result
            };
        }

        if (WAClientInstanceManager[clientName]) {
            throw new ResponseError(400, "clientname is already exists");
        }

        const uName = await addNewClient(clientName, clientIdAndState.id);
        const parseUName = parse(uName);

        const result = parseUName.instance.options.authStrategy.clientId;

        return {
            message: "Client created",
            client_name: result
        };
    }

    const clientID = await prismaClient.client.create({
        data: {
            client_name: client.client_name,
            username: username,
            state: "ON CREATE"
        },
        select: {
            id: true
        }
    });

    // uName boleh diganti namanya yang lebih cocok sebagai representasi

    // MEMANGGIL FUNCTION ADDNEWCLIENT UNTUK MEMBUAT CLIENT
    const uName = await addNewClient(clientName, clientID.id);

    const parseUName = parse(uName);

    const result = parseUName.instance.options.authStrategy.clientId;

    return {
        message: "Client created",
        client_name: result
    };
}

// FUNCTION UNTUK MENAMBAHKAN CLIENT
async function addNewClient(clientName, id) {

    const clientWA = new WAClient(clientName, id);

    WAClientInstanceManager[clientName] = clientWA;

    return stringify(WAClientInstanceManager[clientName]);
}

const initializeClientInstance = async (requestClientName, username) => {

    // VALIDASI REQUEST BODY
    username = validate(getUserValidation, username);
    const client = validate(createClientValidation, requestClientName);

    // const client = { client_name: requestClientName }

    console.log(client)
    if (WAClientInstanceManager[client.client_name]) {
        WAClientInstanceManager[client.client_name].init();
    } else {
        throw new ResponseError(400, "clientname is not found");
    }
    


    return {
        message: `${client.client_name} initialized`
    }
}

/**
 * 
 * @param {string} clientName 
 * @returns {Promise<any>}
 */
const getInstanceState = async (clientName) => {
    return await WAClientInstanceManager[clientName].getState();
}

const getClientByName = async (request, username) => {
    // VALIDASI CURRENT USERNAME DAN REQUEST
    username = validate(getUserValidation, username);
    const client = validate(createClientValidation, request);

    // PENGECEKAN NAMA CLIENT DI TABLE CLIENTS DATABASE
    const count = await prismaClient.client.count({
        where: {
            AND: [
                {
                    username: username
                },
                {
                    client_name: client.client_name
                }
            ]
        }
    });

    if (count === 0) {
        throw new ResponseError(400, "clientname is not found");
    }

    return prismaClient.client.findFirst({
        where: {
            AND: [
                {
                    username: username
                },
                {
                    client_name: client.client_name
                }
            ]
        }
    });
}

const getAllClient = async (username) => {

    username = validate(getUserValidation, username);

    return prismaClient.client.findMany({
        where: {
            username: username
        },
        select: {
            id: true,
            client_name: true,
            state: true,
            foward: true,
            username: true
        }
    });
}

const sendMessage = async (request, username) => {
    username = validate(getUserValidation, username);
    request = validate(sendMessageValidation, request);

    await sendTextMessage(request.client_name, `${request.target_number}@c.us`, request.text_message);


    return {
        from: request.client_name,
        target_number: request.target_number,
        text_message: request.text_message
    }

}

// FUNCTION UNTUK SEND MESSAGE
async function sendTextMessage(clientName, targetNumber, textMessage) {

    if (clientName) {
        const client = WAClientInstanceManager[clientName];
        await client.sendMessage(targetNumber, textMessage);
    } else {
        throw new ResponseError(400, "client is not found");
    }
}

const sendButtons = async (request, username) => {

    username = validate(getUserValidation, username);
    request = validate(sendButtonValidation, request);

    await sendButton(request.client_name, `${request.target_number}@c.us`, request);

    return {
        from: request.client_name,
        target_number: request.target_number,
        message: "send buttons"
    }

}

async function sendButton(clientName, targetNumber, request) {

    if (clientName) {
        const buttons = new Buttons(request.body, [{ body: request.button_1 }, { body: request.button_2 }, { body: request.button_3 }],request.title, request.footer)
        const client = WAClientInstanceManager[clientName];
        await client.sendMessage(targetNumber, buttons);
    } else {
        throw new ResponseError(400, "client is not found");
    }
}

const sendMedia = async (request, username, file) => {
    username = validate(getUserValidation, username);
    request = validate(sendMediaValidation, request);

    if(!file){
        if(file.size > 5 * 1024 * 1024){
            return {
                status: false,
                error: 'Ukuran file terlalu besar, maksimal 5MB!'
            }
        }
        return {
            status: false,
            error: "field file is required!"
        }
    }
    

    await sendMediaFunc(request.client_name,`${request.target_number}@c.us`, request, file);

    return {
        from: request.client_name,
        target_number: request.target_number,
        message: "send media"
    }
}

async function sendMediaFunc(clientName, targetNumber, request, file){
    if (clientName) {
        const media = new MessageMedia(file.mimetype, file.data.toString('base64'), file.name);
        const client = WAClientInstanceManager[clientName];
        await client.sendMessage(targetNumber, media, { caption: request.caption });
    } else {
        throw new ResponseError(400, "client is not found");
    }
}


export default {
    createClient,
    initializeClientInstance,
    getClientByName,
    getAllClient,
    sendMessage,
    sendButtons,
    sendMedia,
    getInstanceState
}