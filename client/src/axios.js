import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8001",
});

// export function deleteCard(id) {
//   axios.delete({
//     baseURL: `http://localhost:8001/tinder/cards/:${id}`,
//   });
// }

export default instance;
