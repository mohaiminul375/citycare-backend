
      import { createRequire } from 'module';
      const require = createRequire(import.meta.url);
    

// src/app.ts
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import httpStatus6 from "http-status";

// src/config/index.ts
import dotenv from "dotenv";
dotenv.config();
var config_default = {
  node_env: "development",
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  frontend_url: process.env.FRONTEND_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  google_client_id: process.env.GOOGLE_CLIENT_ID,
  redis_user: process.env.REDIS_USER,
  redis_password: process.env.REDIS_PASSWORD,
  redis_host: process.env.REDIS_HOST,
  redis_port: process.env.REDIS_PORT,
  bkash_base_url: process.env.BKASH_BASE_URL,
  bkash_username: process.env.BKASH_USERNAME,
  bkash_password: process.env.BKASH_PASSWORD,
  bkash_app_key: process.env.BKASH_APP_KEY,
  bkash_app_secret: process.env.BKASH_APP_SECRET,
  bkash_callback_url: process.env.BKASH_CALLBACK_URL
};

// src/module/auth/auth.route.ts
import { Router } from "express";

// src/module/auth/auth.controller.ts
import httpStatus from "http-status";

// src/utils/catchAsync.ts
var catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// src/utils/sendResponse.ts
var sendResponse = (res, data) => {
  res.status(data.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    data: data.data,
    meta: data.meta
  });
};

// src/module/auth/auth.service.ts
import bcrypt from "bcryptjs";

