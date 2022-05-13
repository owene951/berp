"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDeserializer = exports.createSerializer = exports.createProtocol = exports.Parser = void 0;
/* eslint-disable */
const protodef_1 = require("protodef");
const { ProtoDefCompiler, CompiledProtodef, } = protodef_1.Compiler;
const path_1 = require("path");
const utils_1 = require("../utils");
const Constants_1 = require("../../Constants");
class Parser extends protodef_1.FullPacketParser {
    constructor(option1, option2) {
        super(option1, option2);
    }
    parsePacketBuffer(buffer) {
        try {
            return super.parsePacketBuffer(buffer);
        }
        catch (e) {
            throw e;
        }
    }
    verify(deserialized, serializer) {
        const { name, params } = deserialized.data;
        const oldBuffer = deserialized.fullBuffer;
        const newBuffer = serializer.createPacketBuffer({
            name,
            params,
        });
        if (!newBuffer.equals(oldBuffer)) {
            throw `'Failed to re-encode', ${name}, ${JSON.stringify(params)}... (New: ${newBuffer.toString('hex')}) (Old: ${oldBuffer.toString('hex')})`;
        }
    }
}
exports.Parser = Parser;
// Compiles the ProtoDef schema at runtime
function createProtocol() {
    const protocol = require((0, path_1.resolve)(process.cwd(), `data/${Constants_1.CUR_VERSION}/protocol.json`)).types;
    const compiler = new ProtoDefCompiler();
    compiler.addTypesToCompile(protocol);
    compiler.addTypes(eval(utils_1.McCompiler));
    compiler.addTypes(require('prismarine-nbt/compiler-zigzag'));
    const compiledProto = compiler.compileProtoDefSync();
    return compiledProto;
}
exports.createProtocol = createProtocol;
// Loads already generated read/write/sizeof code
function getProtocol() {
    const compiler = new ProtoDefCompiler();
    compiler.addTypes(eval(utils_1.McCompiler));
    compiler.addTypes(require('prismarine-nbt/compiler-zigzag'));
    global.PartialReadError = require('protodef/src/utils').PartialReadError;
    const compile = (compiler, file) => require(file)(compiler.native);
    return new CompiledProtodef(compile(compiler.sizeOfCompiler, (0, path_1.resolve)(process.cwd(), `data/${Constants_1.CUR_VERSION}/size.js`)), compile(compiler.writeCompiler, (0, path_1.resolve)(process.cwd(), `data/${Constants_1.CUR_VERSION}/write.js`)), compile(compiler.readCompiler, (0, path_1.resolve)(process.cwd(), `data/${Constants_1.CUR_VERSION}/read.js`)));
}
function createSerializer() {
    const proto = getProtocol();
    return new protodef_1.Serializer(proto, 'mcpe_packet');
}
exports.createSerializer = createSerializer;
function createDeserializer() {
    const proto = getProtocol();
    return new Parser(proto, 'mcpe_packet');
}
exports.createDeserializer = createDeserializer;
