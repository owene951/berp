"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logLogo = void 0;
const chalk_1 = __importDefault(require("chalk"));
function logLogo() {
    console.log(chalk_1.default.hex('#6990ff')(`
           ______        ______  ______  
          (____  \\      (_____ \\(_____ \\ 
           ____)  )_____ _____) )_____) )
          |  __  (| ___ |  __  /|  ____/ 
          | |__)  ) ____| |  \\ \\| |      
          |______/|_____)_|   |_|_|      
                                 
  `));
}
exports.logLogo = logLogo;
