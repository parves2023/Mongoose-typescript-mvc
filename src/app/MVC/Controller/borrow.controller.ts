import z from "zod";
import express from "express";
import { Borrow } from "../Model/borrow.model";
import { Book } from "../Model/book.model";

export const borrowRoutes = express.Router();

const borrowZodSchema = z.object({
  book: z.string({ required_error: "Book ID is required" }),
  quantity: z
    .number({ required_error: "Quantity is required" })
    .int()
    .positive("Quantity must be a positive integer"),
  dueDate: z.string({ required_error: "Due date is required" }),
});

borrowRoutes.post("/", async (req, res) => {
  try {
    const {
      book: bookId,
      quantity,
      dueDate,
    } = await borrowZodSchema.parseAsync(req.body);
    const book = await Book.findById(bookId);

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

    await book.save();

    // create a borrows books
    const postBorrowData = await Borrow.create({
      book: bookId,
      quantity,
      dueDate,
    });

    res.status(201).json({
      sucess: true,
      message: "Book borrowed successfully",
      data: postBorrowData,
    });
  } catch (error) {
    res.status(400).json({
      sucess: false,
      messgae: `Error message is ${error}`,
    });
  }
});

borrowRoutes.get("/", async (req, res) => {
  try {
    const summary = await Borrow.aggregate([
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
      { $unwind: "$book" },

      //   process 3

      {
        $project: {
          _id: 0,
          book: {
            title: "$book.title",
            isbn: "$book.isbn",
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
  } catch (error) {
    console.log("ERROR:", error);
  }
});



// borrowRoutes.get("/all-borrow", async (req, res) => {
//   try {
//     const borrowBooks = await Borrow.aggregate([
//       {
//         $lookup: {
//           from: "books",
//           localField: "book",
//           foreignField: "_id",
//           as: "book"
//         }
//       },
//       {
//         $unwind: "$book"
//       },
//       {
//         $project: {
//           _id: 1,
//           quantity: 1,
//           book: {
//             title: "$book.title",
//             isbn: "$book.isbn",
//             genre: "$book.genre"
//           }
//         }
//       }
//     ]);

//     res.json({
//       success: true,
//       message: "Got borrow books successfully",
//       data: borrowBooks
//     });
//   } catch (error: any) {
//     console.error("Error fetching borrow books:", error);
//     res.status(500).json({
//       success: false,
//       message: "Something went wrong",
//       error: error?.message || error,
//     });
//   }
// });

