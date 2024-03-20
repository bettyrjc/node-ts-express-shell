import { MongoDatabase } from "../mongo/mongo-database";
import { envs } from "../../config";
import { userModel } from "../mongo/models/user.model";
import { categoryModel } from "../mongo/models/category.model";
import { productModel } from "../mongo/models/product.model";
import { seedData } from "./data";

(async () => {
  MongoDatabase.connect({
    dbName: envs.MONGO_DB_NAME,
    mongoUrl: envs.MONGO_URL,
  });
  await main();

  MongoDatabase.disconnect();
})();
const randomBetween = (x: number) => {
  return Math.floor(Math.random() * x);
};
async function main() {
  //? borrar todo
  await Promise.all([
    userModel.deleteMany(),
    categoryModel.deleteMany(),
    productModel.deleteMany(),
  ]);
  //? crear usuarios
  const users = await userModel.insertMany(seedData.users);
  //? crear categorias
  const categories = await categoryModel.insertMany(
    seedData.categories.map((category) => {
      return {
        ...category,
        user: users[randomBetween(seedData.users.length - 1)]._id,
      };
    })
  );

  //? crear productos
  await productModel.insertMany(
    seedData.products.map((product) => {
      return {
        ...product,
        user: users[randomBetween(seedData.users.length - 1)]._id,
        category: categories[randomBetween(seedData.categories.length - 1)]._id,
      };
    })
  );
}
