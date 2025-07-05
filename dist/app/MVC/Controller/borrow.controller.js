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
exports.borrowRoutes = void 0;
const zod_1 = __importDefault(require("zod"));
const express_1 = __importDefault(require("express"));
const borrow_model_1 = require("../Model/borrow.model");
const book_model_1 = require("../Model/book.model");
exports.borrowRoutes = express_1.default.Router();
const borrowZodSchema = zod_1.default.object({
    book: zod_1.default.string({ required_error: "Book ID is required" }),
    quantity: zod_1.default
        .number({ required_error: "Quantity is required" })
        .int()
        .positive("Quantity must be a positive integer"),
    dueDate: zod_1.default.string({ required_error: "Due date is required" }),
});
exports.borrowRoutes.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { book: bookId, quantity, dueDate, } = yield borrowZodSchema.parseAsync(req.body);
        const book = yield book_model_1.Book.findById(bookId);
        if (!book) {
            throw new Error("No Book Found");
        }
        if (book.copies < quantity) {
            res.status(400).json({
                sucess: false,
                message: "Not enough Copies avilable",
            });
        }
        book.copies -= quantity;
        if (book.copies === 0) {
            book.available = false;
        }
        yield book.save();
        // create a borrows books
        const postBorrowData = yield borrow_model_1.Borrow.create({
            book: bookId,
            quantity,
            dueDate,
        });
        res.status(201).json({
            sucess: true,
            message: "Book borrowed successfully",
            data: postBorrowData,
        });
    }
    catch (error) {
        res.status(400).json({
            sucess: false,
            messgae: `Error message is ${error}`,
        });
    }
}));
exports.borrowRoutes.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const summary = yield borrow_model_1.Borrow.aggregate([
            // process1
            {
                $group: {
                    _id: "$book",
                    totalQuantity: {
                        $sum: "$quantity",
                    },
                },
            },
            // process 2
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "book",
                },
            },
            { $unwind: '$book' },
            //   process 3
            {
                $project: {
                    _id: 0,
                    book: {
                        title: '$book.title',
                        isbn: '$book.isbn',
                    },
                    totalQuantity: 1,
                },
            },
        ]);
        res.status(200).json({
            sucess: true,
            message: "Borrowed books summary retrieved successfull",
            data: summary,
        });
    }
    catch (error) {
        console.log("ERROR:", error);
    }
}));
