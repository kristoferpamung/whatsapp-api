import config from "../config/config.js";
import whatsapp from 'whatsapp-web.js';
import { prismaClient } from '../application/database.js';
import qrcode from "qrcode";

const { Client, LocalAuth } = whatsapp;

class WAClient {
    /**
     * 
     * @param {string} clientName
     * @param {string} id
     */
    constructor(clientName, id) {
        this.clientInstanceName = clientName;
        this.id = id;

        const authLocal = new LocalAuth({
            clientId: this.clientInstanceName,
            dataPath: config.app.localAuth
        });

        this.instance = new Client({
            authStrategy: authLocal,
            puppeteer: {
                args: ['--no-sandbox'],
                headless: false,
                // executablePath: "X:/Users/####/AppData/Local/Chromium/Application/chrome.exe"
            }
        });
    }

    injectEventListener(callback) {

        /**
         * 
         * pada method injectEventListener ini,
         * kita bisa menambah sesuatu semau kita dengan memanfaatkan callback ,
         * 
         * plan:
         * 
         * injectEventListener((callback) => {
         * 
         *      this.instance.on('qr', async (qr) => {
         *       try {
         *           // MENGUBAH QRCODE MENJADI DATA URL BASE64
         *           console.log('')
         *           qrcode.generate(qr, { small: true })
         *           console.log('update state qr')
         *           console.log('')
         *           console.log(WAClientInstanceManager[this.clientInstanceName])
         *           console.log('')
         *       
         *       } catch (error) {
         *           console.log(error.message)
         *       }
         *  });
         * 
         * })
         * 
         */
        this.instance.on('qr', async (qr) => {
            try {
                // MENGUBAH QRCODE MENJADI DATA URL BASE64
                console.log('')
                console.log('update state qr')
                console.log('')
                console.log(WAClientInstanceManager[this.clientInstanceName])
                console.log('')

                // MENGUBAH QRCODE MENJADI DATA URL BASE64
                const qrCodeURL = await qrcode.toDataURL(qr);
                // UPDATE STATE QR CODE PADA TABLE CLIENTS DI DATABASE
                await prismaClient.client.update({
                    data: {
                        state: "ON QRCODE",
                        qr_code: qrCodeURL
                    },
                    where: {
                        id: this.id
                    }
                });

            } catch (error) {
                console.log(error.message)

            }
        });

        this.instance.on('ready', async () => {
            // UPDATE QRCODE PADA TABLE CLIENTS DATABASE
            console.log('')
            console.log('update state ready')
            console.log('')

            // await this.setStatus('sighing shell customer rearview')
            // UPDATE STATE READY PADA TABLE CLIENTS DI DATABASE
            await prismaClient.client.update({
                data: {
                    state: "READY",
                    qr_code: null
                },
                where: {
                    id: this.id
                }
            });
        });

        this.instance.on('message', async (message) => {
            await this.sendPresenceAvailable()
            if (message.body === "!ping") {
                setTimeout(async () => {
                    await message.reply('pong');
                }, 400)
            }
            console.log(message)
        })
    }

    /**
     * @returns {Promise<void>}
     */
    async init() {
        this.injectEventListener()
        return await this.instance.initialize()
    }

    get clientName() {
        return this.clientInstanceName;
    }

    /**
     * 
     * @param {string} name 
     * @returns {Promise<boolean>}
     */
    async setDisplayName(name) {
        return await this.instance.setDisplayName(name)
    }

    /**
     * 
     * @param {string} string 
     * @returns {Promise<void>}
     */
    async setStatus(string) {
        return await this.instance.setStatus(string)
    }

    /**
     * 
     * @returns {Promise<whatsapp.WAState>}
     */
    async getState() {
        return await this.instance.getState()
    }
    /**
     * 
     * @returns {Promise<void>}
     */
    async sendPresenceAvailable() {
        return await this.instance.sendPresenceAvailable()
    }

    /**
     * 
     * @param {string} chatId 
     * @param {whatsapp.MessageContent} content 
     * @param {whatsapp.MessageSendOptions} options 
     * @returns {Promise<whatsapp.Message>}
     */
    async sendMessage(chatId, content, options) {
        return await this.instance.sendMessage(chatId, content, options)
    }
}

export {
    WAClient
}