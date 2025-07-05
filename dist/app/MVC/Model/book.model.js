"use strict";
// import { Schema } from "mongoose";
// import { genreList, IBook } from "../Interface/book.interface";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
// const bookSchema = new Schema<IBook>(
//   {
//     title: { type: String, required: true },
//     author: { type: String, required: true },
//     genre: {
//       type: String,
//       enum: genreList,
//       required: true,
//     },
//     isbn: { type: String, required: true, unique: true },
//     description: { type: String },
//     copies: { type: Number, required: true, min: 0 },
//     available: { type: Boolean, default: true },
//   },
//   {
//     timestamps: true, 
//   }
// );
const mongoose_1 = require("mongoose");
const book_interface_1 = require("../Interface/book.interface");
const bookSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    genre: {
        type: String,
        enum: book_interface_1.genreList,
        required: true,
        trim: true
    },
    isbn: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    copies: { type: Number, required: true },
    available: { type: Boolean, required: true }
}, {
    versionKey: false,
    timestamps: true,
});
bookSchema.statics.updateAvailability = function (bookId) {
    return __awaiter(this, void 0, void 0, function* () {
        const book = yield this.findById(bookId);
        if (book && book.copies === 0) {
            book.available = false;
            yield book.save();
        }
    });
};
exports.Book = (0, mongoose_1.model)('Book', bookSchema);
