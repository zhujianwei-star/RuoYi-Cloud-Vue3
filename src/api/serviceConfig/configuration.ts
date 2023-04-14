import request from "@/utils/request";

export function listConfiguration(params: object) {
  return request({
    method: "get",
    url: "/service/config/configuration/list",
    params,
  })
}

export function getConfigurationById(id: number) {
  return request({
    method: "get",
    url: `/service/config/configuration/${id}`,
  })
}