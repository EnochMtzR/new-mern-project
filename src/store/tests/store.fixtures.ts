import { LocalStore } from "../Store";
import { ContextMenu } from "../Config/contextMenu/ContextMenu";
export const testStoreState: LocalStore.State = {
  user: {
    id: "45488c69-a859-466c-b980-3c7a0677f332",
    inHotelId: "97",
    name: "admin",
    hotels: [
      {
        id: "e06bacaf-1c81-4c95-ac47-353faaed3cfb",
        name: "Hotel prueba"
      }
    ],
    accessRights: ["test", "access"],
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0NTQ4OGM2OS1hODU5LTQ2NmMtYjk4MC0zYzdhMDY3N2YzMzIiLCJuYW1lIjoiVGVzdCIsImlhdCI6MTUzNzIyMTAxMCwiZXhwIjoxNTM3MjI0NjEwfQ.gW1fJVhMbOLKa6ecQEfHtUopWR2wNV3zNdOZGFGDoMQ"
  },
  config: {
    language: "english",
    toolTip: "",
    contextMenu: undefined
  }
};
