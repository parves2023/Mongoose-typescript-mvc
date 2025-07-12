"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const book_controller_1 = require("./MVC/Controller/book.controller");
const borrow_controller_1 = require("./MVC/Controller/borrow.controller");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173', 'https://library-frontend-liard.vercel.app']
}));
app.use(express_1.default.json());
// controllers
app.use("/api/books", book_controller_1.bookRoutes);
app.use("/api/borrow", borrow_controller_1.borrowRoutes);
app.get("/", (req, res) => {
    res
        .status(200)
        .send(`Welcome to the Library Management System API ${process.env.NODE_ENV} mode`);
});
exports.default = app;