// generated/prisma/enums.ts
var UserRole = {
  CITIZEN: "CITIZEN",
  ADMIN: "ADMIN",
  CITY_ADMIN: "CITY_ADMIN",
  DEPARTMENT_STAFF: "DEPARTMENT_STAFF"
};
var UserStatus = {
  ACTIVE: "ACTIVE",
  BLOCKED: "BLOCKED"
};
var AuthProvider = {
  GOOGLE: "GOOGLE",
  CREDENTIAL: "CREDENTIAL"
};
var ComplaintStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  WAITING_FOR_STAFF: "WAITING_FOR_STAFF",
  ASSIGNED: "ASSIGNED",
  IN_PROGRESS: "IN_PROGRESS",
  RESOLVED: "RESOLVED",
  REJECTED: "REJECTED"
};
var staffAssignmentStatus = {
  IN_PROGRESS: "IN_PROGRESS",
  RESOLVED: "RESOLVED"
};
var PaymentStatus = {
  PENDING: "PENDING",
  PAID: "PAID",
  FAILED: "FAILED"
};

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.10.0",
  "engineVersion": "0edf323efd1d98336f3f0a68684b56f689b900d3",
  "activeProvider": "postgresql",
  "inlineSchema": 'model Category {\n  id       String @id @default(uuid())\n  category String @unique\n\n  createdAt  DateTime    @default(now())\n  updatedAt  DateTime    @updatedAt\n  complaints Complaint[]\n\n  @@map("categories")\n}\n\nmodel Complaint {\n  id          String   @id @default(uuid())\n  title       String\n  description String\n  images      String[] @default([])\n  address     String\n\n  status        ComplaintStatus @default(PENDING)\n  paymentStatus PaymentStatus   @default(PENDING)\n\n  citizenId  String\n  categoryId String\n  staffId    String?\n\n  adminNote String?\n  amount    Int     @default(100)\n\n  citizen  User     @relation("CitizenComplaints", fields: [citizenId], references: [id])\n  category Category @relation(fields: [categoryId], references: [id])\n  staff    User?    @relation("AssignedComplaints", fields: [staffId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("complaints")\n}\n\nenum UserRole {\n  CITIZEN\n  ADMIN\n  CITY_ADMIN\n  DEPARTMENT_STAFF\n}\n\nenum UserStatus {\n  ACTIVE\n  BLOCKED\n}\n\nenum AuthProvider {\n  GOOGLE\n  CREDENTIAL\n}\n\nenum ComplaintStatus {\n  PENDING\n  APPROVED\n  WAITING_FOR_STAFF\n  ASSIGNED\n  IN_PROGRESS\n  RESOLVED\n  REJECTED\n}\n\nenum staffAssignmentStatus {\n  IN_PROGRESS\n  RESOLVED\n}\n\nenum PaymentStatus {\n  PENDING\n  PAID\n  FAILED\n}\n\nenum Priority {\n  LOW\n  MEDIUM\n  HIGH\n  URGENT\n}\n\nmodel Profile {\n  id String @id @default(uuid(7))\n\n  name          String\n  email         String    @unique\n  contactNumber String?\n  address       String?\n  isDeleted     Boolean   @default(false)\n  deletedAt     DateTime?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n\n  //relations\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  @@index([email], name: "idx_patient_email")\n  @@index([isDeleted], name: "idx_patient_isDeleted")\n  @@map("profile")\n}\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel User {\n  id                 String       @id @default(uuid())\n  name               String\n  email              String\n  password           String?\n  googleId           String?      @unique\n  authProvider       AuthProvider @default(CREDENTIAL)\n  emailVerified      Boolean      @default(false)\n  role               UserRole     @default(CITIZEN)\n  status             UserStatus   @default(ACTIVE)\n  needPasswordChange Boolean      @default(false)\n  createdAt          DateTime     @default(now())\n  updatedAt          DateTime     @updatedAt\n  profile            Profile?\n  citizenComplaints  Complaint[]  @relation("CitizenComplaints")\n  assignedComplaints Complaint[]  @relation("AssignedComplaints")\n\n  @@unique([email])\n  @@map("users")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"category","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"complaints","kind":"object","type":"Complaint","relationName":"CategoryToComplaint"}],"dbName":"categories","schema":null},"Complaint":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"images","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"ComplaintStatus"},{"name":"paymentStatus","kind":"enum","type":"PaymentStatus"},{"name":"citizenId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"staffId","kind":"scalar","type":"String"},{"name":"adminNote","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Int"},{"name":"citizen","kind":"object","type":"User","relationName":"CitizenComplaints"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToComplaint"},{"name":"staff","kind":"object","type":"User","relationName":"AssignedComplaints"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"complaints","schema":null},"Profile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"contactNumber","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"ProfileToUser"}],"dbName":"profile","schema":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"googleId","kind":"scalar","type":"String"},{"name":"authProvider","kind":"enum","type":"AuthProvider"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"role","kind":"enum","type":"UserRole"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"needPasswordChange","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"profile","kind":"object","type":"Profile","relationName":"ProfileToUser"},{"name":"citizenComplaints","kind":"object","type":"Complaint","relationName":"CitizenComplaints"},{"name":"assignedComplaints","kind":"object","type":"Complaint","relationName":"AssignedComplaints"}],"dbName":"users","schema":null}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","profile","citizenComplaints","assignedComplaints","_count","citizen","category","staff","complaints","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","data","Category.createOne","Category.createMany","Category.createManyAndReturn","Category.updateOne","Category.updateMany","Category.updateManyAndReturn","create","update","Category.upsertOne","Category.deleteOne","Category.deleteMany","having","_min","_max","Category.groupBy","Category.aggregate","Complaint.findUnique","Complaint.findUniqueOrThrow","Complaint.findFirst","Complaint.findFirstOrThrow","Complaint.findMany","Complaint.createOne","Complaint.createMany","Complaint.createManyAndReturn","Complaint.updateOne","Complaint.updateMany","Complaint.updateManyAndReturn","Complaint.upsertOne","Complaint.deleteOne","Complaint.deleteMany","_avg","_sum","Complaint.groupBy","Complaint.aggregate","Profile.findUnique","Profile.findUniqueOrThrow","Profile.findFirst","Profile.findFirstOrThrow","Profile.findMany","Profile.createOne","Profile.createMany","Profile.createManyAndReturn","Profile.updateOne","Profile.updateMany","Profile.updateManyAndReturn","Profile.upsertOne","Profile.deleteOne","Profile.deleteMany","Profile.groupBy","Profile.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","AND","OR","NOT","id","name","email","password","googleId","AuthProvider","authProvider","emailVerified","UserRole","role","UserStatus","status","needPasswordChange","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","every","some","none","contactNumber","address","isDeleted","deletedAt","userId","title","description","images","ComplaintStatus","PaymentStatus","paymentStatus","citizenId","categoryId","staffId","adminNote","amount","has","hasEvery","hasSome","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide","push"]'),
  graph: "lAIlQAgJAQAAAAELAACQAQAgVAAApAEAMFUAABEAEFYAAKQBADBXAQAAAAFkQACOAQAhZUAAjgEAIQEAAAABACAUCAAAlwEAIAkAAKkBACAKAACqAQAgVAAApQEAMFUAAAMAEFYAAKUBADBXAQCIAQAhYgAApgF9ImRAAI4BACFlQACOAQAhdQEAiAEAIXkBAIgBACF6AQCIAQAhewAAmQEAIH4AAKcBfiJ_AQCIAQAhgAEBAIgBACGBAQEAiQEAIYIBAQCJAQAhgwECAKgBACEFCAAA6QEAIAkAAP0BACAKAADpAQAggQEAAKsBACCCAQAAqwEAIBQIAACXAQAgCQAAqQEAIAoAAKoBACBUAAClAQAwVQAAAwAQVgAApQEAMFcBAAAAAWIAAKYBfSJkQACOAQAhZUAAjgEAIXUBAIgBACF5AQCIAQAhegEAiAEAIXsAAJkBACB-AACnAX4ifwEAiAEAIYABAQCIAQAhgQEBAIkBACGCAQEAiQEAIYMBAgCoAQAhAwAAAAMAIAEAAAQAMAIAAAUAIA4DAACXAQAgVAAAlQEAMFUAAAcAEFYAAJUBADBXAQCIAQAhWAEAiAEAIVkBAIgBACFkQACOAQAhZUAAjgEAIXQBAIkBACF1AQCJAQAhdiAAiwEAIXdAAJYBACF4AQCIAQAhAQAAAAcAIAMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgAQAAAAMAIAEAAAADACASBAAAjwEAIAUAAJABACAGAACQAQAgVAAAhwEAMFUAAA0AEFYAAIcBADBXAQCIAQAhWAEAiAEAIVkBAIgBACFaAQCJAQAhWwEAiQEAIV0AAIoBXSJeIACLAQAhYAAAjAFgImIAAI0BYiJjIACLAQAhZEAAjgEAIWVAAI4BACEBAAAADQAgAQAAAAMAIAEAAAABACAICQEAiAEAIQsAAJABACBUAACkAQAwVQAAEQAQVgAApAEAMFcBAIgBACFkQACOAQAhZUAAjgEAIQELAADjAQAgAwAAABEAIAEAABIAMAIAAAEAIAMAAAARACABAAASADACAAABACADAAAAEQAgAQAAEgAwAgAAAQAgBQkBAAAAAQsAAPwBACBXAQAAAAFkQAAAAAFlQAAAAAEBEQAAFgAgBAkBAAAAAVcBAAAAAWRAAAAAAWVAAAAAAQERAAAYADABEQAAGAAwBQkBAK8BACELAADyAQAgVwEArwEAIWRAALUBACFlQAC1AQAhAgAAAAEAIBEAABsAIAQJAQCvAQAhVwEArwEAIWRAALUBACFlQAC1AQAhAgAAABEAIBEAAB0AIAIAAAARACARAAAdACADAAAAAQAgGAAAFgAgGQAAGwAgAQAAAAEAIAEAAAARACADBwAA7wEAIB4AAPEBACAfAADwAQAgBwkBAHAAIVQAAKMBADBVAAAkABBWAACjAQAwVwEAcAAhZEAAdgAhZUAAdgAhAwAAABEAIAEAACMAMB0AACQAIAMAAAARACABAAASADACAAABACABAAAABQAgAQAAAAUAIAMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIBEIAADMAQAgCQAAzQEAIAoAANgBACBXAQAAAAFiAAAAfQJkQAAAAAFlQAAAAAF1AQAAAAF5AQAAAAF6AQAAAAF7AADLAQAgfgAAAH4CfwEAAAABgAEBAAAAAYEBAQAAAAGCAQEAAAABgwECAAAAAQERAAAsACAOVwEAAAABYgAAAH0CZEAAAAABZUAAAAABdQEAAAABeQEAAAABegEAAAABewAAywEAIH4AAAB-An8BAAAAAYABAQAAAAGBAQEAAAABggEBAAAAAYMBAgAAAAEBEQAALgAwAREAAC4AMAEAAAANACARCAAAyAEAIAkAAMkBACAKAADWAQAgVwEArwEAIWIAAMQBfSJkQAC1AQAhZUAAtQEAIXUBAK8BACF5AQCvAQAhegEArwEAIXsAAMMBACB-AADFAX4ifwEArwEAIYABAQCvAQAhgQEBALABACGCAQEAsAEAIYMBAgDGAQAhAgAAAAUAIBEAADIAIA5XAQCvAQAhYgAAxAF9ImRAALUBACFlQAC1AQAhdQEArwEAIXkBAK8BACF6AQCvAQAhewAAwwEAIH4AAMUBfiJ_AQCvAQAhgAEBAK8BACGBAQEAsAEAIYIBAQCwAQAhgwECAMYBACECAAAAAwAgEQAANAAgAgAAAAMAIBEAADQAIAEAAAANACADAAAABQAgGAAALAAgGQAAMgAgAQAAAAUAIAEAAAADACAHBwAA6gEAIB4AAO0BACAfAADsAQAgMAAA6wEAIDEAAO4BACCBAQAAqwEAIIIBAACrAQAgEVQAAJgBADBVAAA8ABBWAACYAQAwVwEAcAAhYgAAmgF9ImRAAHYAIWVAAHYAIXUBAHAAIXkBAHAAIXoBAHAAIXsAAJkBACB-AACbAX4ifwEAcAAhgAEBAHAAIYEBAQBxACGCAQEAcQAhgwECAJwBACEDAAAAAwAgAQAAOwAwHQAAPAAgAwAAAAMAIAEAAAQAMAIAAAUAIA4DAACXAQAgVAAAlQEAMFUAAAcAEFYAAJUBADBXAQAAAAFYAQCIAQAhWQEAAAABZEAAjgEAIWVAAI4BACF0AQCJAQAhdQEAiQEAIXYgAIsBACF3QACWAQAheAEAAAABAQAAAD8AIAEAAAA_ACAEAwAA6QEAIHQAAKsBACB1AACrAQAgdwAAqwEAIAMAAAAHACABAABCADACAAA_ACADAAAABwAgAQAAQgAwAgAAPwAgAwAAAAcAIAEAAEIAMAIAAD8AIAsDAADoAQAgVwEAAAABWAEAAAABWQEAAAABZEAAAAABZUAAAAABdAEAAAABdQEAAAABdiAAAAABd0AAAAABeAEAAAABAREAAEYAIApXAQAAAAFYAQAAAAFZAQAAAAFkQAAAAAFlQAAAAAF0AQAAAAF1AQAAAAF2IAAAAAF3QAAAAAF4AQAAAAEBEQAASAAwAREAAEgAMAsDAADnAQAgVwEArwEAIVgBAK8BACFZAQCvAQAhZEAAtQEAIWVAALUBACF0AQCwAQAhdQEAsAEAIXYgALIBACF3QADeAQAheAEArwEAIQIAAAA_ACARAABLACAKVwEArwEAIVgBAK8BACFZAQCvAQAhZEAAtQEAIWVAALUBACF0AQCwAQAhdQEAsAEAIXYgALIBACF3QADeAQAheAEArwEAIQIAAAAHACARAABNACACAAAABwAgEQAATQAgAwAAAD8AIBgAAEYAIBkAAEsAIAEAAAA_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_ACEEZgAAAGACZwAAAGAIaAAAAGAIbQAAfWAiBGYAAABiAmcAAABiCGgAAABiCG0AAHtiIghmQAAAAAFnQAAAAARoQAAAAARpQAAAAAFqQAAAAAFrQAAAAAFsQAAAAAFtQAB5ACEQAwAAlwEAIFQAAJUBADBVAAAHABBWAACVAQAwVwEAiAEAIVgBAIgBACFZAQCIAQAhZEAAjgEAIWVAAI4BACF0AQCJAQAhdQEAiQEAIXYgAIsBACF3QACWAQAheAEAiAEAIYcBAAAHACCIAQAABwAgA3EAAAMAIHIAAAMAIHMAAAMAIA1UAACRAQAwVQAAVAAQVgAAkQEAMFcBAHAAIVgBAHAAIVkBAHAAIWRAAHYAIWVAAHYAIXQBAHEAIXUBAHEAIXYgAHMAIXdAAJIBACF4AQBwACELBwAAgwEAIB4AAJQBACAfAACUAQAgZkAAAAABZ0AAAAAFaEAAAAAFaUAAAAABakAAAAABa0AAAAABbEAAAAABbUAAkwEAIQsHAACDAQAgHgAAlAEAIB8AAJQBACBmQAAAAAFnQAAAAAVoQAAAAAVpQAAAAAFqQAAAAAFrQAAAAAFsQAAAAAFtQACTAQAhCGZAAAAAAWdAAAAABWhAAAAABWlAAAAAAWpAAAAAAWtAAAAAAWxAAAAAAW1AAJQBACEOAwAAlwEAIFQAAJUBADBVAAAHABBWAACVAQAwVwEAiAEAIVgBAIgBACFZAQCIAQAhZEAAjgEAIWVAAI4BACF0AQCJAQAhdQEAiQEAIXYgAIsBACF3QACWAQAheAEAiAEAIQhmQAAAAAFnQAAAAAVoQAAAAAVpQAAAAAFqQAAAAAFrQAAAAAFsQAAAAAFtQACUAQAhFAQAAI8BACAFAACQAQAgBgAAkAEAIFQAAIcBADBVAAANABBWAACHAQAwVwEAiAEAIVgBAIgBACFZAQCIAQAhWgEAiQEAIVsBAIkBACFdAACKAV0iXiAAiwEAIWAAAIwBYCJiAACNAWIiYyAAiwEAIWRAAI4BACFlQACOAQAhhwEAAA0AIIgBAAANACARVAAAmAEAMFUAADwAEFYAAJgBADBXAQBwACFiAACaAX0iZEAAdgAhZUAAdgAhdQEAcAAheQEAcAAhegEAcAAhewAAmQEAIH4AAJsBfiJ_AQBwACGAAQEAcAAhgQEBAHEAIYIBAQBxACGDAQIAnAEAIQRmAQAAAAWEAQEAAAABhQEBAAAABIYBAQAAAAQHBwAAeAAgHgAAogEAIB8AAKIBACBmAAAAfQJnAAAAfQhoAAAAfQhtAAChAX0iBwcAAHgAIB4AAKABACAfAACgAQAgZgAAAH4CZwAAAH4IaAAAAH4IbQAAnwF-Ig0HAAB4ACAeAAB4ACAfAAB4ACAwAACeAQAgMQAAeAAgZgIAAAABZwIAAAAEaAIAAAAEaQIAAAABagIAAAABawIAAAABbAIAAAABbQIAnQEAIQ0HAAB4ACAeAAB4ACAfAAB4ACAwAACeAQAgMQAAeAAgZgIAAAABZwIAAAAEaAIAAAAEaQIAAAABagIAAAABawIAAAABbAIAAAABbQIAnQEAIQhmCAAAAAFnCAAAAARoCAAAAARpCAAAAAFqCAAAAAFrCAAAAAFsCAAAAAFtCACeAQAhBwcAAHgAIB4AAKABACAfAACgAQAgZgAAAH4CZwAAAH4IaAAAAH4IbQAAnwF-IgRmAAAAfgJnAAAAfghoAAAAfghtAACgAX4iBwcAAHgAIB4AAKIBACAfAACiAQAgZgAAAH0CZwAAAH0IaAAAAH0IbQAAoQF9IgRmAAAAfQJnAAAAfQhoAAAAfQhtAACiAX0iBwkBAHAAIVQAAKMBADBVAAAkABBWAACjAQAwVwEAcAAhZEAAdgAhZUAAdgAhCAkBAIgBACELAACQAQAgVAAApAEAMFUAABEAEFYAAKQBADBXAQCIAQAhZEAAjgEAIWVAAI4BACEUCAAAlwEAIAkAAKkBACAKAACqAQAgVAAApQEAMFUAAAMAEFYAAKUBADBXAQCIAQAhYgAApgF9ImRAAI4BACFlQACOAQAhdQEAiAEAIXkBAIgBACF6AQCIAQAhewAAmQEAIH4AAKcBfiJ_AQCIAQAhgAEBAIgBACGBAQEAiQEAIYIBAQCJAQAhgwECAKgBACEEZgAAAH0CZwAAAH0IaAAAAH0IbQAAogF9IgRmAAAAfgJnAAAAfghoAAAAfghtAACgAX4iCGYCAAAAAWcCAAAABGgCAAAABGkCAAAAAWoCAAAAAWsCAAAAAWwCAAAAAW0CAHgAIQoJAQCIAQAhCwAAkAEAIFQAAKQBADBVAAARABBWAACkAQAwVwEAiAEAIWRAAI4BACFlQACOAQAhhwEAABEAIIgBAAARACAUBAAAjwEAIAUAAJABACAGAACQAQAgVAAAhwEAMFUAAA0AEFYAAIcBADBXAQCIAQAhWAEAiAEAIVkBAIgBACFaAQCJAQAhWwEAiQEAIV0AAIoBXSJeIACLAQAhYAAAjAFgImIAAI0BYiJjIACLAQAhZEAAjgEAIWVAAI4BACGHAQAADQAgiAEAAA0AIAAAAAABjAEBAAAAAQGMAQEAAAABAYwBAAAAXQIBjAEgAAAAAQGMAQAAAGACAYwBAAAAYgIBjAFAAAAAAQcYAADZAQAgGQAA3AEAIIkBAADaAQAgigEAANsBACCNAQAABwAgjgEAAAcAII8BAAA_ACALGAAAzgEAMBkAANIBADCJAQAAzwEAMIoBAADQAQAwiwEAANEBACCMAQAAvQEAMI0BAAC9AQAwjgEAAL0BADCPAQAAvQEAMJABAADTAQAwkQEAAMABADALGAAAuQEAMBkAAL4BADCJAQAAugEAMIoBAAC7AQAwiwEAALwBACCMAQAAvQEAMI0BAAC9AQAwjgEAAL0BADCPAQAAvQEAMJABAAC_AQAwkQEAAMABADAPCAAAzAEAIAkAAM0BACBXAQAAAAFiAAAAfQJkQAAAAAFlQAAAAAF1AQAAAAF5AQAAAAF6AQAAAAF7AADLAQAgfgAAAH4CfwEAAAABgAEBAAAAAYIBAQAAAAGDAQIAAAABAgAAAAUAIBgAAMoBACADAAAABQAgGAAAygEAIBkAAMcBACABEQAAlAIAMBQIAACXAQAgCQAAqQEAIAoAAKoBACBUAAClAQAwVQAAAwAQVgAApQEAMFcBAAAAAWIAAKYBfSJkQACOAQAhZUAAjgEAIXUBAIgBACF5AQCIAQAhegEAiAEAIXsAAJkBACB-AACnAX4ifwEAiAEAIYABAQCIAQAhgQEBAIkBACGCAQEAiQEAIYMBAgCoAQAhAgAAAAUAIBEAAMcBACACAAAAwQEAIBEAAMIBACARVAAAwAEAMFUAAMEBABBWAADAAQAwVwEAiAEAIWIAAKYBfSJkQACOAQAhZUAAjgEAIXUBAIgBACF5AQCIAQAhegEAiAEAIXsAAJkBACB-AACnAX4ifwEAiAEAIYABAQCIAQAhgQEBAIkBACGCAQEAiQEAIYMBAgCoAQAhEVQAAMABADBVAADBAQAQVgAAwAEAMFcBAIgBACFiAACmAX0iZEAAjgEAIWVAAI4BACF1AQCIAQAheQEAiAEAIXoBAIgBACF7AACZAQAgfgAApwF-In8BAIgBACGAAQEAiAEAIYEBAQCJAQAhggEBAIkBACGDAQIAqAEAIQ1XAQCvAQAhYgAAxAF9ImRAALUBACFlQAC1AQAhdQEArwEAIXkBAK8BACF6AQCvAQAhewAAwwEAIH4AAMUBfiJ_AQCvAQAhgAEBAK8BACGCAQEAsAEAIYMBAgDGAQAhAowBAQAAAASWAQEAAAAFAYwBAAAAfQIBjAEAAAB-AgWMAQIAAAABkgECAAAAAZMBAgAAAAGUAQIAAAABlQECAAAAAQ8IAADIAQAgCQAAyQEAIFcBAK8BACFiAADEAX0iZEAAtQEAIWVAALUBACF1AQCvAQAheQEArwEAIXoBAK8BACF7AADDAQAgfgAAxQF-In8BAK8BACGAAQEArwEAIYIBAQCwAQAhgwECAMYBACEFGAAAjAIAIBkAAJICACCJAQAAjQIAIIoBAACRAgAgjwEAAFcAIAUYAACKAgAgGQAAjwIAIIkBAACLAgAgigEAAI4CACCPAQAAAQAgDwgAAMwBACAJAADNAQAgVwEAAAABYgAAAH0CZEAAAAABZUAAAAABdQEAAAABeQEAAAABegEAAAABewAAywEAIH4AAAB-An8BAAAAAYABAQAAAAGCAQEAAAABgwECAAAAAQGMAQEAAAAEAxgAAIwCACCJAQAAjQIAII8BAABXACADGAAAigIAIIkBAACLAgAgjwEAAAEAIA8JAADNAQAgCgAA2AEAIFcBAAAAAWIAAAB9AmRAAAAAAWVAAAAAAXUBAAAAAXkBAAAAAXoBAAAAAXsAAMsBACB-AAAAfgKAAQEAAAABgQEBAAAAAYIBAQAAAAGDAQIAAAABAgAAAAUAIBgAANcBACADAAAABQAgGAAA1wEAIBkAANUBACABEQAAiQIAMAIAAAAFACARAADVAQAgAgAAAMEBACARAADUAQAgDVcBAK8BACFiAADEAX0iZEAAtQEAIWVAALUBACF1AQCvAQAheQEArwEAIXoBAK8BACF7AADDAQAgfgAAxQF-IoABAQCvAQAhgQEBALABACGCAQEAsAEAIYMBAgDGAQAhDwkAAMkBACAKAADWAQAgVwEArwEAIWIAAMQBfSJkQAC1AQAhZUAAtQEAIXUBAK8BACF5AQCvAQAhegEArwEAIXsAAMMBACB-AADFAX4igAEBAK8BACGBAQEAsAEAIYIBAQCwAQAhgwECAMYBACEHGAAAhAIAIBkAAIcCACCJAQAAhQIAIIoBAACGAgAgjQEAAA0AII4BAAANACCPAQAAVwAgDwkAAM0BACAKAADYAQAgVwEAAAABYgAAAH0CZEAAAAABZUAAAAABdQEAAAABeQEAAAABegEAAAABewAAywEAIH4AAAB-AoABAQAAAAGBAQEAAAABggEBAAAAAYMBAgAAAAEDGAAAhAIAIIkBAACFAgAgjwEAAFcAIAlXAQAAAAFYAQAAAAFZAQAAAAFkQAAAAAFlQAAAAAF0AQAAAAF1AQAAAAF2IAAAAAF3QAAAAAECAAAAPwAgGAAA2QEAIAMAAAAHACAYAADZAQAgGQAA3QEAIAsAAAAHACARAADdAQAgVwEArwEAIVgBAK8BACFZAQCvAQAhZEAAtQEAIWVAALUBACF0AQCwAQAhdQEAsAEAIXYgALIBACF3QADeAQAhCVcBAK8BACFYAQCvAQAhWQEArwEAIWRAALUBACFlQAC1AQAhdAEAsAEAIXUBALABACF2IACyAQAhd0AA3gEAIQGMAUAAAAABAxgAANkBACCJAQAA2gEAII8BAAA_ACAEGAAAzgEAMIkBAADPAQAwiwEAANEBACCPAQAAvQEAMAQYAAC5AQAwiQEAALoBADCLAQAAvAEAII8BAAC9AQAwBAMAAOkBACB0AACrAQAgdQAAqwEAIHcAAKsBACAAAAAABRgAAP8BACAZAACCAgAgiQEAAIACACCKAQAAgQIAII8BAABXACADGAAA_wEAIIkBAACAAgAgjwEAAFcAIAUEAADiAQAgBQAA4wEAIAYAAOMBACBaAACrAQAgWwAAqwEAIAAAAAAAAAAACxgAAPMBADAZAAD3AQAwiQEAAPQBADCKAQAA9QEAMIsBAAD2AQAgjAEAAL0BADCNAQAAvQEAMI4BAAC9AQAwjwEAAL0BADCQAQAA-AEAMJEBAADAAQAwDwgAAMwBACAKAADYAQAgVwEAAAABYgAAAH0CZEAAAAABZUAAAAABdQEAAAABeQEAAAABegEAAAABewAAywEAIH4AAAB-An8BAAAAAYEBAQAAAAGCAQEAAAABgwECAAAAAQIAAAAFACAYAAD7AQAgAwAAAAUAIBgAAPsBACAZAAD6AQAgAREAAP4BADACAAAABQAgEQAA-gEAIAIAAADBAQAgEQAA-QEAIA1XAQCvAQAhYgAAxAF9ImRAALUBACFlQAC1AQAhdQEArwEAIXkBAK8BACF6AQCvAQAhewAAwwEAIH4AAMUBfiJ_AQCvAQAhgQEBALABACGCAQEAsAEAIYMBAgDGAQAhDwgAAMgBACAKAADWAQAgVwEArwEAIWIAAMQBfSJkQAC1AQAhZUAAtQEAIXUBAK8BACF5AQCvAQAhegEArwEAIXsAAMMBACB-AADFAX4ifwEArwEAIYEBAQCwAQAhggEBALABACGDAQIAxgEAIQ8IAADMAQAgCgAA2AEAIFcBAAAAAWIAAAB9AmRAAAAAAWVAAAAAAXUBAAAAAXkBAAAAAXoBAAAAAXsAAMsBACB-AAAAfgJ_AQAAAAGBAQEAAAABggEBAAAAAYMBAgAAAAEEGAAA8wEAMIkBAAD0AQAwiwEAAPYBACCPAQAAvQEAMAELAADjAQAgDVcBAAAAAWIAAAB9AmRAAAAAAWVAAAAAAXUBAAAAAXkBAAAAAXoBAAAAAXsAAMsBACB-AAAAfgJ_AQAAAAGBAQEAAAABggEBAAAAAYMBAgAAAAEOBQAA4AEAIAYAAOEBACBXAQAAAAFYAQAAAAFZAQAAAAFaAQAAAAFbAQAAAAFdAAAAXQJeIAAAAAFgAAAAYAJiAAAAYgJjIAAAAAFkQAAAAAFlQAAAAAECAAAAVwAgGAAA_wEAIAMAAAANACAYAAD_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"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/utils/jwt.ts
