import { describe, it, expect, vi, beforeEach } from "vitest";
import handleRequest from "../service";
import * as repository from "../repository";
import { db } from "../../../../../db";
import { BadRequestError } from "../../../../../errors/badRequestError";
import { NotFoundError } from "../../../../../errors/notFoundError";

vi.mock("../repository");
vi.mock("../../../../../db", () => ({
  db: {
    transaction: vi.fn(),
  },
}));
vi.mock("../../../../../db/redis", () => {
  return {
    publishMessage: vi.fn(),
    CHAN_ON_APPCONFIG_CHANGE: "",
  };
});

describe("Delete App Config Service", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should successfully delete app config when it exists", async () => {
    const mockTx = {};
    const mockTransaction = vi.fn(async (callback) => callback(mockTx));
    (db.transaction as any) = mockTransaction;
    (repository.checkAppConfigExist as any).mockResolvedValue(true);
    (repository.deleteAppConfig as any).mockResolvedValue(true);

    await handleRequest(1);

    expect(mockTransaction).toHaveBeenCalledOnce();
    expect(repository.checkAppConfigExist).toHaveBeenCalledWith(1, mockTx);
    expect(repository.deleteAppConfig).toHaveBeenCalledWith(1, mockTx);
  });

  it("should throw NotFoundError when app config does not exist", async () => {
    const mockTx = {};
    const mockTransaction = vi.fn(async (callback) => callback(mockTx));
    (db.transaction as any) = mockTransaction;
    (repository.checkAppConfigExist as any).mockResolvedValue(false);

    await expect(handleRequest(1)).rejects.toThrow(NotFoundError);
    expect(repository.checkAppConfigExist).toHaveBeenCalledWith(1, mockTx);
    expect(repository.deleteAppConfig).not.toHaveBeenCalled();
  });

  it("should throw BadRequestError when id is invalid", async () => {
    await expect(handleRequest(0)).rejects.toThrow(BadRequestError);
    await expect(handleRequest(NaN)).rejects.toThrow(BadRequestError);
    expect(db.transaction).not.toHaveBeenCalled();
  });
});
