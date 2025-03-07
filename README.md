# Typescript REST API Serverless

This project was developed as part of the Code Challenge for Serverless Guru and serves as a base template for building a **TypeScript REST API** using Serverless Framework and DynamoDB. It provides a well-structured, scalable, and maintainable foundation for developing serverless applications.

### Food delivery example

The API is structured around a food delivery system, serving as a practical example to demonstrate best practices in serverless development, including:

- Dynamoose ORM for DynamoDB integration;
- Zod for request validation;
- Automated testing with Jest;
- CI/CD pipelines using GitHub Actions.

## Technologies used

- **Node.js 18.x** (Managed via `.nvmrc`)
- **TypeScript**
- **AWS Lambda**
- **AWS API Gateway**
- **DynamoDB + Dynamoose ORM**
- **Serverless Framework** (^3.40.0)
- **GitHub Actions** (CI/CD)
- **Jest** (Unit Testing)
- **Zod** (Data Validation)

---

## Project structure

The project follows a **clean architecture** approach, incorporating principles of **hexagonal architecture** to ensure modularity, scalability, and maintainability. Each layer has a well-defined responsibility:

```
src/
│── shared/                       # Shared code between Use Cases
│   ├── api-gateway-response.ts   # Helpers for HTTP responses
│   ├── interfaces/               # Common project interfaces
│   ├── models/                   # Dynamoose models (Order, etc.)
│   ├── repositories/             # Database access repositories
│── use-cases/                    # Business logic (Use Cases)
│   ├── create-order/
|       ├── controller.ts         # Entry point for external communication
|       ├── usecase.ts            # Business logic
|       ├── usecase.spec.ts       # Unit test
|       ├── validator.ts          # Zod Schema and type
│   ├── get-order/
│   ├── update-order-status/
│   ├── delete-order/
serverless.yml                    # Serverless Framework configuration
jest.config.js                    # Jest configuration
.nvmrc                            # Node.js version management
```

---

## How to run the project

### **1️. Set up environment**

1. **Install Node.js 18.x** (Recommended via `nvm`)

   ```sh
   nvm use
   ```

   If you don’t have **nvm**, install the correct Node version manually.

2. **Install dependencies**
   ```sh
   pnpm install
   ```
   You can use `npm` or `yarn`.

---

### **2️. Configure AWS credentials**

The project uses **AWS IAM Role** for deployment and execution. Before running locally, set up your credentials by creating a `.env` file in the project root:

```sh
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

Alternatively, you can set them manually in your terminal:

```sh
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
```

For production environments, credentials are configured via **GitHub Secrets**.

---

### **3️. Run locally**

To run the local environment with **Serverless Offline**:

```sh
pnpm start
```

This will expose the API locally on port **3000**.

For faster development and testing, use the following command:

```sh
pnpm dev
```

This runs the project with nodemon, automatically reloading the application whenever a file is modified, improving the development workflow.

---

### **4️. Run tests**

The project uses Jest for unit testing, and all use-cases are covered **100%**. To run the tests:

```sh
pnpm test
```

To run tests in watch mode (rerun tests automatically on file changes):

```sh
pnpm test:watch
```

To generate a test coverage report:

```sh
pnpm test:coverage
```

Tests are required before **deployment to AWS** (validated via GitHub Actions).

---

## Available endpoints

| Method | Endpoint                 | Description             |
| ------ | ------------------------ | ----------------------- |
| POST   | `/orders`                | Create a new order      |
| GET    | `/orders/{orderId}`      | Retrieve an order by ID |
| GET    | `/users/{userId}/orders` | Retrieve orders by user |
| PUT    | `/orders/{orderId}`      | Update order status     |
| DELETE | `/orders/{orderId}`      | Delete an order by ID   |

For convenience, a Postman collection is available in the repository:

📂 File: **RESTful API.postman_collection.json**

---

## **Data validation (Zod)**

The project uses Zod for input validation, ensuring that all API requests conform to the expected structure:

- Required fields are filled
- `status` contains valid values (`RECEIVED`, `DELIVERED`, etc.)
- `products` contains at least one item

**Example validation**

```ts
const orderValidatorSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  products: z
    .array(
      z.object({
        productId: z.string().min(1, 'Product ID is required'),
        quantity: z.number().int().positive(),
        price: z.number().positive(),
      }),
    )
    .min(1, 'At least one item is required'),
  status: z.enum([
    'RECEIVED',
    'IN_PREPARATION',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED',
  ]),
});
```

**Automatic type inference**
Zod automatically exports TypeScript types based on the defined schema, eliminating the need for redundant manual typings.

Example of type inference from a validation schema:

```ts
export type CreateOrderValidatedDTO = z.infer<
  typeof createOrderValidatorSchema
>;
```

**Usage Example**
Instead of manually defining an interface for the validated data, we can directly use the inferred type:

```ts
const validation = createOrderValidatorSchema.safeParse(body);

if (!validation.success) {
  return badRequest(validation.error.format());
}

const bodyParsed: CreateOrderValidatedDTO = validation.data;
```

---

## **Database - DynamoDB + Dynamoose**

### Local database

For local development and testing, you can run a local DynamoDB instance using Docker. This allows you to test database operations without deploying to AWS.

To start the local DynamoDB instance, run:

```sh
docker-compose up
```

Then, set the stage to local when starting the application:

```sh
pnpm local
```

This ensures that the application connects to the local database instead of the AWS-hosted DynamoDB.

The project uses [Dynamoose](https://dynamoosejs.com/getting_started/Introduction), an ORM library for DynamoDB, to simplify schema definition, validation, and data access.

#### **Create schema**

In DynamoDB, data is schemaless, but Dynamoose enforces a schema to define the expected structure of each record. This ensures data integrity and provides better TypeScript support.

[About Schemas](https://dynamoosejs.com/guide/Schema)

#### **Order Class: extending Item**

[The Order class extends Item](https://dynamoosejs.com/guide/Model#dynamoosemodelitemname-schema-options), which is a Dynamoose requirement to properly map objects to DynamoDB. This allows typed access to attributes and ensures compatibility with the ORM.

```ts
export class Order extends Item {
  orderId: string;
  userId: string;
  products: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  status: string;
  totalPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
}
```

#### Schema Definition

The OrderSchema defines how each field should be stored in DynamoDB:

- `orderId`: Primary Key (hashKey).
- `userId`: Global Secondary Index (userIdIndex) for queries.
- `products`: Nested array with an object schema.
- `timestamps`: Auto-manages createdAt and updatedAt fields.

```ts
const OrderSchema = new dynamoose.Schema({...});
```

#### **Export model**

```ts
export const OrderModel = dynamoose.model<Order>(tableName, OrderSchema);
```

---

## **CI/CD Pipelines (GitHub Actions)**

The application has an **automated workflow** for **testing and deployment** to AWS Lambda.

- ✅ **Tests run before deployment**
- ✅ **Deployment happens only if tests pass**
- ✅ **`dev` and `prod` environments are automatically managed**

---

## **How to deploy to AWS**

The application is integrated with **GitHub Actions**, so deployment happens automatically when pushing to:

- **`dev` → Deploys to development environment**
- **`main` → Deploys to production**

To deploy manually:

```sh
npx sls deploy --stage STAGE_NAME
```

---

## **Best practices followed**

✅ **Use Case based architecture**  
✅ **Data validation with Zod**  
✅ **Scalable NoSQL database (DynamoDB + Dynamoose + Docker)**  
✅ **Mandatory unit tests before deployment**  
✅ **CI/CD with GitHub Actions**  
✅ **Node.js versioning via `.nvmrc`**
