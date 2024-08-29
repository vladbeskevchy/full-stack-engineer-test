interface Jwt {
    token: string;
    user: object;
}

const auth = {
    isAuthenticated(): Jwt | false {
        if (typeof window === "undefined") return false;
        const jwt = sessionStorage.getItem('jwt');
        return jwt ? JSON.parse(jwt) : false;
    },
    authenticate(jwt: Jwt, cb: () => void): void {
        if (typeof window !== "undefined") {
            sessionStorage.setItem('jwt', JSON.stringify(jwt));
        }
        cb();
    },
};

export default auth;
