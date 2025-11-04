import { z } from "zod";

export const requestRouteSchema = z.object({
  id: z.uuidv7(),
});

const changeSchema = z.object({
  id: z.uuidv7(),
  // action is just for reference, but all blocks/edges are checked against for deletions
  // create/update will do the upsert operation on IDs
  action: z.enum(["upsert", "delete"]),
});

export const requestBodySchema = z.object({
  actionsToPerform: z.object({
    blocks: z.array(changeSchema),
    edges: z.array(changeSchema),
  }),
  changes: z.object({
    blocks: z.array(
      z.object({
        id: z.string(),
        type: z.string(),
        data: z.any(),
        position: z.object({
          x: z.number(),
          y: z.number(),
        }),
      })
    ),
    edges: z.array(
      z.object({
        id: z.string(),
        from: z.string(),
        to: z.string(),
        fromHandle: z.string(),
        toHandle: z.string(),
      })
    ),
  }),
});
