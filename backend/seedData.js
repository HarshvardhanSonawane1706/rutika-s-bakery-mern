import Product from './models/Product.js';

export const seedProducts = async () => {
    try {
        console.log('🌱 Starting product seeding...');
        
        // Check if products already exist
        const count = await Product.countDocuments();
        console.log(`📊 Current product count: ${count}`);
        
        if (count > 0) {
            console.log(`✓ Products already exist (${count} found). Skipping seed.`);
            return;
        }

        const products = [
            {
                name: 'Blueberry Muffins',
                description: 'Fresh blueberry muffins with a tender crumb and burst of juicy blueberries',
                category: 'Pastries',
                price: 4.99,
                image: 'fruit-tart.jpg',
                weight: '100g',
                available: true,
                contains: ['Wheat', 'Eggs', 'Milk', 'Blueberries'],
                ingredients: ['Flour', 'Sugar', 'Eggs', 'Milk', 'Blueberries', 'Baking Powder', 'Vanilla']
            },
            {
                name: 'Bagel',
                description: 'Chewy classic New York-style bagel, perfect for breakfast',
                category: 'Breads',
                price: 3.49,
                image: 'sourdough.jpg',
                weight: '120g',
                available: true,
                contains: ['Wheat', 'Sesame Seeds'],
                ingredients: ['Flour', 'Water', 'Salt', 'Yeast', 'Sesame Seeds']
            },
            {
                name: 'Oatmeal Raisin Cookies',
                description: 'Wholesome oatmeal cookies loaded with plump raisins',
                category: 'Cookies',
                price: 5.99,
                image: 'chocolate-chip.jpg',
                weight: '250g (6 cookies)',
                available: true,
                contains: ['Wheat', 'Eggs', 'Milk', 'Oats', 'Raisins'],
                ingredients: ['Oats', 'Flour', 'Butter', 'Sugar', 'Eggs', 'Raisins', 'Vanilla', 'Baking Soda']
            },
            {
                name: 'Tiramisu',
                description: 'Classic Italian dessert with layers of mascarpone cream and coffee',
                category: 'Desserts',
                price: 8.99,
                image: 'tiramisu.jpg',
                weight: '200g',
                available: true,
                contains: ['Eggs', 'Milk', 'Coffee', 'Cocoa'],
                ingredients: ['Mascarpone', 'Eggs', 'Sugar', 'Ladyfingers', 'Coffee', 'Cocoa Powder']
            },
            {
                name: 'Vanilla Cupcake',
                description: 'Light and fluffy vanilla cupcake with creamy frosting',
                category: 'Cakes',
                price: 3.99,
                image: 'cake.jpg',
                weight: '85g',
                available: true,
                contains: ['Wheat', 'Eggs', 'Milk'],
                ingredients: ['Flour', 'Sugar', 'Eggs', 'Milk', 'Butter', 'Vanilla', 'Baking Powder']
            },
            {
                name: 'Macarons',
                description: 'Colorful French almond meringue cookies with smooth shells',
                category: 'Pastries',
                price: 12.99,
                image: 'macarons.jpg',
                weight: '150g (6 pieces)',
                available: true,
                contains: ['Almonds', 'Eggs'],
                ingredients: ['Almond Flour', 'Egg Whites', 'Sugar', 'Food Coloring', 'Powdered Sugar']
            },
            {
                name: 'Chocolate Chip Cookies',
                description: 'Classic soft cookies packed with chocolate chips',
                category: 'Cookies',
                price: 4.49,
                image: 'chocolate-chip.jpg',
                weight: '300g (12 cookies)',
                available: true,
                contains: ['Wheat', 'Eggs', 'Milk', 'Chocolate'],
                ingredients: ['Flour', 'Butter', 'Sugar', 'Eggs', 'Vanilla', 'Chocolate Chips', 'Baking Soda']
            },
            {
                name: 'Whole Wheat Bread',
                description: 'Nutritious whole wheat loaf with a rustic crust',
                category: 'Breads',
                price: 6.49,
                image: 'whole-wheat.jpg',
                weight: '400g',
                available: true,
                contains: ['Wheat'],
                ingredients: ['Whole Wheat Flour', 'Water', 'Yeast', 'Salt', 'Honey']
            },
            {
                name: 'Sourdough Bread',
                description: 'Tangy artisan sourdough with a crispy crust and airy crumb',
                category: 'Breads',
                price: 7.99,
                image: 'sourdough.jpg',
                weight: '450g',
                available: true,
                contains: ['Wheat'],
                ingredients: ['Flour', 'Water', 'Salt', 'Sourdough Starter']
            },
            {
                name: 'Croissant',
                description: 'Buttery French croissant with crispy, flaky layers',
                category: 'Pastries',
                price: 4.99,
                image: 'croissant.jpg',
                weight: '80g',
                available: true,
                contains: ['Wheat', 'Milk', 'Eggs'],
                ingredients: ['Flour', 'Butter', 'Water', 'Salt', 'Yeast', 'Sugar']
            },
            {
                name: 'Fruit Tart',
                description: 'Elegant tart with creamy custard and fresh seasonal fruits',
                category: 'Desserts',
                price: 9.99,
                image: 'fruit-tart.jpg',
                weight: '200g',
                available: true,
                contains: ['Wheat', 'Eggs', 'Milk', 'Fruits'],
                ingredients: ['Tart Shell', 'Custard Cream', 'Fresh Fruits', 'Apricot Glaze']
            },
            {
                name: 'Red Velvet Cake',
                description: 'Rich red velvet cake with cream cheese frosting',
                category: 'Cakes',
                price: 10.99,
                image: 'red-velvet.jpg',
                weight: '300g',
                available: true,
                contains: ['Wheat', 'Eggs', 'Milk', 'Cocoa'],
                ingredients: ['Flour', 'Cocoa Powder', 'Eggs', 'Milk', 'Red Food Coloring', 'Cream Cheese']
            },
            {
                name: 'Chocolate Cake',
                description: 'Decadent dark chocolate cake with rich chocolate frosting',
                category: 'Cakes',
                price: 9.99,
                image: 'chocolate-cake.jpg',
                weight: '250g',
                available: true,
                contains: ['Wheat', 'Eggs', 'Milk', 'Chocolate'],
                ingredients: ['Flour', 'Cocoa Powder', 'Sugar', 'Eggs', 'Milk', 'Chocolate', 'Butter']
            }
        ];

        await Product.insertMany(products);
        console.log(`✅ Successfully seeded ${products.length} products to MongoDB`);
    } catch (error) {
        console.error('❌ Error seeding products:', error.message);
        console.error('Stack:', error.stack);
    }
};
