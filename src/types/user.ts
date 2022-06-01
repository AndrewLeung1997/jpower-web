export interface User {
    userId: string; // of format 000000x (e.g. 0000002, 0000010)
    userName: string;
    email: string;
    role: "user" | "admin";
}
