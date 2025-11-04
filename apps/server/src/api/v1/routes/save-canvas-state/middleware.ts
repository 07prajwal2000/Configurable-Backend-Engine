import z, { ZodType } from "zod";
import { requestBodySchema } from "./dto";
import { ConflictError } from "../../../../errors/conflictError";
import {
  arrayOperationsBlockSchema,
  BlockTypes,
  forEachLoopBlockSchema,
  forLoopBlockSchema,
  getHttpCookieBlockSchema,
  getHttpHeaderBlockSchema,
  getHttpParamBlockSchema,
  getHttpRequestBodyBlockSchema,
  getVarBlockSchema,
  ifBlockSchema,
  jsRunnerBlockSchema,
  setHttpCookieBlockSchema,
  setHttpHeaderBlockSchema,
  setVarSchema,
  stickyNotesSchema,
  transformerBlockSchema,
} from "@cbe/blocks";
import { Context, Next } from "hono";
import { ValidationError } from "../../../../errors/validationError";
import { entrypointBlockSchema } from "@cbe/blocks/builtin/entrypoint";
import { httpRequestBlockSchema } from "@cbe/blocks/builtin/httpRequest";
import { logBlockSchema } from "@cbe/blocks/builtin/log";
import { responseBlockSchema } from "@cbe/blocks/builtin/response";
import { getSingleDbBlockSchema } from "@cbe/blocks/builtin/db/getSingle";
import { getAllDbBlockSchema } from "@cbe/blocks/builtin/db/getAll";
import { deleteDbBlockSchema } from "@cbe/blocks/builtin/db/delete";
import { insertDbBlockSchema } from "@cbe/blocks/builtin/db/insert";
import { insertBulkDbBlockSchema } from "@cbe/blocks/builtin/db/insertBulk";
import { updateBlockSchema } from "../../../../modules/admin/blocks/dto";
import { nativeDbBlockSchema } from "@cbe/blocks/builtin/db/native";
import { transactionDbBlockSchema } from "@cbe/blocks/builtin/db/transaction";
import { BadRequestError } from "../../../../errors/badRequestError";

export async function requestBodyValidator(ctx: Context, next: Next) {
  const jsonData = await ctx.req.json();
  blockDataValidator(jsonData);
  return next();
}

function blockDataValidator(data: z.infer<typeof requestBodySchema>) {
  const deleteIds = new Set<string>();
  data.actionsToPerform.blocks.forEach((block) => {
    if (block.action !== "delete") return;
    deleteIds.add(block.id);
  });
  data.actionsToPerform.edges.forEach((edge) => {
    if (deleteIds.has(edge.id))
      throw new ConflictError("Edge Id conflicting with block");
    if (edge.action !== "delete") return;
    deleteIds.add(edge.id);
  });

  const errorBlocks: string[] = [];

  for (const block of data.changes.blocks) {
    if (deleteIds.has(block.id)) continue;
    let schema: ZodType = null!;
    switch (block.type as BlockTypes) {
      case BlockTypes.entrypoint:
        schema = entrypointBlockSchema;
        break;
      case BlockTypes.if:
        schema = ifBlockSchema;
        break;
      case BlockTypes.httprequest:
        schema = httpRequestBlockSchema;
        break;
      case BlockTypes.httpGetHeader:
        schema = getHttpHeaderBlockSchema;
        break;
      case BlockTypes.httpSetHeader:
        schema = setHttpHeaderBlockSchema;
        break;
      case BlockTypes.httpGetParam:
        schema = getHttpParamBlockSchema;
        break;
      case BlockTypes.httpGetCookie:
        schema = getHttpCookieBlockSchema;
        break;
      case BlockTypes.httpSetCookie:
        schema = setHttpCookieBlockSchema;
        break;
      case BlockTypes.httpGetRequestBody:
        schema = getHttpRequestBodyBlockSchema;
        break;
      case BlockTypes.forloop:
        schema = forLoopBlockSchema;
        break;
      case BlockTypes.foreachloop:
        schema = forEachLoopBlockSchema;
        break;
      case BlockTypes.transformer:
        schema = transformerBlockSchema;
        break;
      case BlockTypes.setvar:
        schema = setVarSchema;
        break;
      case BlockTypes.getvar:
        schema = getVarBlockSchema;
        break;
      case BlockTypes.consolelog:
        schema = logBlockSchema;
        break;
      case BlockTypes.jsrunner:
        schema = jsRunnerBlockSchema;
        break;
      case BlockTypes.response:
        schema = responseBlockSchema;
        break;
      case BlockTypes.arrayops:
        schema = arrayOperationsBlockSchema;
        break;
      case BlockTypes.db_getsingle:
        schema = getSingleDbBlockSchema;
        break;
      case BlockTypes.db_getall:
        schema = getAllDbBlockSchema;
        break;
      case BlockTypes.db_delete:
        schema = deleteDbBlockSchema;
        break;
      case BlockTypes.db_insert:
        schema = insertDbBlockSchema;
        break;
      case BlockTypes.db_insertbulk:
        schema = insertBulkDbBlockSchema;
        break;
      case BlockTypes.db_update:
        schema = updateBlockSchema;
        break;
      case BlockTypes.db_native:
        schema = nativeDbBlockSchema;
        break;
      case BlockTypes.db_transaction:
        schema = transactionDbBlockSchema;
        break;
      case BlockTypes.sticky_note:
        schema = stickyNotesSchema;
        break;
    }
    if (!schema) throw new BadRequestError("Invalid block type");
    const result = schema.safeParse(block.data);
    if (!result.success) {
      errorBlocks.push(block.id);
    }
  }

  if (errorBlocks.length > 0) {
    throw new ValidationError(
      errorBlocks.map((id) => ({
        field: id,
        message: "Invalid block data",
      }))
    );
  }
}