import jwt from "jsonwebtoken";
var createToken = (payload, secret, expiresIn) => {
  const token = jwt.sign(payload, secret, {
    expiresIn
  });
  return token;
};
var verifyToken = (token, secret) => {
  try {
    const verifiedToken = jwt.verify(token, secret);
    return {
      success: true,
      data: verifiedToken
    };
  } catch (error) {
    console.log("Token verification failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Token verification failed"
    };
  }
};
var jwtUtils = {
  createToken,
  verifyToken
};

// src/lib/googleAuth.ts
import { OAuth2Client } from "google-auth-library";
var googleClient = new OAuth2Client({
  client_id: config_default.google_client_id
});

// src/module/auth/auth.service.ts
var registerUserToDB = async (payload) => {
  const { name, password } = payload;
  const email = payload.email.trim().toLowerCase();
  const isUserExists = await prisma.user.findUnique({
    where: { email }
  });
  if (isUserExists) {
    throw new Error("User with this email already exists");
  }
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config_default.bcrypt_salt_rounds)
  );
  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: UserRole.CITIZEN,
      status: UserStatus.ACTIVE,
      emailVerified: false,
      profile: {
        create: { name, email }
      }
    },
    omit: { password: true }
  });
  const { ...user } = createdUser;
  const jwtPayload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expires_in
  );
  const refreshToken3 = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_refresh_secret,
    config_default.jwt_refresh_expires_in
  );
  return {
    user,
    accessToken,
    refreshToken: refreshToken3
  };
};
var loginUserToDB = async (payload) => {
  const { password } = payload;
  const email = payload.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email }
  });
  if (!user) {
    throw new Error("User not found");
  }
  if (user.status === UserStatus.BLOCKED) {
    throw new Error("User is blocked");
  }
  if (user.password === null && user.googleId !== null) {
    throw new Error(
      "User already has account with google try to login with google"
    );
  }
  const isPasswordMatched = await bcrypt.compare(
    password,
    user.password
  );
  if (!isPasswordMatched) {
    throw new Error("Invalid credentials");
  }
  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expires_in
  );
  const refreshToken3 = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_refresh_secret,
    config_default.jwt_refresh_expires_in
  );
  return {
    accessToken,
    refreshToken: refreshToken3
  };
};
var getMeFromDB = async (id) => {
  const profile = await prisma.user.findUniqueOrThrow({
    where: { id },
    omit: {
      password: true
    },
    include: {
      profile: true
    }
  });
  return profile;
};
var refreshToken = async (token) => {
  const verifiedRefreshToken = jwtUtils.verifyToken(
    token,
    config_default.jwt_refresh_secret
  );
  if (!verifiedRefreshToken.success || !verifiedRefreshToken.data) {
    throw new Error(
      config_default.node_env === "development" ? verifiedRefreshToken.error : "Invalid refresh token"
    );
  }
  const data = verifiedRefreshToken.data;
  const user = await prisma.user.findUnique({
    where: { id: data.userId }
  });
  if (!user || user.status !== UserStatus.ACTIVE) {
    throw new Error("User is inactive or not found");
  }
  const jwtPayload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expires_in
  );
  const refreshToken3 = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_refresh_secret,
    config_default.jwt_refresh_expires_in
  );
  return {
    accessToken,
    refreshToken: refreshToken3
  };
};
var AllUserFromDB = async () => {
  const users = await prisma.user.findMany({
    omit: {
      password: true
    }
  });
  return users;
};
var updateRoleFromDB = async (id, updateRole2) => {
  const user = await prisma.user.update({
    where: { id },
    data: {
      role: updateRole2.role
    }
  });
  return user;
};
var blockUserFromDB = async (id, updateStatus) => {
  const user = await prisma.user.update({
    where: { id },
    data: {
      status: updateStatus.status
    }
  });
  return user;
};
var googleLogin = async (payload) => {
  let googleIdTokenPayload = null;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: payload.idToken,
      audience: config_default.google_client_id
    });
    googleIdTokenPayload = ticket.getPayload();
  } catch (error) {
    console.log("Google id token verify failed!", error);
    throw new Error("Invalid or expired google id token");
  }
  if (!googleIdTokenPayload) {
    throw new Error("Invalid or expired google id token");
  }
  if (!googleIdTokenPayload.email) {
    throw new Error("google email not found");
  }
  if (!googleIdTokenPayload.name) {
    throw new Error("google name not found");
  }
  const isUserExistedWithGoogleAuth = await prisma.user.findUnique({
    where: {
      email: googleIdTokenPayload.email,
      googleId: googleIdTokenPayload.sub
    }
  });
  let user = isUserExistedWithGoogleAuth;
  if (!isUserExistedWithGoogleAuth) {
    const isUserExistedWithCredential = await prisma.user.findUnique({
      where: {
        email: googleIdTokenPayload.email,
        authProvider: AuthProvider.CREDENTIAL
      }
    });
    if (isUserExistedWithCredential) {
      if (isUserExistedWithCredential.status === UserStatus.BLOCKED) {
        throw new Error("User is Blocked");
      }
      user = await prisma.user.update({
        where: {
          id: isUserExistedWithCredential.id
        },
        data: {
          googleId: googleIdTokenPayload.sub
        }
      });
    } else {
      user = await prisma.user.create({
        data: {
          name: googleIdTokenPayload.name,
          email: googleIdTokenPayload.email,
          googleId: googleIdTokenPayload.sub,
          role: UserRole.CITIZEN,
          authProvider: AuthProvider.GOOGLE,
          emailVerified: true,
          profile: {
            create: {
              name: googleIdTokenPayload.name,
              email: googleIdTokenPayload.email
            }
          }
        }
      });
    }
  }
  if (!user) {
    throw new Error("User Not Found");
  }
  if (user.status === UserStatus.BLOCKED) {
    throw new Error("User is Blocked");
  }
  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expires_in
  );
  const refreshToken3 = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_refresh_secret,
    config_default.jwt_refresh_expires_in
  );
  return {
    accessToken,
    refreshToken: refreshToken3
  };
};
var AuthService = {
  registerUserToDB,
  loginUserToDB,
  getMeFromDB,
  refreshToken,
  AllUserFromDB,
  updateRoleFromDB,
  blockUserFromDB,
  googleLogin
};

