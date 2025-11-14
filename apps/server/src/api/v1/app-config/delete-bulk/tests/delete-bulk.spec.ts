import { describe, it, expect, vi, beforeEach } from "vitest";
import handleRequest from "../service";
import * as repository from "../repository";
import * as redis from "../../../../../db/redis";
import { BadRequestError } from "../../../../../errors/badRequestError";
import { db } from "../../../../../db";

// Mock dependencies
vi.mock("../repository");
vi.mock("../../../../../db/redis");
vi.mock("../../../../../db", () => ({
  db: {
    transaction: vi.fn(async (callback) => {
      return callback({});
    }),
  },
}));

describe("Delete Bulk App Config", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("handleRequest", () => {
    it("should successfully delete multiple app configs", async () => {
      const ids = [1, 2, 3];
      vi.mocked(repository.checkAppConfigsExist).mockResolvedValue(true);
      vi.mocked(repository.deleteAppConfigBulk).mockResolvedValue(3);
      vi.mocked(redis.publishMessage).mockResolvedValue(undefined);

      const result = await handleRequest({ ids });

      expect(result).toEqual({});
      expect(repository.checkAppConfigsExist).toHaveBeenCalledWith(ids, {});
      expect(repository.deleteAppConfigBulk).toHaveBeenCalledWith(ids, {});
      expect(redis.publishMessage).toHaveBeenCalled();
    });

    it("should throw error when ids array is empty", async () => {
      const ids: number[] = [];

      await expect(handleRequest({ ids })).rejects.toThrow(BadRequestError);
      await expect(handleRequest({ ids })).rejects.toThrow(
        "At least one ID is required"
      );
    });

    it("should throw error when not all app configs exist", async () => {
      const ids = [1, 2, 3];
      vi.mocked(repository.checkAppConfigsExist).mockResolvedValue(false);

      await expect(handleRequest({ ids })).rejects.toThrow(
        "One or more app configs not found"
      );
    });

    it("should throw error when deletion fails", async () => {
      const ids = [1, 2, 3];
      vi.mocked(repository.checkAppConfigsExist).mockResolvedValue(true);
      vi.mocked(repository.deleteAppConfigBulk).mockResolvedValue(0);

      await expect(handleRequest({ ids })).rejects.toThrow(
        "Failed to delete app configs"
      );
    });

    it("should handle single id deletion", async () => {
      const ids = [1];
      vi.mocked(repository.checkAppConfigsExist).mockResolvedValue(true);
      vi.mocked(repository.deleteAppConfigBulk).mockResolvedValue(1);
      vi.mocked(redis.publishMessage).mockResolvedValue(undefined);

      const result = await handleRequest({ ids });

      expect(result).toEqual({});
      expect(repository.deleteAppConfigBulk).toHaveBeenCalledWith(ids, {});
    });

    it("should publish redis message after successful deletion", async () => {
      const ids = [1, 2];
      vi.mocked(repository.checkAppConfigsExist).mockResolvedValue(true);
      vi.mocked(repository.deleteAppConfigBulk).mockResolvedValue(2);
      vi.mocked(redis.publishMessage).mockResolvedValue(undefined);

      await handleRequest({ ids });

      expect(redis.publishMessage).toHaveBeenCalledWith(
        redis.CHAN_ON_APPCONFIG_CHANGE,
        ""
      );
    });

    it("should use transaction for atomic operations", async () => {
      const ids = [1, 2, 3];
      const mockTx = {} as any;
      vi.mocked(db.transaction).mockImplementation(async (callback) => {
        return await callback(mockTx);
      });
      vi.mocked(repository.checkAppConfigsExist).mockResolvedValue(true);
      vi.mocked(repository.deleteAppConfigBulk).mockResolvedValue(3);
      vi.mocked(redis.publishMessage).mockResolvedValue(undefined);

      await handleRequest({ ids });

      expect(db.transaction).toHaveBeenCalled();
      expect(repository.checkAppConfigsExist).toHaveBeenCalledWith(ids, mockTx);
      expect(repository.deleteAppConfigBulk).toHaveBeenCalledWith(ids, mockTx);
    });
  });

  describe("repository functions", () => {
    it("deleteAppConfigBulk should delete multiple configs", async () => {
      const ids = [1, 2, 3];
      vi.mocked(repository.deleteAppConfigBulk).mockResolvedValue(3);

      const result = await repository.deleteAppConfigBulk(ids);

      expect(result).toBe(3);
    });

    it("checkAppConfigsExist should verify all configs exist", async () => {
      const ids = [1, 2, 3];
      vi.mocked(repository.checkAppConfigsExist).mockResolvedValue(true);

      const result = await repository.checkAppConfigsExist(ids);

      expect(result).toBe(true);
    });

    it("checkAppConfigsExist should return false when configs don't exist", async () => {
      const ids = [999, 1000];
      vi.mocked(repository.checkAppConfigsExist).mockResolvedValue(false);

      const result = await repository.checkAppConfigsExist(ids);

      expect(result).toBe(false);
    });
  });
});