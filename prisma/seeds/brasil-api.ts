import axios from "axios";

export const brasilApi = axios.create({
  baseURL: "https://brasilapi.com.br/api/",
});

brasilApi.interceptors.request.use(async (config) => {
  await new Promise((resolve) =>
    setTimeout(resolve, Math.round(Math.random() * 10000)),
  );

  return config;
});
