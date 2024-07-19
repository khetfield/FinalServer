const { client, getAllUsers } = require("./index");

async function dropTables() {
  try {
    console.log("Starting to drop tables...");

    await client.query(`
        DROP TABLE IF EXISTS cart;
        DROP TABLE IF EXISTS orders;
        DROP TABLE IF EXISTS products;
        DROP TABLE IF EXISTS users;
        DROP TABLE IF EXISTS orders;
      `);

    console.log("Finished dropping tables!");
  } catch (error) {
    console.error("Error dropping tables!");
    throw error;
  }
}

async function createTables() {
  try {
    console.log("Starting to build tables...");

    await client.query(`
        CREATE TABLE "products" (
        "id" SERIAL NOT NULL,
        "price" numeric NOT NULL,
        "description" text NOT NULL,
        "name" text NOT NULL,
        "categories" text NOT NULL,
        "image_url" varchar NOT NULL,
        "availability" bool NOT NULL DEFAULT true,
        "nutrition_facts" varchar NOT NULL,
        PRIMARY KEY ("id")
        );

       CREATE TABLE "users" (
        "id" SERIAL NOT NULL,
        "username" text NOT NULL,
        "password" text NOT NULL,
        "email" text NOT NULL,
        "phone_number" text NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "is_admin" bool NOT NULL DEFAULT false,
        PRIMARY KEY ("id")
        );

        CREATE TABLE "cart" (
        "id" SERIAL NOT NULL,
        "product_id" int4 NOT NULL,
        "customer_id" int4 NOT NULL,
        "quantity" int4 NOT NULL DEFAULT 1,
        PRIMARY KEY ("id")
        );

         CREATE TABLE "orders" (
        "id" SERIAL NOT NULL,
        "product_id" int4 NOT NULL,
        "customer_id" int4 NOT NULL,
        "ordered_at" timestamptz NOT NULL DEFAULT now(),
        "quantity" int4 NOT NULL DEFAULT 1,
        "price" numeric NOT NULL,
        PRIMARY KEY ("id")
        );
      `);

    console.log("Finished building tables!");
  } catch (error) {
    console.error("Error building tables!");
    throw error;
  }
}