// src/module/auth/auth.controller.ts
var registerUser = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await AuthService.registerUserToDB(payload);
  const { accessToken, refreshToken: refreshToken3, user } = result;
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24
    // 24 hour or 1 day
  });
  res.cookie("refreshToken", refreshToken3, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24 * 7
    // 7 days
  });
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Patient registered successfully",
    data: {
      accessToken,
      refreshToken: refreshToken3,
      user
    }
  });
});
var loginUser = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await AuthService.loginUserToDB(payload);
  const { accessToken, refreshToken: refreshToken3 } = result;
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24
    // 24 hour or 1 day
  });
  res.cookie("refreshToken", refreshToken3, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24 * 7
    // 7 days
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully",
    data: {
      accessToken,
      refreshToken: refreshToken3
    }
  });
});
var getMe = catchAsync(async (req, res) => {
  const result = await AuthService.getMeFromDB(req.user?.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User data retrieved successfully",
    data: result
  });
});
var refreshToken2 = catchAsync(async (req, res) => {
  if (!req.cookies.refreshToken) {
    throw new Error("Refresh token is missing");
  }
  const result = await AuthService.refreshToken(req.cookies.refreshToken);
  const { accessToken, refreshToken: newRefreshToken } = result;
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24
    // 24 hour or 1 day
  });
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24 * 7
    // 7 days
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "New tokens generated successfully",
    data: {
      accessToken,
      refreshToken: newRefreshToken
    }
  });
});
var AllUser = catchAsync(async (req, res) => {
  const result = await AuthService.AllUserFromDB();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User list data retrieved successfully",
    data: result
  });
});
var updateRole = catchAsync(async (req, res) => {
  const id = req.params.id;
  const updatedRole = req.body;
  const result = await AuthService.updateRoleFromDB(id, updatedRole);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Role updated successfully",
    data: result
  });
});
var blockUser = catchAsync(async (req, res) => {
  const id = req.params.id;
  const updatedStatus = req.body;
  const result = await AuthService.blockUserFromDB(id, updatedStatus);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "user Blocked successfully",
    data: result
  });
});
var googleLogin2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await AuthService.googleLogin(payload);
  const { accessToken, refreshToken: refreshToken3 } = result;
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24
    // 24 hour or 1 day
  });
  res.cookie("refreshToken", refreshToken3, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24 * 7
    // 7 days
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully",
    data: {
      accessToken,
      refreshToken: refreshToken3
    }
  });
});
var AuthController = {
  registerUser,
  loginUser,
  getMe,
  refreshToken: refreshToken2,
  AllUser,
  updateRole,
  blockUser,
  googleLogin: googleLogin2
};

