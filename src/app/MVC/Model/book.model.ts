import  { model, Model, Schema } from "mongoose";
import { genreList, IBook } from "../Interface/book.interface";

const bookSchema = new Schema<IBook>({
    title:{type:String, required:true, trim:true},
    author:{type:String, required:true, trim:true},
    genre:{
        type:String,
        enum:genreList,
        required:true,
        trim:true
    },
    isbn:{type:String, required:true, trim:true},
    description:{type:String, required:false, trim:true},
    copies:{type:Number, required:true},
    available:{type:Boolean, required:false, default:true}

},
{
    versionKey:false,
    timestamps:true,
}
);



bookSchema.statics.updateAvailability = async function (bookId: string) {
  const book = await this.findById(bookId);
  if (book && book.copies === 0) {
    book.available = false;
    await book.save();
  }
};


interface BookModel extends Model<IBook> {
  updateAvailability(bookId: string): Promise<void>;
}

export const Book = model<IBook, BookModel>('Book', bookSchema);
