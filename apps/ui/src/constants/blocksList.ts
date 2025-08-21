import type { Node } from "@xyflow/react";
import {
  arrayOperationsBlockSchema,
  BlockCategories,
  BlockTypes,
} from "@cbe/blocks";
import type { logBlockSchema } from "@cbe/blocks/builtin/log";
import type z from "zod";

export const blocksList: Record<
  string,
  {
    name: BlockTypes;
    title: string;
    category: string;
    create(x: number, y: number): Node;
  }
> = {
  forloop: {
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
  foreachloop: {
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
  if: {
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
  getvar: {
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
  setvar: {
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
  transformer: {
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
  jsrunner: {
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
  response: {
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
  consolelog: {
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
