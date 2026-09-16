import { commonSchemas } from "./common";
import { programSchemas } from "./program";
import { transactionSchemas } from "./transaction";
import { certificateSchemas } from "./certificate";
import { disbursementSchemas } from "./disbursement";

export const allSchemas = {
  ...commonSchemas,
  ...programSchemas,
  ...transactionSchemas,
  ...certificateSchemas,
  ...disbursementSchemas,
};
