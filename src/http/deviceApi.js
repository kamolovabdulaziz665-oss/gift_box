import { $authHost } from "./index.js";

export const createType = async (type) => {
  const { data } = await $authHost.post("/api/type", type);
  return data;
};

export const fetchTypes = async () => {
  const { data } = await $authHost.get("/api/type");
  return data;
};

export const createBrand = async (brand) => {
  const { data } = await $authHost.post("/api/brand", brand);
  return data;
};

export const fetchBrands = async () => {
  const { data } = await $authHost.get("/api/brand");
  return data;
};

export const createDevice = async (device) => {
  const { data } = await $authHost.post("/api/device", device);
  return data;
};

export const fetchDevices = async (
  typeId,
  brandId,
  page,
  limit = 5,
  sortBy
) => {
  const { data } = await $authHost.get("/api/device", {
    params: { typeId, brandId, page, limit, sortBy },
  });
  return data;
};

export const fetchAllDevices = async (sortBy) => {
  const batchSize = 100;
  const firstPage = await fetchDevices(null, null, 1, batchSize, sortBy);
  const firstRows = Array.isArray(firstPage) ? firstPage : firstPage?.rows || [];
  const totalCount = Number(firstPage?.count) || firstRows.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / batchSize));

  if (totalPages === 1) {
    return firstRows;
  }

  const pageRequests = Array.from({ length: totalPages - 1 }, (_, index) =>
    fetchDevices(null, null, index + 2, batchSize, sortBy)
  );
  const restPages = await Promise.all(pageRequests);
  const restRows = restPages.flatMap((pageData) =>
    Array.isArray(pageData) ? pageData : pageData?.rows || []
  );

  return [...firstRows, ...restRows];
};

export const fetchOneDevices = async (id) => {
  const { data } = await $authHost.get("/api/device/" + id);
  return data;
};

export const fetchDeviceComments = async (deviceId) => {
  const { data } = await $authHost.get(`/api/device/comments/${deviceId}`);
  return data;
};

export const createDeviceComment = async (deviceId, text) => {
  try {
    const { data } = await $authHost.post("/api/device/create-comment", {
      device_id: deviceId,
      text,
    });
    return data;
  } catch (error) {
    throw new Error("Error creating comment: " + error.message);
  }
};

export const updateDevice = async (id, device) => {
  const { data } = await $authHost.put(`/api/device/${id}`, device);
  return data;
};

export const deleteDevice = async (id) => {
  const { data } = await $authHost.delete(`/api/device/${id}`);
  return data;
};
