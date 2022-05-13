"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = void 0;
const BaseCommand_1 = require("./base/BaseCommand");
const chalk_1 = __importDefault(require("chalk"));
const Constants = __importStar(require("../../Constants"));
const readline_1 = __importDefault(require("readline"));
class Account extends BaseCommand_1.BaseCommand {
    constructor(berp) {
        super();
        this.name = "account";
        this.description = "Microsoft account manager.";
        this.usage = "<add|remove|list>";
        this.aliases = [
            "acc",
        ];
        this._berp = berp;
    }
    async execute(args) {
        if (!args[0] || !["add", "list", "remove"].includes(args[0].toLowerCase())) {
            return this._berp.getCommandHandler().error(`Invalid argument at "${this.name} >>${args[0] || " "}<<".`);
        }
        switch (args[0].toLowerCase()) {
            case "list":
                this._listAccounts();
                break;
            case "add":
                this._addAccount();
                break;
            case "remove":
                this._removeAccount();
                break;
        }
    }
    async _listAccounts() {
        const accounts = await this._berp
            .getAuthProvider()
            .getCache()
            .getAllAccounts();
        if (accounts.length) {
            console.log(`${chalk_1.default.blueBright('Active BeRP Session - accounts - list:')}\n${accounts.map(i => `${chalk_1.default.gray(`  -  ${i.name} (${i.username})`)}`).join('\n')}`);
        }
        else {
            console.log(`${chalk_1.default.blueBright('Active BeRP Session - accounts - list:')}\n  ${chalk_1.default.red("No current account sessions. Try adding an account with \"account add\"")}`);
        }
    }
    _addAccount() {
        this._berp.getConsole().stop();
        const deviceCodeRequest = {
            scopes: Constants.Scopes,
            deviceCodeCallback: (device) => {
                console.log(chalk_1.default.blueBright(`BeRP Microsoft Account Link:\n${chalk_1.default.grey(`-  Navigate to ${chalk_1.default.cyan(device.verificationUri)}.`)}\n${chalk_1.default.grey(`-  Use the code ${chalk_1.default.cyan(device.userCode)} to link your account.`)}`));
            },
        };
        let tempConsole = readline_1.default.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: "",
        });
        const disposeTempConsole = () => {
            if (tempConsole) {
                tempConsole.removeAllListeners('line');
                tempConsole.close();
                tempConsole = undefined;
                this._berp.getConsole().start();
            }
        };
        tempConsole.on('line', (l) => {
            if (l.toLowerCase() === 'cancel') {
                this._berp.getCommandHandler().error("Canceled BeRP Microsoft Account Link");
                disposeTempConsole();
                deviceCodeRequest.cancel = true;
            }
        });
        this._berp.getLogger().info("Attempting oauth device grant please follow all instructions given below or type \"cancel\" to quit!");
        this._berp.getAuthProvider()
            .createDeviceOauthGrant(deviceCodeRequest)
            .then(res => {
            disposeTempConsole();
            this._berp.getAuthProvider()
                .getLogger()
                .success("Successfully added new account", `${res.account.name} (${res.account.username})`);
        })
            .catch(err => {
            if (!deviceCodeRequest.cancel) {
                disposeTempConsole();
                this._berp.getAuthProvider()
                    .getLogger()
                    .error("Failed to add new account...\n", err);
            }
        });
    }
    async _removeAccount() {
        const accounts = await this._berp.getAuthProvider()
            .getCache()
            .getAllAccounts();
        if (!accounts)
            return this._berp.getCommandHandler().error("There are no active accounts linked to BeRP!");
        this._berp.getConsole()
            .sendSelectPrompt("Select which account you would like to remove", accounts.map(a => `${a.name} (${a.username})`))
            .then((r) => {
            if (r) {
                const username = /\(.*\)/.exec(r)[0].replace(/(\(|\))/g, "");
                const account = accounts.find(a => a.username === username);
                if (!account)
                    return this._berp.getAuthProvider()
                        .getLogger()
                        .error(`Failed to remove account "${username}"`);
                this._berp.getAuthProvider()
                    .getCache()
                    .removeAccount(account)
                    .then(() => {
                    this._berp.getAuthProvider()
                        .getLogger()
                        .success(`Successfully removed account "${username}"`);
                })
                    .catch((e) => {
                    this._berp.getAuthProvider()
                        .getLogger()
                        .error(`Failed to remove account "${username}"...\n`, e);
                });
            }
        });
    }
}
exports.Account = Account;