async function createInitialUsers() {
  try {
    console.log("Starting to create users...");

    await client.query(`
        CREATE UNIQUE INDEX users_username_idx ON users USING btree (username);
        CREATE UNIQUE INDEX users_email_idx ON users USING btree (email);

        INSERT INTO "users" ("username", "password", "email", "phone_number", "is_admin") VALUES
        ('admin', '$2a$12$DDAlVqFpMuuqN9xOPGUgG.bAfA6.uzb2ekx9IqiMmp/6EjC.1R7eW', 'admin@gmail.com', '555-555-5555', 't');
        `);
    console.log("Finished creating users!");
  } catch (error) {
    console.error("Error creating users!");
    throw error;
  }
}
async function createInitialProducts() {
  try {
    console.log("Starting to create products...");

    await client.query(`
      INSERT INTO "products" ("price", "description", "name", "categories", "image_url", "availability", "nutrition_facts") VALUES
      (1.99, 'Fruit', 'Bananas', 'Produce', 'https://media.npr.org/assets/img/2011/08/19/istock_000017061174small_wide-a68a0b8f0b250cba6f5964ce5807de10d93dd4b9.jpg?s=1400&c=100&f=jpeg', 't', 'https://www.melissas.com/cdn/shop/products/image-of-organic-bananas-organics-27999845154860_327x568.jpg?v=1626729677'),
      (4.99, 'Fruit', 'Blueberries', 'Produce', 'https://media.healthyfood.com/wp-content/uploads/2017/03/Why_we_like_blueberries.jpg', 'f', ''),
      (1.29, 'Fruit', 'Lemon', 'Produce', 'https://media.istockphoto.com/id/1389128157/photo/lemon-fruit-with-leaf-isolated-whole-lemon-and-a-half-with-leaves-on-white-background-lemons.jpg?s=612x612&w=0&k=20&c=Gjyv0Yd0gMG4JZ5iE9e864ilZrurflx1gU6cKHn4E2s=', 't', 'https://www.melissas.com/cdn/shop/products/image-of-organic-meyer-lemons-fruit-28657802313772_326x545.jpg?v=1628088878'),
      (3.89, 'Fruit', 'Strawberries', 'Produce', 'https://i5.walmartimages.com/asr/373f0c0a-d976-4518-967c-9e8c626d1a10.fd992b4534c99ffa7bba91525be393cb.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF', 't', 'https://www.naturipefarms.com/wp-content/themes/naturipe/assets/img/strawberries/strawberries-nutrition-facts-2020.svg'),
      (.99, 'Fruit', 'Orange', 'Produce', 'https://t3.ftcdn.net/jpg/00/56/01/00/360_F_56010077_UA98ADMw95rEB2hCuAlFOJkjdirrAAPV.jpg', 't', ''),
      (.79, 'Fruit', 'Apple', 'Produce', 'https://doorstepproduce.com/cdn/shop/products/6000200094512.jpg?v=1601387354', 'f', 'https://www.melissas.com/cdn/shop/products/5-pounds-image-of-organic-fuji-apples-fruit-28658480840748_326x568.jpg?v=1628019593'),
      (3.49, 'Vegetable', 'Carrots', 'Produce', 'https://static.vecteezy.com/system/resources/previews/003/040/897/large_2x/baby-carrots-on-white-background-free-photo.jpg', 'f', 'https://www.melissas.com/cdn/shop/products/image-of-sweet-baby-carrots-vegetables-28143527002156_395x700.jpg?v=1619575781'),
      (1.39, 'Vegetable', 'Onion', 'Produce', 'https://toriavey.com/images/2013/05/All-About-Onions-on-TheShiksa.com-history-cooking-tutorial.jpg', 't', 'https://www.melissas.com/cdn/shop/products/image-of-organic-red-onions-28037182750764_321x540.jpg?v=1628016709'),
      (2.49, 'Vegetable', 'Lettuce', 'Produce', 'https://m.media-amazon.com/images/I/41YWkRn8wPL._AC_UF894,1000_QL80_.jpg', 't', ''),
      (2.99, 'Vegetable', 'Broccoli', 'Produce', 'https://cdn.britannica.com/25/78225-050-1781F6B7/broccoli-florets.jpg', 't', 'https://healthyholic.com/cdn/shop/files/Broccoli_-_Nutrition_Label.jpg?v=1644962426'),
      (4.49, 'Vegetable', 'Brussel Sprouts', 'Produce', 'https://www.shutterstock.com/image-photo/fresh-organic-brussels-sprouts-isolated-600nw-1916031610.jpg', 't', ''),
      (3.79, 'Vegetable', 'Asparagus', 'Produce', 'https://st2.depositphotos.com/1821481/12114/i/950/depositphotos_121148472-stock-photo-asparagus-on-white-background.jpg', 't', ''),
      (3.19, 'Bakery', 'White Bread', 'Bakery', 'https://img.freepik.com/premium-photo/slice-bread-white-background-isolated-with-clipping-path_41722-1877.jpg', 'f', ''),
      (2.99, 'Bakery', 'Wheat Bread', 'Bakery', 'https://static.vecteezy.com/system/resources/previews/002/463/399/large_2x/slice-whole-wheat-bread-isolated-on-white-background-free-photo.jpg', 't', ''),
      (7.99, 'Bakery', 'Dinner Rolls', 'Bakery', 'https://t3.ftcdn.net/jpg/00/18/88/72/360_F_18887298_OJ6zDZTbL9ji1vmftLJS2hX3FEZFcnjq.jpg', 't', ''),
      (5.79, 'Bakery', 'Croissants', 'Bakery', 'https://static.vecteezy.com/system/resources/previews/008/245/353/large_2x/2-croissants-isolated-on-a-white-background-breakfast-snacks-or-bakery-free-photo.jpg', 't', ''),
      (2.69, 'Dairy', 'Milk', 'Dairy', 'https://i5.walmartimages.com/seo/Great-Value-Milk-Whole-Vitamin-D-Gallon-Plastic-Jug_6a7b09b4-f51d-4bea-a01c-85767f1b481a.86876244397d83ce6cdedb030abe6e4a.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF', 't', ''),
      (1.39, 'Dairy', 'Yogurt', 'Dairy', 'https://bjs.scene7.com/is/image/bjs/91215?$bjs-Zoom$', 't', ''),
      (3.99, 'Dairy', 'Sliced Cheese', 'Dairy', 'https://media01.stockfood.com/largepreviews/MjEwMTgwNjI=/00678002-A-Slice-of-Yellow-American-Cheese-on-a-White-Background.jpg', 't', ''),
      (3.49, 'Dairy', 'Whipped Cream', 'Dairy', 'https://i5.walmartimages.com/seo/Reddi-wip-Original-Whipped-Topping-Made-with-Real-Cream-6-5-oz-Spray-Can_a728ee00-81d5-4c4c-8d97-6e40a5f13e27.2c5b32cf725c3512d3bd25a96a27e862.jpeg', 't', ''),
      (2.89, 'Dairy', 'Butter', 'Dairy', 'https://www.allrecipes.com/thmb/YEHvUygNdvsUwzKttGh314d9n1M=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/sticks-of-butter-photo-by-twoellis-GettyImages-149134517-resized-3911123142a141eca2340a4bb63e0869.jpg', 'f', '')
    `);

    console.log("Finished creating products!");
  } catch (error) {
    console.error("Error creating products!", error);
    throw error;
  }
}
async function createInitialCartItems() {
  try {
    console.log("Starting to create cart items...");
    const initialCartItems = [];

    if (initialCartItems.length > 0) {
      const values = initialCartItems
        .map(({ product_id, customer_id, quantity }) => 
          `(${product_id}, ${customer_id}, ${quantity})`
        )
        .join(", ");

      await client.query(`
        INSERT INTO "cart" ("product_id", "customer_id", "quantity") VALUES
        ${values}
      `);
    }
    console.log("Finished creating cart items!");
  } catch (error) {
    console.log("Error creating cart items!");
    throw error;
  }
}

async function createInitialOrderedItems() {
  try {
    console.log("Starting to create ordered items...");
    const initialOrderedItems = [];

    if (initialOrderedItems.length > 0) {
      const values = initialOrderedItems
        .map(({ product_id, customer_id, quantity, price }) => 
          `(${product_id}, ${customer_id}, ${quantity}, ${price})`
        )
        .join(", ");

      await client.query(`
        INSERT INTO "orders" ("product_id", "customer_id", "quantity", "price") VALUES
        ${values}
      `);
    }
    console.log("Finished creating ordered items!");
  } catch (error) {
    console.log("Error creating ordered items!");
    throw error;
  }
}


async function rebuildDB() {
  try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialCartItems();
    await createInitialProducts();
    await createInitialOrderedItems();
  } catch (error) {
    console.log("Error during rebuildDB");
    throw error;
  }
}

async function testDB() {
  try {
    console.log("Starting to test database...");

    console.log("Calling getAllUsers");
    const users = await getAllUsers();
    console.log("Result:", users);

    console.log("Finished database tests!");
  } catch (error) {
    console.log("Error during testDB");
    throw error;
  }
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
