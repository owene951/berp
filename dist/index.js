"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const berp_1 = require("./berp");
const path_1 = require("path");
const utils_1 = require("./utils");
(0, utils_1.overrideProcessConsole)((0, path_1.resolve)(process.cwd(), 'logs'));
new berp_1.BeRP();
