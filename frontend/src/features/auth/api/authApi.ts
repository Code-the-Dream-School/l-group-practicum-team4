import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

export const registerUser = async (name:string, email: string, password:string) => {
  try {
    const {data} = await api.post(
      "/auth/register",
      {name, email, password}
    ) 
    return  data;
  } catch (error: any) {
      const message = error?.response?.data?.message || "Register failed";
    throw new Error (message)
  }
}

export const loginUser = async (email: string, password:string) => {
  try {
    const {data} = await api.post(
      "/auth/login",
      {email, password}
    ) 
    return  data;
  } catch (error: any) {
      const message = error?.response?.data?.message || "Login failed";
    throw new Error (message)
  }
}


