import { Types } from "mongoose";


export interface IBorrow {
    book:Types.ObjectId,
    quantity:number,
    dueDate:Date,
}


// const borrow = {
//     "book" : "68697f2f83b32f7a4b7b7e7a",
//     "quantity": 2,
//     "dueDate": "2025-07-15"
// }