// src/middleware/auth.ts
var auth = (...requiredRoles) => {
  return catchAsync(async (req, res, next) => {
    const token = req.cookies.accessToken ? req.cookies.accessToken : req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization?.split(" ")[1] : req.headers.authorization;
    if (!token) {
      throw new Error("You are not login please login");
    }
    const verifiedToken = jwtUtils.verifyToken(token, config_default.jwt_access_secret);
    if (!verifiedToken.success) {
      throw new Error(verifiedToken.error);
    }
    const { id, email, name, role } = verifiedToken.data;
    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new Error(
        "Forbidden: You don't have permission to access this resource"
      );
    }
    const user = await prisma.user.findUnique({
      where: { id, email }
    });
    if (!user) {
      throw new Error("user Not found");
    }
    if (user.status === "BLOCKED") {
      throw new Error("Your account has been blocked contact support");
    }
    req.user = {
      id,
      name,
      email,
      role
    };
    next();
  });
};

// src/module/auth/auth.validation.ts
import z from "zod";
var userRegistrationZodSchema = z.object({
  name: z.string("name must be string"),
  email: z.email("Please provide a valid email"),
  password: z.string("password must be string").length(6, "password must be 6 character")
});
var userLoginZodSchema = z.object({
  email: z.email("Please provide a valid email"),
  password: z.string("password must be string").length(6, "password must be 6 character")
});
var roleValidationZodSchema = z.object({
  role: z.enum(UserRole)
});
var userStatusValidationZodSchema = z.object({
  status: z.enum(UserStatus)
});
var userValidationZod = {
  userRegistrationZodSchema,
  userLoginZodSchema,
  roleValidationZodSchema,
  userStatusValidationZodSchema
};

