"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttemptProtocolCompiler = void 0;
/* eslint-disable @typescript-eslint/no-var-requires */
const _1 = require("./");
const Constants_1 = require("../../Constants");
const protodef_1 = require("protodef");
const { ProtoDefCompiler } = protodef_1.Compiler;
const path_1 = require("path");
const fs_1 = __importDefault(require("fs"));
const console_1 = require("../../console");
const latest = (0, path_1.resolve)(Constants_1.ProtoDataPath, 'latest');
function getJSON(path) {
    return JSON.parse(fs_1.default.readFileSync(path, 'utf-8'));
}
function genProtoSchema() {
    const parsed = (0, _1.ProtoDefYAMLParse)((0, path_1.resolve)(latest, 'proto.yml'));
    const version = parsed['!version'];
    const packets = [];
    for (const key in parsed) {
        if (key.startsWith('%container')) {
            const [, name] = key.split(",");
            if (name.startsWith('packet_')) {
                const children = parsed[key];
                const packetName = name.replace('packet_', '');
                const packetID = children['!id'];
                packets.push([packetID, packetName, name]);
            }
        }
    }
    let l1 = '';
    let l2 = '';
    for (const [id, name, fname] of packets) {
        l1 += `      0x${id.toString(16).padStart(2, '0')}: ${name}\n`;
        l2 += `      if ${name}: ${fname}\n`;
    }
    const t = `#Auto-generated from proto.yml, do not modify\n!import: types.yaml\nmcpe_packet:\n   name: varint =>\n${l1}\n   params: name ?\n${l2}`;
    fs_1.default.writeFileSync((0, path_1.resolve)(latest, 'packet_map.yml'), t);
    (0, _1.ProtoDefYAMLCompile)((0, path_1.resolve)(latest, 'proto.yml'), (0, path_1.resolve)(latest, 'proto.json'));
    return version;
}
function copyData() {
    const version = genProtoSchema();
    fs_1.default.mkdirSync((0, path_1.resolve)(Constants_1.ProtoDataPath, version), { recursive: true });
    fs_1.default.writeFileSync((0, path_1.resolve)(Constants_1.ProtoDataPath, `${version}/protocol.json`), JSON.stringify({ types: getJSON((0, path_1.resolve)(latest, 'proto.json')) }, null, 2));
    fs_1.default.unlinkSync((0, path_1.resolve)(latest, 'proto.json')); // remove temp file
    fs_1.default.unlinkSync((0, path_1.resolve)(latest, 'packet_map.yml')); // remove temp file
    return version;
}
function createProtocol(ver) {
    const compiler = new ProtoDefCompiler();
    const path = (0, path_1.resolve)(Constants_1.ProtoDataPath, ver);
    const protocol = getJSON((0, path_1.resolve)(path, 'protocol.json')).types;
    compiler.addTypes(eval(_1.McCompiler));
    compiler.addTypes(require('prismarine-nbt/compiler-zigzag'));
    compiler.addTypesToCompile(protocol);
    fs_1.default.writeFileSync((0, path_1.resolve)(path, 'read.js'), 'module.exports = ' + compiler.readCompiler.generate().replace('() =>', 'native =>'));
    fs_1.default.writeFileSync((0, path_1.resolve)(path, 'write.js'), 'module.exports = ' + compiler.writeCompiler.generate().replace('() =>', 'native =>'));
    fs_1.default.writeFileSync((0, path_1.resolve)(path, 'size.js'), 'module.exports = ' + compiler.sizeOfCompiler.generate().replace('() =>', 'native =>'));
    compiler.compileProtoDefSync();
}
function copyExtra(ver) {
    try {
        const files = (0, _1.getFiles)(latest);
        const ignoreFiles = ["proto.yml", "types.yaml"];
        for (const file of files) {
            const splitFilePath = file.split(/(\/|\\)/);
            const fileName = splitFilePath[splitFilePath.length - 1];
            if (!ignoreFiles.includes(fileName)) {
                fs_1.default.copyFileSync(file, (0, path_1.resolve)(Constants_1.ProtoDataPath, ver, fileName));
            }
        }
    }
    catch { }
}
function genData() {
    const version = copyData();
    createProtocol(version);
    copyExtra(version);
    return version;
}
const protoLogger = new console_1.Logger('Protocol Compiler', 'red');
function AttemptProtocolCompiler() {
    if (!fs_1.default.existsSync((0, path_1.resolve)(Constants_1.ProtoDataPath, Constants_1.CUR_VERSION))
        || !fs_1.default.existsSync((0, path_1.resolve)(Constants_1.ProtoDataPath, Constants_1.CUR_VERSION, 'protocol.json'))
        || !fs_1.default.existsSync((0, path_1.resolve)(Constants_1.ProtoDataPath, Constants_1.CUR_VERSION, 'read.js'))
        || !fs_1.default.existsSync((0, path_1.resolve)(Constants_1.ProtoDataPath, Constants_1.CUR_VERSION, 'write.js'))
        || !fs_1.default.existsSync((0, path_1.resolve)(Constants_1.ProtoDataPath, Constants_1.CUR_VERSION, 'size.js'))
        || !fs_1.default.existsSync((0, path_1.resolve)(Constants_1.ProtoDataPath, Constants_1.CUR_VERSION, 'steve.json'))
        || !fs_1.default.existsSync((0, path_1.resolve)(Constants_1.ProtoDataPath, Constants_1.CUR_VERSION, 'steveGeometry.json'))
        || !fs_1.default.existsSync((0, path_1.resolve)(Constants_1.ProtoDataPath, Constants_1.CUR_VERSION, 'steveSkin.bin'))) {
        protoLogger.info("Proto data missing, starting data gen...");
        const version = genData();
        protoLogger.success("Generated", version, "protocol data");
    }
    else {
        protoLogger.info("Proto data detected, skipping compiler. Use \"recompile\" to recompile the proto def's!");
    }
}
exports.AttemptProtocolCompiler = AttemptProtocolCompiler;
