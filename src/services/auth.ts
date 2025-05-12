import { api } from "./api";

export async function loginRequest(email: string, password: string): Promise<any | null> {
    try {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        };
        const response = await api.post("/auth/login", formData, config);
        return response.data;
    } catch (error) {
        return null;
    }
}
export async function validateToken(token: string): Promise<any | null> {
    try {
        const config = {
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        };
        const response = await api.get("/user-profile", config);

        return response.data;
    } catch (error) {
        console.log(error);
    }
}