// src/middleware/validateRequestZod.ts
var validateRequestZod = (zodSchema) => {
  return catchAsync((req, res, next) => {
    const payload = req.body ?? {};
    const result = zodSchema.safeParse(payload);
    if (!result.success) {
      throw new Error(result.error.issues[0]?.message);
    }
    req.body = result.data;
    next();
  });
};

// src/module/auth/auth.route.ts
var router = Router();
router.post(
  "/register",
  validateRequestZod(userValidationZod.userRegistrationZodSchema),
  AuthController.registerUser
);
router.post(
  "/login",
  validateRequestZod(userValidationZod.userLoginZodSchema),
  AuthController.loginUser
);
router.post("/google", AuthController.googleLogin);
router.get(
  "/me",
  auth(UserRole.ADMIN, UserRole.CITIZEN, UserRole.DEPARTMENT_STAFF),
  AuthController.getMe
);
router.post("/refresh-token", AuthController.refreshToken);
router.get("/all-user", auth(UserRole.ADMIN), AuthController.AllUser);
router.patch(
  "/role/:id",
  auth(UserRole.ADMIN),
  validateRequestZod(userValidationZod.roleValidationZodSchema),
  AuthController.updateRole
);
router.patch(
  "/block/:id",
  auth(UserRole.ADMIN),
  validateRequestZod(userValidationZod.userStatusValidationZodSchema),
  AuthController.blockUser
);
var AuthRoutes = router;

// src/middleware/notFound.ts
import httpStatus2 from "http-status";
var notFound = (req, res) => {
  res.status(httpStatus2.NOT_FOUND).json({
    message: "Route not found",
    path: req.originalUrl,
    date: /* @__PURE__ */ new Date()
  });
};

// src/middleware/globalErrorHandler.ts
var globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
};
var globalErrorHandler_default = globalErrorHandler;

// src/module/categories/categories.route.ts
import { Router as Router2 } from "express";

// src/module/categories/categories.service.ts
var createCategoryToDB = async (payload) => {
  const newCategory = await prisma.category.create({ data: payload });
  return newCategory;
};
var getAllCategoryFromDB = async () => {
  const result = await prisma.category.findMany();
  return result;
};
var deleteCategoryFromDB = async (id) => {
  const result = await prisma.category.delete({
    where: {
      id
    }
  });
  return result;
};
var categoriesService = {
  createCategoryToDB,
  getAllCategoryFromDB,
  deleteCategoryFromDB
};

// src/module/categories/categories.controller.ts
import httpStatus3 from "http-status";
var createCategory = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await categoriesService.createCategoryToDB(payload);
  sendResponse(res, {
    statusCode: httpStatus3.CREATED,
    success: true,
    message: "create new category successfully",
    data: result
  });
});
var getAllCategory = catchAsync(async (req, res) => {
  const result = await categoriesService.getAllCategoryFromDB();
  sendResponse(res, {
    statusCode: httpStatus3.OK,
    success: true,
    message: "Get all category successfully",
    data: result
  });
});
var deleteCategory = catchAsync(async (req, res) => {
  const id = req.params?.id;
  await categoriesService.deleteCategoryFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus3.OK,
    success: true,
    message: "category delete successfully",
    data: null
  });
});
var categoriesController = {
  createCategory,
  deleteCategory,
  getAllCategory
};

// src/module/categories/categories.validation.ts
import z2 from "zod";
var serviceCategories = z2.object({
  category: z2.string("Category Must be a string").uppercase("category must be uppercase electricity")
});
var categoryValidationZod = {
  serviceCategories
};

// src/module/categories/categories.route.ts
var router2 = Router2();
router2.post(
  "/",
  auth(UserRole.CITY_ADMIN, UserRole.ADMIN),
  validateRequestZod(categoryValidationZod.serviceCategories),
  categoriesController.createCategory
);
router2.get("/", categoriesController.getAllCategory);
router2.delete(
  "/:id",
  auth(UserRole.CITY_ADMIN, UserRole.ADMIN),
  categoriesController.deleteCategory
);
var categoriesRoutes = router2;

// src/module/complaint/complaint.routes.ts
import { Router as Router3 } from "express";

