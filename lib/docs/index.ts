import { apiInfo, apiServers, apiTags } from "./info";
import { allSchemas } from "./schemas";
import { programsPaths } from "./paths/programs";
import { transactionsPaths } from "./paths/transactions";
import { midtransPaths } from "./paths/midtrans";
import { certificatesPaths } from "./paths/certificates";
import { verificationPaths } from "./paths/verification";
import { disbursementsPaths } from "./paths/disbursements";
import { wakifPaths } from "./paths/wakif";
import { settingsPaths } from "./paths/settings";
import { healthPaths } from "./paths/health";

export const openApiDocument = {
  openapi: "3.1.0",
  info: apiInfo,
  servers: apiServers,
  tags: apiTags,
  paths: {
    ...programsPaths,
    ...transactionsPaths,
    ...midtransPaths,
    ...certificatesPaths,
    ...verificationPaths,
    ...disbursementsPaths,
    ...wakifPaths,
    ...settingsPaths,
    ...healthPaths,
  },
  components: {
    schemas: allSchemas,
  },
};
