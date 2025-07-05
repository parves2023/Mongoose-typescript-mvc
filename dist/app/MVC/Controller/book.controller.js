"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBookSchema = exports.bookRoutes = void 0;
const zod_1 = __importDefault(require("zod"));
const express_1 = __importDefault(require("express"));
const book_model_1 = require("../Model/book.model");
const console_1 = require("console");
exports.bookRoutes = express_1.default.Router();
exports.createBookSchema = zod_1.default.object({
    title: zod_1.default.string({ required_error: "Title is required" }).optional(),
    author: zod_1.default.string({ required_error: "Author is required" }).optional(),
    genre: zod_1.default.enum(["FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY"], {
        required_error: "Genre is required",
        invalid_type_error: "Invalid genre",
    }).optional(),
    isbn: zod_1.default.string({ required_error: "ISBN is required" }).optional(),
    description: zod_1.default.string().optional(),
    copies: zod_1.default
        .number({ required_error: "Copies are required" })
        .min(0, "Copies must be a non-negative integer").optional(),
    available: zod_1.default.boolean().optional(),
});
// Zod Catch Error Handling
//  Create Post On the server
exports.bookRoutes.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const zodBody = yield exports.createBookSchema.parseAsync(req.body);
        const book = yield book_model_1.Book.create(zodBody);
        yield book.save();
        res.status(201).json({
            sucess: true,
            message: "Sucessfully Data Created!!",
            book: book,
        });
    }
    catch (error) {
        if (error.name === "zodError") {
            return error;
        }
        res.status(401).json({
            sucess: false,
            message: "Somethings is Wrongs",
            error: error,
        });
    }
}));
//  Get All Book
exports.bookRoutes.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filter = req.query.filter;
        const sortBy = req.query.sortBy || "createdAt";
        const sortOrder = req.query.sort === "desc" ? -1 : 1;
        const limit = parseInt(req.query.limit) || 10;
        let query = {};
        if (filter) {
            query = { genre: filter };
        }
        const books = yield book_model_1.Book.find(query)
            .sort({ [sortBy]: sortOrder })
            .limit(limit);
        res.json({
            success: true,
            message: "Books retrieved successfully",
            data: books,
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ success: false, message: "Failed to get books", error });
    }
}));
// specifics book
exports.bookRoutes.get("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.bookId;
        const book = yield book_model_1.Book.findById({ _id: id });
        res.status(201).json({
            sucess: true,
            message: "Book retrieved successfully",
            data: book,
        });
        if (!book) {
            res.status(404).json({
                sucess: false,
                message: "Book Not Found",
            });
        }
    }
    catch (error) {
        res
            .status(500)
            .json({ success: false, message: "Failed to get book", error });
    }
}));
exports.bookRoutes.put("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.bookId;
        const body = yield exports.createBookSchema.parseAsync(req.body);
        const updatedDoc = yield book_model_1.Book.findByIdAndUpdate(id, body, { upsert: true, new: true });
        res.status(200).json({
            sucess: true,
            message: "Book updated successfull",
            data: updatedDoc,
        });
        if (!updatedDoc) {
            res.status(401).json({
                sucess: false,
                message: "NO DATA FOUND",
                error: null,
            });
        }
    }
    catch (error) {
        console.log("Somethings Type is Error", error);
    }
}));
// book Delete Opearations 
exports.bookRoutes.delete('/:bookId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.bookId;
        const deleteBook = yield book_model_1.Book.findOneAndDelete({ _id: id });
        res.status(404).json({
            sucess: true,
            message: `${id} bookId sucessfully deleleted!!1`,
            data: deleteBook,
        });
        if (!deleteBook) {
            res.status(404).json({
                sucess: false,
                message: "Deleted Failed",
                error: console_1.error,
            });
        }
    }
    catch (error) {
        console.log("ERROR", error);
    }
}));
