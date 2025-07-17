import configJson from "./configs.json";

const configs = {
  env: configJson.env || "DEV",
  subDomain: configJson.subDomain || "l2-proxy1",
  subPath: configJson.subPath || "",
  port: configJson.port || 3000,
};

export default configs;
