import { z } from "zod";
import { responseSchema } from "./dto";
import { getAppConfigList } from "./repository";
import { EncryptionService } from "../../../../lib/encryption";

export default async function handleRequest(
  page: number,
  perPage: number
): Promise<z.infer<typeof responseSchema>> {
  const offset = perPage * (page - 1);

  const { result, totalCount } = await getAppConfigList(offset, perPage);
  const hasNext = offset + result.length < totalCount;

  const modifiedList = result.map((item) => ({
    id: item.id,
    keyName: item.keyName!,
    description: item.description!,
    value: item.isEncrypted
      ? EncryptionService.maskValue(item.value!, "*")
      : item.value!,
    isEncrypted: item.isEncrypted!,
    encodingType: item.encodingType!,
    createdAt: item.createdAt!.toISOString(),
    updatedAt: item.updatedAt!.toISOString(),
  }));
  return {
    data: modifiedList,
    pagination: {
      hasNext,
      page,
      totalPages: Math.ceil(totalCount / perPage),
    },
  };
}
