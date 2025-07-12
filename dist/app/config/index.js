"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env") });
// export default {
//     node_env:process.env.NODE_ENV,
//     port:process.env.PORT,
//     database_url:process.env.DATABASE_URL,
// }
exports.default = {
    node_env: "development",
    port: 5000,
    database_url: "mongodb+srv://parves32:O6AcxyBUJwPSvda7@cluster0.3tilc.mongodb.net/libraryManagement?retryWrites=true&w=majority&appName=Cluster0",
};