// src/module/complaint/complaint.service.ts
var createComplain = async (payload) => {
  const result = await prisma.complaint.create({ data: payload });
  return result;
};
var getAllComplaintAdminFromDB = async () => {
  const result = await prisma.complaint.findMany({
    include: {
      staff: true,
      citizen: {
        omit: {
          password: true
        }
      },
      category: true
    }
  });
  return result;
};
var getAllComplaintMeFromDB = async (citizenId) => {
  const result = await prisma.complaint.findMany({
    where: {
      citizenId
    },
    include: {
      staff: {
        omit: {
          password: true
        }
      },
      category: true
    }
  });
  return result;
};
var getSingleComplaintFromDB = async (id) => {
  const result = await prisma.complaint.findUniqueOrThrow({
    where: {
      id
    },
    include: {
      staff: true,
      category: true,
      citizen: true
    }
  });
  return result;
};
var updateComplaintFromDB = async (complaintId, citizenId, payload) => {
  const result = await prisma.complaint.update({
    where: {
      id: complaintId,
      citizenId,
      status: "PENDING"
    },
    data: payload
  });
  return result;
};
var statusFlow = {
  PENDING: ["APPROVED", "REJECTED"],
  APPROVED: ["WAITING_FOR_STAFF"],
  WAITING_FOR_STAFF: ["ASSIGNED"],
  ASSIGNED: ["IN_PROGRESS"],
  IN_PROGRESS: ["RESOLVED"],
  RESOLVED: [],
  REJECTED: []
};
var updateComplaintStatusFromDB = async (complaintId, newStatus) => {
  const complaint = await prisma.complaint.findUnique({
    where: { id: complaintId }
  });
  if (!complaint) {
    throw new Error("Complaint not found");
  }
  const allowedStatuses = statusFlow[complaint.status];
  if (!allowedStatuses.includes(newStatus)) {
    throw new Error(
      `Cannot change status from ${complaint.status} to ${newStatus}`
    );
  }
  return prisma.complaint.update({
    where: { id: complaintId },
    data: { status: newStatus }
  });
};
var assignStaffFromDB = async (complaintId, payload) => {
  const result = await prisma.complaint.update({
    where: {
      id: complaintId
    },
    data: {
      staffId: payload.staffId,
      adminNote: payload.adminNote,
      status: ComplaintStatus.ASSIGNED
    }
  });
  return result;
};
var getStaffAssignmentFormDB = async (id) => {
  const result = await prisma.complaint.findMany({
    where: {
      staffId: id
    },
    include: {
      category: true,
      staff: true,
      citizen: true
    }
  });
  return result;
};
var updateStatusByStaffFromDB = async (complaintId, status) => {
  const result = await prisma.complaint.update({
    where: {
      id: complaintId
    },
    data: {
      status
    }
  });
  return result;
};
var complaintService = {
  createComplain,
  getAllComplaintAdminFromDB,
  getAllComplaintMeFromDB,
  getSingleComplaintFromDB,
  updateComplaintFromDB,
  updateComplaintStatusFromDB,
  assignStaffFromDB,
  getStaffAssignmentFormDB,
  updateStatusByStaffFromDB
};

// src/module/complaint/complaint.controller.ts
import httpStatus4 from "http-status";
var createComplain2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await complaintService.createComplain(payload);
  sendResponse(res, {
    statusCode: httpStatus4.CREATED,
    success: true,
    message: "create complain successfully",
    data: result
  });
});
var getAllComplaintAdmin = catchAsync(async (req, res) => {
  const result = await complaintService.getAllComplaintAdminFromDB();
  sendResponse(res, {
    statusCode: httpStatus4.OK,
    success: true,
    message: "get all  successfully",
    data: result
  });
});
var getAllComplaintMe = catchAsync(async (req, res) => {
  const result = await complaintService.getAllComplaintMeFromDB(
    req.params.id
  );
  sendResponse(res, {
    statusCode: httpStatus4.OK,
    success: true,
    message: "get my complaint  successfully",
    data: result
  });
});
var getSingleComplaint = catchAsync(async (req, res) => {
  const result = await complaintService.getSingleComplaintFromDB(
    req.params.id
  );
  sendResponse(res, {
    statusCode: httpStatus4.OK,
    success: true,
    message: "get single complaint  successfully",
    data: result
  });
});
var updateComplaint = catchAsync(async (req, res) => {
  const complaintId = req.params.id;
  const citizenId = req.user?.id;
  const payload = req.body;
  const result = await complaintService.updateComplaintFromDB(
    complaintId,
    citizenId,
    payload
  );
  sendResponse(res, {
    statusCode: httpStatus4.OK,
    success: true,
    message: "complaint update  successfully",
    data: result
  });
});
var updateComplaintStatus = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const result = await complaintService.updateComplaintStatusFromDB(
      id,
      status
    );
    sendResponse(res, {
      statusCode: httpStatus4.OK,
      success: true,
      message: "Complaint status updated successfully",
      data: result
    });
  }
);
var assignStaff = catchAsync(async (req, res) => {
  const complaintId = req.params.id;
  const payload = req.body;
  const result = await complaintService.assignStaffFromDB(
    complaintId,
    payload
  );
  sendResponse(res, {
    statusCode: httpStatus4.OK,
    success: true,
    message: "Assign a staff successfully",
    data: result
  });
});
var getStaffAssignment = catchAsync(async (req, res) => {
  const id = req.user?.id;
  console.log(id);
  const result = await complaintService.getStaffAssignmentFormDB(id);
  sendResponse(res, {
    statusCode: httpStatus4.OK,
    success: true,
    message: "get all assignment for staff successfully",
    data: result
  });
});
var updateStatusByStaff = catchAsync(async (req, res) => {
  const complaintId = req.params?.id;
  const { status } = req.body;
  const result = await complaintService.updateComplaintStatusFromDB(
    complaintId,
    status
  );
  sendResponse(res, {
    statusCode: httpStatus4.OK,
    success: true,
    message: "update assignment status successfully",
    data: result
  });
});
var complaintController = {
  createComplain: createComplain2,
  getAllComplaintAdmin,
  getAllComplaintMe,
  getSingleComplaint,
  updateComplaint,
  updateComplaintStatus,
  assignStaff,
  getStaffAssignment,
  updateStatusByStaff
};

// src/module/complaint/complaint.validation.ts
import z3 from "zod";
var createComplainValidation = z3.object({
  title: z3.string("title must be a string"),
  description: z3.string("description must be a string").min(10, "description length must be at least 10"),
  address: z3.string("address Must be a string").min(5, "address length must be at least 10"),
  citizenId: z3.string("citizen id must be a string"),
  categoryId: z3.string("category id must be a sting")
});
var staffAssignmentSchema = z3.object({
  status: z3.enum(staffAssignmentStatus)
});
var complaintValidationZod = {
  createComplainValidation,
  staffAssignmentSchema
};

// src/module/complaint/complaint.routes.ts
var router3 = Router3();
router3.post(
  "/",
  auth(UserRole.CITIZEN),
  validateRequestZod(complaintValidationZod.createComplainValidation),
  complaintController.createComplain
);
router3.get(
  "/",
  auth(UserRole.ADMIN, UserRole.CITY_ADMIN),
  complaintController.getAllComplaintAdmin
);
router3.get(
  "/staff",
  auth(UserRole.DEPARTMENT_STAFF),
  complaintController.getStaffAssignment
);
router3.get(
  "/me/:id",
  auth(UserRole.CITIZEN),
  complaintController.getAllComplaintMe
);
router3.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.CITY_ADMIN, UserRole.CITIZEN),
  complaintController.getSingleComplaint
);
router3.patch(
  "/update/:id",
  auth(UserRole.CITIZEN),
  complaintController.updateComplaint
);
router3.patch(
  "/updateStatus/:id",
  auth(UserRole.ADMIN),
  complaintController.updateComplaintStatus
);
router3.patch(
  "/assignStaff/:id",
  auth(UserRole.ADMIN, UserRole.CITY_ADMIN),
  complaintController.assignStaff
);
router3.patch(
  "/staff/:id",
  auth(UserRole.DEPARTMENT_STAFF),
  validateRequestZod(complaintValidationZod.staffAssignmentSchema),
  complaintController.updateStatusByStaff
);
var complaintRoutes = router3;

// src/lib/redis.ts
import { createClient } from "redis";
var redisClient = createClient({
  username: config_default.redis_user,
  password: config_default.redis_password,
  socket: {
    host: config_default.redis_host,
    port: Number(config_default.redis_port)
  }
});

