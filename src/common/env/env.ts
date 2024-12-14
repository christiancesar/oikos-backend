import { z } from "zod";

const dotEnvSchema = z.object({
  URL: z.string(),
  URL_BASE: z.string(),
  PORT: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string(),
  DATABASE_URL: z.string(),
});

export const enviroment = dotEnvSchema.parse(process.env);
