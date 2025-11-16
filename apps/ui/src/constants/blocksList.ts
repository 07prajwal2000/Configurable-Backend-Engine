import type { Node } from "@xyflow/react";
import {
  arrayOperationsBlockSchema,
  BlockCategories,
  BlockTypes,
  getHttpCookieBlockSchema,
  getHttpHeaderBlockSchema,
  getHttpParamBlockSchema,
  setHttpCookieBlockSchema,
  setHttpHeaderBlockSchema,
} from "@fluxify/blocks";
import type { logBlockSchema } from "@fluxify/blocks/builtin/log";
import type z from "zod";
import { HttpCookieSameSite } from "@fluxify/blocks/baseBlock";

export const blocksList: Record<
  string,
  {
    name: BlockTypes;
    title: string;
    category: string;
    create(x: number, y: number): Node;
  }
> = {
  [BlockTypes.forloop]: {
    name: BlockTypes.forloop,
    title: "For Loop",
    category: BlockCategories.LOGIC,
    create(x: number, y: number): Node {
      return {
        type: BlockTypes.forloop,
        data: {
          end: 10,
          start: 0,
          step: 1,
        },
        id: "",
        position: { x, y },
      };
    },
  },
  [BlockTypes.httpGetHeader]: {
    name: BlockTypes.httpGetHeader,
    title: "Get Header",
    category: BlockCategories.HTTP,
    create(x, y) {
      return {
        type: BlockTypes.httpGetHeader,
        data: {
          name: "Content-Type",
        } as z.infer<typeof getHttpHeaderBlockSchema>,
        id: "",
        position: { x, y },
      };
    },
  },
  [BlockTypes.httpSetHeader]: {
    name: BlockTypes.httpSetHeader,
    title: "Set Header",
    category: BlockCategories.HTTP,
    create(x, y) {
      return {
        type: BlockTypes.httpSetHeader,
        data: {
          name: "Content-Type",
          value: "application/json",
        } as z.infer<typeof setHttpHeaderBlockSchema>,
        id: "",
        position: { x, y },
      };
    },
  },
  [BlockTypes.httpGetCookie]: {
    name: BlockTypes.httpGetCookie,
    title: "Get Cookie",
    category: BlockCategories.HTTP,
    create(x, y) {
      return {
        type: BlockTypes.httpGetCookie,
        data: {
          name: "Authorization",
        } as z.infer<typeof getHttpCookieBlockSchema>,
        id: "",
        position: { x, y },
      };
    },
  },
  [BlockTypes.httpSetCookie]: {
    name: BlockTypes.httpSetCookie,
    title: "Set Cookie",
    category: BlockCategories.HTTP,
    create(x, y) {
      return {
        type: BlockTypes.httpSetCookie,
        data: {
          name: "Authorization",
          value: "",
          expiry: "",
          domain: "",
          path: "",
          httpOnly: false,
          secure: false,
          samesite: HttpCookieSameSite.Lax,
        } as z.infer<typeof setHttpCookieBlockSchema>,
        id: "",
        position: { x, y },
      };
    },
  },
  [BlockTypes.httpGetParam]: {
    name: BlockTypes.httpGetParam,
    title: "Get Param",
    category: BlockCategories.HTTP,
    create(x, y) {
      return {
        type: BlockTypes.httpGetParam,
        data: {
          name: "userId",
          source: "query",
        } as z.infer<typeof getHttpParamBlockSchema>,
        id: "",
        position: { x, y },
      };
    },
  },
  [BlockTypes.httpGetRequestBody]: {
    name: BlockTypes.httpGetRequestBody,
    title: "Get Request Body",
    category: BlockCategories.HTTP,
    create(x, y) {
      return {
        type: BlockTypes.httpGetRequestBody,
        data: {},
        id: "",
        position: { x, y },
      };
    },
  },
  [BlockTypes.foreachloop]: {
    name: BlockTypes.foreachloop,
    title: "For Each Loop",
    category: BlockCategories.LOGIC,
    create(x: number, y: number): Node {
      return {
        data: {
          useParam: false,
          values: [],
        },
        type: BlockTypes.foreachloop,
        id: "",
        position: { x, y },
      };
    },
  },
  [BlockTypes.if]: {
    name: BlockTypes.if,
    title: "If Condition",
    category: BlockCategories.LOGIC,
    create(x: number, y: number): Node {
      return {
        type: BlockTypes.if,
        data: {
          conditions: [],
        },
        id: "",
        position: { x, y },
      };
    },
  },
  [BlockTypes.getvar]: {
    name: BlockTypes.getvar,
    title: "Get Variable",
    category: BlockCategories.LOGIC,
    create(x: number, y: number): Node {
      return {
        type: BlockTypes.getvar,
        data: {
          key: "",
        },
        id: "",
        position: { x, y },
      };
    },
  },
  [BlockTypes.setvar]: {
    name: BlockTypes.setvar,
    title: "Set Variable",
    category: BlockCategories.LOGIC,
    create(x: number, y: number): Node {
      return {
        type: BlockTypes.setvar,
        data: {
          key: "",
          value: "",
        },
        id: "",
        position: { x, y },
      };
    },
  },
  [BlockTypes.transformer]: {
    name: BlockTypes.transformer,
    title: "Transformer",
    category: BlockCategories.MISC,
    create(x: number, y: number): Node {
      return {
        type: BlockTypes.transformer,
        data: {
          fieldMap: {},
          useJs: false,
        },
        id: "",
        position: { x, y },
      };
    },
  },
  [BlockTypes.jsrunner]: {
    name: BlockTypes.jsrunner,
    title: "JS Runner",
    category: BlockCategories.MISC,
    create(x: number, y: number): Node {
      return {
        type: BlockTypes.jsrunner,
        data: {
          value: "",
        },
        id: "",
        position: { x, y },
      };
    },
  },
  [BlockTypes.response]: {
    name: BlockTypes.response,
    title: "Response",
    category: BlockCategories.MISC,
    create(x: number, y: number): Node {
      return {
        type: BlockTypes.response,
        data: {
          httpCode: "200",
        },
        id: "",
        position: { x, y },
      };
    },
  },
  [BlockTypes.consolelog]: {
    name: BlockTypes.consolelog,
    title: "Console Log",
    category: BlockCategories.LOGGING,
    create(x: number, y: number): Node {
      return {
        type: BlockTypes.consolelog,
        data: {
          level: "info",
          message: "",
        } as z.infer<typeof logBlockSchema>,
        id: "",
        position: { x, y },
      };
    },
  },
  [BlockTypes.arrayops]: {
    name: BlockTypes.arrayops,
    title: "Array Operations",
    category: BlockCategories.MISC,
    create(x: number, y: number): Node {
      return {
        type: BlockTypes.arrayops,
        data: {
          datasource: "",
          operation: "push",
          useParamAsInput: false,
          value: "",
        } as z.infer<typeof arrayOperationsBlockSchema>,
        id: "",
        position: { x, y },
      };
    },
  },
};
