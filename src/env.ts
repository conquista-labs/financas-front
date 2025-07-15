import * as yup from "yup";

const envSchema = yup.object({
  MODE: yup.string().oneOf(["production", "development", "test"]).required(),
  VITE_API_URL: yup.string().required(),
  VITE_ENABLE_API_MOCK_DELAY: yup.boolean().default(false),
});

let env: yup.InferType<typeof envSchema>;

try {
  env = await envSchema.validate(import.meta.env, { abortEarly: false });
} catch (error) {
  console.error("Erro ao validar variáveis de ambiente:", error);
  throw error;
}

export { env };
