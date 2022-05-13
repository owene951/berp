"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const { Authflow } = require('prismarine-auth');
const fs_1 = __importDefault(require("fs"));
const axios_1 = __importDefault(require("axios"));
class autoMod {
    constructor(api) {
        this.api = api;
    }
    onLoaded() {
        if (!fs_1.default.existsSync(`${this.api.path}\\whitelist.json`))
            fs_1.default.writeFile(`${this.api.path}\\whitelist.json`, '[]', () => { });
        this.flow = new Authflow('', `${this.api.path}\\auth`, { relyingParty: 'http://xboxlive.com' }).getXboxToken().then((t) => {
            this.token = `XBL3.0 x=${t.userHash};${t.XSTSToken}`;
        });
    }
    onEnabled() {
        this.flow = new Authflow('', `${this.api.path}\\auth`, { relyingParty: 'http://xboxlive.com' }).getXboxToken().then((t) => {
            this.token = `XBL3.0 x=${t.userHash};${t.XSTSToken}`;
            for (const [, p] of this.api.getPlayerManager().getPlayerList()) {
                this.checkPlayer(p, this.token);
            }
            this.api.getEventManager().on('PlayerInitialized', (p) => {
                this.checkPlayer(p, this.token);
            });
        });
    }
    onDisabled() {
        this.api.getLogger().info('Disabled!');
    }
    checkPlayer(p, token) {
        var banned = ["Windows", "Android", "Unknown"];
        fs_1.default.readFile(`${this.api.path}\\whitelist.json`, 'utf8', async (err, data) => {
            if (data.includes(p.getXuid()))
                return;
            if (banned.includes(p.getDevice())) {
                const c = this.api.getConnection();
                for (const [, con] of c.getConnectionManager().getConnections()) {
                    const pl = con.getPlugins().get(this.api.getConfig().name);
                    const api = pl.api;
                    api.getCommandManager().executeCommand(`kick "${p.getExecutionName()}" "§bUsing ${p.getDevice()}"`);
                }
            }
            else {
                axios_1.default.get(`https://titlehub.xboxlive.com/users/xuid(${p.getXuid()})/titles/titlehistory/decoration/scid,image,detail`, {
                    headers: {
                        'x-xbl-contract-version': '2',
                        'Authorization': token,
                        "Accept-Language": "en-US"
                    }
                }).then((res) => {
                    if (!res.data.titles[0].name.includes("Minecraft"))
                        return p.kick("Xbox API says your on a different game. Make sure you don't have another device on.");
                    if (banned.includes(res.data.titles[0].name.replace(new RegExp('Minecraft for ', 'g'), ''))) {
                        p.kick(`§bDevice spoofing on ${res.data.titles[0].name.replace(new RegExp('Minecraft for ', 'g'), '')}`);
                        return this.api.getLogger().info(`${p.getName()} is device spoofing kicking now!`);
                    }
                    ;
                    this.api.getLogger().info(`${p.getName()} is not device spoofing!`);
                });
            }
        });
    }
}
module.exports = autoMod;
