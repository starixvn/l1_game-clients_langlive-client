import configJson from "./configs.json";

const configs = {
  env: configJson.env || "DEV",
  subDomain: configJson.subDomain || "",
  subPath: configJson.subPath || "",
  port: configJson.port || 3000,
};

export default configs;