// src/lib/bkash.ts
var getBkashIdToken = async () => {
  try {
    const IdTokenKey = "bkash:idToken";
    const RefreshTokenKey = "bkash:refreshToken";
    let bkashIdToken = await redisClient.get(IdTokenKey);
    const bkashRefreshToken = await redisClient.get(RefreshTokenKey);
    const bkashIdTokenTTL = await redisClient.ttl(IdTokenKey);
    const bkashRefreshTokenTTL = await redisClient.ttl(RefreshTokenKey);
    if ((bkashIdTokenTTL <= 600 || !bkashIdToken) && bkashRefreshToken && bkashRefreshTokenTTL > 600) {
      const refreshTokenResponse = await fetch(
        `${config_default.bkash_base_url}/tokenized-checkout/auth/refresh-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            username: config_default.bkash_username,
            password: config_default.bkash_password
          },
          body: JSON.stringify({
            app_key: config_default.bkash_app_key,
            app_secret: config_default.bkash_app_secret,
            refresh_token: bkashRefreshToken
          })
        }
      );
      if (!refreshTokenResponse.ok) {
        throw new Error("Bkash Access token Grand Failed during refresh");
      }
      const bkashRefreshTokenResult = await refreshTokenResponse.json();
      bkashIdToken = bkashRefreshTokenResult.id_token;
      await redisClient.set(IdTokenKey, bkashIdToken, {
        expiration: {
          type: "EX",
          value: 60 * 60
        }
      });
      return bkashIdToken;
    }
    if (bkashIdTokenTTL > 600) {
      return bkashIdToken;
    }
    const res = await fetch(
      `${config_default.bkash_base_url}/tokenized-checkout/auth/grant-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          username: config_default.bkash_username,
          password: config_default.bkash_password
        },
        body: JSON.stringify({
          app_key: config_default.bkash_app_key,
          app_secret: config_default.bkash_app_secret
        })
      }
    );
    if (!res.ok) {
      throw new Error("Bkash Access token Grand Failed");
    }
    const result = await res.json();
    await redisClient.set(IdTokenKey, result.id_token, {
      expiration: {
        type: "EX",
        value: 60 * 60
      }
    });
    await redisClient.set(RefreshTokenKey, result.refresh_token, {
      expiration: {
        type: "EX",
        value: 60 * 60 * 24 * 28
        //28 days
      }
    });
    bkashIdToken = result.id_token;
    return bkashIdToken;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred");
  }
};

// src/module/payment/payment.routes.ts
import { Router as Router4 } from "express";

// src/module/payment/payment.service.ts
var createPaymentAndUpdateStatusToDB = async (complaintId, citizenId) => {
  const isPaid = await prisma.complaint.findFirst({
    where: {
      id: complaintId,
      citizenId,
      paymentStatus: PaymentStatus.PENDING
    }
  });
  console.log(isPaid);
  if (!isPaid) {
    throw new Error("Already paid or not owner of this complaint");
  }
  const bkashIdToken = await getBkashIdToken();
  if (!bkashIdToken) {
    throw new Error("No bkash idToken found");
  }
  const bkashCreatePayment = await fetch(
    `${config_default.bkash_base_url}/tokenized-checkout/payment/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: bkashIdToken,
        "X-App-Key": config_default.bkash_app_key
      },
      body: JSON.stringify({
        // mode: "0011",
        // payerReference: "0123456789",
        // callbackURL: `${config.bkash_callback_url}/payment/callback`,
        // amount: "100",
        // currency: "BDT",
        // intent: "sale",
        // merchantInvoiceNumber: "Inv0781" // complaint id
        payerReference: "TEST001ABC",
        callbackURL: `${config_default.bkash_callback_url}/payment/callback`,
        amount: "100",
        currency: "BDT",
        intent: "sale",
        merchantInvoiceNumber: complaintId,
        subMerchantName: "Test",
        merchantAssociationInfo: "MI05MID54RF09123456789"
      })
    }
  );
  const bkashCreaetPaymentResult = bkashCreatePayment.json();
  return bkashCreaetPaymentResult;
};
var paymentCallback = async (query) => {
  const paymentId = query.paymentID;
  if (!paymentId) {
    throw new Error("Payment id missing");
  }
  const status = query.status;
  if (!status) {
    throw new Error("Payment status missing");
  }
  const bkashIdToken = await getBkashIdToken();
  if (!bkashIdToken) {
    throw new Error("No bkash idToken found");
  }
  const executedPayment = await fetch(
    `${config_default.bkash_base_url}/tokenized-checkout/payment/execute`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: bkashIdToken,
        "X-App-Key": config_default.bkash_app_key
      },
      body: JSON.stringify({
        paymentId
      })
    }
  );
  const executedPaymentResult = await executedPayment.json();
  if (status === "success") {
    await prisma.complaint.update({
      where: {
        id: executedPaymentResult.merchantInvoiceNumber
      },
      data: {
        paymentStatus: PaymentStatus.PAID,
        status: ComplaintStatus.WAITING_FOR_STAFF
      }
    });
    return {
      executedPaymentResult,
      redirectUrl: `${config_default.frontend_url}/citizen-dashboard?status=success`
    };
  }
  if (status === "failure") {
    return {
      executedPaymentResult,
      redirectUrl: `${config_default.frontend_url}/dashboard/citizen-dashboard?status=failure`
    };
  }
  if (status === "cancel") {
    return {
      executedPaymentResult,
      redirectUrl: `${config_default.frontend_url}/dashboard/citizen-dashboard?status=cancel`
    };
  }
  return {
    executedPaymentResult,
    redirectUrl: `${config_default.frontend_url}/citizen-dashboard`
  };
};
var paymentService = {
  createPaymentAndUpdateStatusToDB,
  paymentCallback
};

// src/module/payment/payment.controller.ts
import httpStatus5 from "http-status";
var createPaymentAndUpdateStatus = catchAsync(
  async (req, res) => {
    const { complaintId } = req.body;
    const citizenId = req.user?.id;
    const result = await paymentService.createPaymentAndUpdateStatusToDB(
      complaintId,
      citizenId
    );
    sendResponse(res, {
      statusCode: httpStatus5.OK,
      success: true,
      message: "payment create successfully",
      data: result
    });
  }
);
var paymentCallBack = catchAsync(async (req, res) => {
  console.log(req.query, "req.query");
  const { executedPaymentResult, redirectUrl } = await paymentService.paymentCallback(req.query);
  console.log({ executedPaymentResult }, "callback controller");
  console.log(redirectUrl, "redirect url");
  res.redirect(redirectUrl);
});
var paymentController = {
  createPaymentAndUpdateStatus,
  paymentCallBack
};

// src/module/payment/payment.routes.ts
var router4 = Router4();
router4.post(
  "/create",
  auth(UserRole.CITIZEN),
  paymentController.createPaymentAndUpdateStatus
);
router4.get("/callback", paymentController.paymentCallBack);
var paymentRoutes = router4;

// src/app.ts
var app = express();
app.use(
  cors({
    origin: config_default.frontend_url,
    credentials: true
  })
);
app.use(express.urlencoded({ extended: true }));
app.get("/test", async (req, res, next) => {
  const grandIdTokenResult = await getBkashIdToken();
  console.log(grandIdTokenResult);
  res.status(httpStatus6.OK).json({
    success: true,
    message: "redis is working test"
  });
});
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/categories", categoriesRoutes);
app.use("/api/v1/complaint", complaintRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.get("/", async (req, res) => {
  res.status(httpStatus6.OK).json({
    success: true,
    message: "Welcome to city care System Backend"
  });
});
app.use(globalErrorHandler_default);
app.use(notFound);
var app_default = app;

// src/server.ts
var port = config_default.port;
var main = async () => {
  try {
    await prisma.$connect();
    console.log("Prisma connected and working");
    await redisClient.connect();
    console.log("Redis connected and working");
    app_default.listen(port, () => {
      console.log(`rent-nest server running on port:${port}`);
    });
  } catch (error) {
    console.error("Error is starting the server:", error);
    process.exit(1);
  }
};
main();
//# sourceMappingURL=server.js.map