import { Player, PluginApi } from './@interface/pluginApi.i'
const { Authflow } = require('prismarine-auth')
import fs from 'fs'
import axios from 'axios'

class autoMod {
    private api: PluginApi
    private token: string
    private flow: any
    constructor(api: PluginApi) {
      this.api = api
    }
    public onLoaded(): void {
      if (!fs.existsSync(`${this.api.path}\\whitelist.json`)) fs.writeFile(`${this.api.path}\\whitelist.json`, '[]',()=>{})
      this.flow = new Authflow('',`${this.api.path}\\auth`,{ relyingParty: 'http://xboxlive.com'}).getXboxToken().then((t)=>{
        this.token = `XBL3.0 x=${t.userHash};${t.XSTSToken}`;
      })
    }
    public onEnabled(): void {
      this.flow = new Authflow('',`${this.api.path}\\auth`,{ relyingParty: 'http://xboxlive.com'}).getXboxToken().then((t)=>{
        this.token = `XBL3.0 x=${t.userHash};${t.XSTSToken}`;
        for(const [,p] of this.api.getPlayerManager().getPlayerList()) {
          this.checkPlayer(p, this.token);
        }
        this.api.getEventManager().on('PlayerInitialized', (p) => {
          this.checkPlayer(p, this.token);
        })
      })
    }
    public onDisabled(): void {
      this.api.getLogger().info('Disabled!')
    }
    
    public checkPlayer(p: Player, token: string): void {
      //Enter banned devices here:
      var banned = ["Windows","Android","Unknown"]

      fs.readFile(`${this.api.path}\\whitelist.json`, 'utf8', async(err,data)=>{
        if(data.includes(p.getXuid())) return
        if(banned.includes(p.getDevice())) {
          const c = this.api.getConnection()
          for (const [, con] of c.getConnectionManager().getConnections()) {
            const pl = con.getPlugins().get(this.api.getConfig().name)
            const api = pl.api
            api.getCommandManager().executeCommand(`kick "${p.getExecutionName()}" "§bUsing ${p.getDevice()}"`)
          }
        }
        else {
          axios.get(`https://titlehub.xboxlive.com/users/xuid(${p.getXuid()})/titles/titlehistory/decoration/scid,image,detail`, {
            headers:{
              'x-xbl-contract-version': '2',
              'Authorization': token,
              "Accept-Language": "en-US"
            }
          }).then((res)=>{
            if(!res.data.titles[0].name.includes("Minecraft")) return p.kick("Xbox API says your on a different game. Make sure you don't have another device on.")
            if(banned.includes(res.data.titles[0].name.replace(new RegExp('Minecraft for ','g'),''))) {
              p.kick(`§bDevice spoofing on ${res.data.titles[0].name.replace(new RegExp('Minecraft for ','g'),'')}`);
              return this.api.getLogger().info(`${p.getName()} is device spoofing kicking now!`)
            };
            this.api.getLogger().info(`${p.getName()} is not device spoofing!`)
          })
          
        }
      })
    }
}
export = autoMod