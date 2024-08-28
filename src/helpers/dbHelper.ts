import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { MONGO_URL } from "../lib/config";

dotenv.config();

const client = new MongoClient(MONGO_URL);

export const checkExistingReading = async (customer_code: string, measure_datetime: string, measure_type: string): Promise<boolean> => {
  const db = client.db("meter-readings");
  const readingsCollection = db.collection("readings");

  const existingReading = await readingsCollection.findOne({
    customer_code,
    measure_datetime: {
      $gte: new Date(new Date(measure_datetime).setDate(1)),
      $lt: new Date(new Date(measure_datetime).setMonth(new Date(measure_datetime).getMonth() + 1)),
    },
    measure_type,
  });

  return !!existingReading;
};

export const saveReading = async (customer_code: string, measure_datetime: string, measure_type: string, measure_value: number, measure_uuid: string): Promise<void> => {
  const db = client.db("meter-readings");
  const readingsCollection = db.collection("readings");

  await readingsCollection.insertOne({
    customer_code,
    measure_datetime: new Date(measure_datetime),
    measure_type,
    measure_value,
    measure_uuid,
    created_at: new Date(),
  });
};
