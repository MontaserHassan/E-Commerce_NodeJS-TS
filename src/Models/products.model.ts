import { model, Schema, Document } from 'mongoose';


interface ProductModel extends Document {
    name: string;
    categoryId: any;
    description: string
    price: number;
    stock: number;
    color: string;
    photos: string;
};


const productSchema = new Schema<ProductModel>(
    {
        name: {
            type: String,
            required: true,
        },
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: 'category',
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        stock: {
            type: Number,
            required: true,
        },
        color: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true
    }
);

const Product = model<ProductModel>('Product', productSchema);

export default Product;