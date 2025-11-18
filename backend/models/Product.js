import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['cakes', 'pastries', 'breads', 'cookies', 'desserts']
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    available: {
        type: Boolean,
        default: true
    },
    ingredients: {
        type: [String],
        default: []
    }
}, {
    timestamps: true
});

export default mongoose.model('Product', productSchema);