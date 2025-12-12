import axios from "axios";
import { sql } from "../db";
import UserRepository from "../repository/users";

describe("Auth API", () => {
    const userRepository = new UserRepository();

    it("Normal Scenario works successfully", async () => {
        // register a new user
        const userData = {
            email: "TEST_USER@gmail.com",
            password: "strongpassword",
        }

        const registerResponse = await axios.post("http://localhost:5000/auth/register", userData);
        expect(registerResponse.status).toBe(201);
        expect(registerResponse.data).toEqual({
            user: { id: expect.any(Number), email: userData.email.toLowerCase() },
            token: expect.any(String),
        })

        // login with the new user
        const loginResponse = await axios.post("http://localhost:5000/auth/login", {
            email: userData.email,
            password: userData.password,
        });
        expect(loginResponse.status).toBe(200);
        expect(loginResponse.data).toEqual({
            user: { id: expect.any(Number), email: userData.email.toLowerCase() },
            token: expect.any(String),
        });

        // delete user from database
        const deletedUser = await userRepository.deleteByEmail(userData.email);

        console.debug("Deleted user:", deletedUser);
        expect(deletedUser!.id).toEqual(registerResponse.data.user.id);
    });

    afterAll(async () => {
        await sql.end({ timeout: 5 });
    });
});