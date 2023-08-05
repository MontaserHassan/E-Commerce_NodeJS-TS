import { model, Schema, Document } from 'mongoose';


interface CategoryModel extends Document {
    name: string;
};


const categorySchema = new Schema<CategoryModel>(
    {
        name: {
            type: String,
            required: true,
            minLength: 3,
            unique: true
        },
    },
    {
        timestamps: true,
    }
);

const Category = model<CategoryModel>('Category', categorySchema);

export default Category;