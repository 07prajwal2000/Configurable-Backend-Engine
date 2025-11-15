import { describe, it, expect, vi, beforeEach } from "vitest";
import handleRequest from "../service";
import { deleteIntegration } from "../repository";
import { publishMessage } from "../../../../../db/redis";
import { NotFoundError } from "../../../../../errors/notFoundError";

vi.mock("../repository");
vi.mock("../../../../../db/redis");

const mockDeleteIntegration = vi.mocked(deleteIntegration);
const mockPublishMessage = vi.mocked(publishMessage);

describe("deleteIntegration service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully delete an integration", async () => {
    mockDeleteIntegration.mockResolvedValueOnce(1);

    await handleRequest("test-id");

    expect(mockDeleteIntegration).toHaveBeenCalledWith("test-id");
    expect(mockPublishMessage).toHaveBeenCalled();
  });

  it("should throw NotFoundError when integration does not exist", async () => {
    mockDeleteIntegration.mockResolvedValueOnce(0);

    await expect(handleRequest("non-existent-id")).rejects.toThrow(NotFoundError);
    expect(mockPublishMessage).not.toHaveBeenCalled();
  });

  it("should publish message after successful deletion", async () => {
    mockDeleteIntegration.mockResolvedValueOnce(1);

    await handleRequest("test-id");

    expect(mockPublishMessage).toHaveBeenCalledWith(
      expect.any(String),
      ""
    );
  });
});