import z from "zod";
import express, { Request, Response } from "express";

import { Book } from "../Model/book.model";
import { error } from "console";
export const bookRoutes = express.Router();

export const createBookSchema = z.object({
  title: z.string({ required_error: "Title is required" }).optional(),
  author: z.string({ required_error: "Author is required" }).optional(),
  genre: z
    .enum(
      ["FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY"],
      {
        required_error: "Genre is required",
        invalid_type_error: "Invalid genre",
      }
    )
    .optional(),
  isbn: z.string({ required_error: "ISBN is required" }).optional(),
  description: z.string().optional(),
  copies: z
    .number({ required_error: "Copies are required" })
    .min(0, "Copies must be a non-negative integer")
    .optional(),
  available: z.boolean().optional(),
});

// Zod Catch Error Handling

//  Create Post On the server
bookRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const zodBody = await createBookSchema.parseAsync(req.body);
    console.log(zodBody, "iszod");
    const book = await Book.create(zodBody);
    await book.save();
    console.log(book);

    res.status(201).json({
      sucess: true,
      message: "Book created successfully",
      data: book,
    });
  } catch (error: any) {
    if (error.name === "zodError") {
      return error;
    }

    res.status(401).json({
      sucess: false,
      message: "Somethings is Wrongs",
      error: error,
    });
  }
});

//  Get All Book
// GET /api/books?filter=FICTION&sortBy=title&sort=asc&page=2&limit=12
bookRoutes.get("/", async (req: Request, res: Response) => {
  try {
    // ── query params ────────────────────────────────────────────────
    const filter = req.query.filter as string | undefined; // e.g. "FICTION"
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const sortOrder = (req.query.sort as string) === "desc" ? -1 : 1;
    const limit = Number(req.query.limit) || 10; // items per page
    const page = Math.max(Number(req.query.page) || 1, 1); // page starts at 1
    const skip = (page - 1) * limit; // docs to skip

    // ── build query ────────────────────────────────────────────────
    const query: Record<string, unknown> = {};
    if (filter) query.genre = filter; // simple genre filter

    // ── execute in parallel ────────────────────────────────────────
    const [books, total] = await Promise.all([
      Book.find(query)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit),
      Book.countDocuments(query),
    ]);

    // ── response ───────────────────────────────────────────────────
    res.json({
      success: true,
      message: "Books retrieved successfully",
      data: books,
      meta: {
        total, // total documents matching query
        page, // current page
        limit, // docs per page
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get books",
      error,
    });
  }
});

// get specifics book by id
bookRoutes.get("/:bookId", async (req: Request, res: Response) => {
  try {
    const id = req.params.bookId;

    const book = await Book.findById({ _id: id });

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
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to get book", error });
  }
});

// update a book
bookRoutes.put("/:bookId", async (req: Request, res: Response) => {
  try {
    const id = req.params.bookId;
    const body = await createBookSchema.parseAsync(req.body);

    const updatedDoc = await Book.findByIdAndUpdate(id, body, {
      upsert: true,
      new: true,
    });

    res.status(200).json({
      sucess: true,
      message: "Book updated successfully",
      data: updatedDoc,
    });

    if (!updatedDoc) {
      res.status(401).json({
        sucess: false,
        message: "NO DATA FOUND",
        error: null,
      });
    }
  } catch (error) {
    console.log("Somethings Type is Error", error);
  }
});

// book Delete Opearations
bookRoutes.delete("/:bookId", async (req, res) => {
  try {
    const id = req.params.bookId;
    console.log("Deleting book with ID:", id);

    const deleteBook = await Book.findOneAndDelete({ _id: id });

    res.status(200).json({
      sucess: true,
      message: "Book deleted successfully",
      data: null,
    });

    if (!deleteBook) {
      res.status(404).json({
        sucess: false,
        message: "Deleted Failed",
        error,
      });
    }
  } catch (error) {
    console.log("ERROR", error);
  }
});
