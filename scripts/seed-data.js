// Script to seed MongoDB with sample data
db = db.getSiblingDB('hypesoft');

// Clear existing data
db.categories.deleteMany({});
db.products.deleteMany({});

// Insert sample categories
const categories = [
  {
    _id: ObjectId(),
    name: "Electronics",
    description: "Electronic devices and accessories",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "system",
    updatedBy: "system"
  },
  {
    _id: ObjectId(),
    name: "Clothing",
    description: "Apparel and fashion items",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "system",
    updatedBy: "system"
  },
  {
    _id: ObjectId(),
    name: "Books",
    description: "Books and educational materials",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "system",
    updatedBy: "system"
  }
];

const insertedCategories = db.categories.insertMany(categories);
const categoryIds = Object.values(insertedCategories.insertedIds);

// Insert sample products
const products = [
  {
    _id: ObjectId(),
    name: "Smartphone",
    description: "Latest generation smartphone with advanced features",
    price: 699.99,
    categoryId: categoryIds[0].toString(),

    stockQuantity: 50,
    minimumStock: 10,
    isActive: true,
    sku: "SMART-001",
    barcode: "1234567890123",
    weight: 0.2,
    dimensions: {
      length: 15.0,
      width: 7.5,
      height: 0.8,
      unit: "cm"
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "system",
    updatedBy: "system"
  },
  {
    _id: ObjectId(),
    name: "Laptop",
    description: "High-performance laptop for professionals",
    price: 1299.99,
    categoryId: categoryIds[0].toString(),

    stockQuantity: 25,
    minimumStock: 5,
    isActive: true,
    sku: "LAPTOP-001",
    barcode: "1234567890124",
    weight: 2.1,
    dimensions: {
      length: 35.0,
      width: 24.0,
      height: 2.0,
      unit: "cm"
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "system",
    updatedBy: "system"
  },
  {
    _id: ObjectId(),
    name: "T-Shirt",
    description: "Comfortable cotton t-shirt",
    price: 19.99,
    categoryId: categoryIds[1].toString(),

    stockQuantity: 100,
    minimumStock: 20,
    isActive: true,
    sku: "TSHIRT-001",
    barcode: "1234567890125",
    weight: 0.15,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "system",
    updatedBy: "system"
  },
  {
    _id: ObjectId(),
    name: "Programming Book",
    description: "Complete guide to modern programming",
    price: 49.99,
    categoryId: categoryIds[2].toString(),

    stockQuantity: 5, // Low stock for testing
    minimumStock: 10,
    isActive: true,
    sku: "BOOK-001",
    barcode: "1234567890126",
    weight: 0.8,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "system",
    updatedBy: "system"
  },
  {
    _id: ObjectId(),
    name: "Headphones",
    description: "Wireless noise-cancelling headphones",
    price: 199.99,
    categoryId: categoryIds[0].toString(),

    stockQuantity: 3, // Low stock for testing
    minimumStock: 8,
    isActive: true,
    sku: "HEADPHONES-001",
    barcode: "1234567890127",
    weight: 0.3,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "system",
    updatedBy: "system"
  }
];

db.products.insertMany(products);

print("Sample data inserted successfully!");
print("Categories:", db.categories.countDocuments());
print("Products:", db.products.countDocuments());
