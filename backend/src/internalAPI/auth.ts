import axios from "axios";


export interface AuthInput {
    email: string;
    password: string;
}

export const register = async (input: AuthInput): Promise<string> => {
    try {
        const response = await axios.post("http://localhost:5000/auth/register", input, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data.token;
    } catch (error: any) {
        console.log('Registration error response:', error.response.data);
        throw Error("Registration failed");
    }
};


export const login = async (input: AuthInput): Promise<string> => {
    try {
        const response = await axios.post("http://localhost:5000/auth/login", input, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data.token;
    } catch (error: any) {
        console.log('Login error response:', error.response.data);
        throw Error("Login failed");
    }
};