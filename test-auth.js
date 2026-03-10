async function testAuth() {
    try {
        console.log("Testing Registration...");
        const regRes = await fetch("http://localhost:3000/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Test User 2",
                email: "test.user2@vishnu.edu.in",
                password: "password123",
                phoneNumber: "1234567890",
                collegeName: "Vishnu Institute"
            })
        });
        const regData = await regRes.json();
        console.log("Register response:", regRes.status, regData);

        if (regRes.status === 201 || regRes.status === 409) {
            console.log("\nTesting Login...");
            const loginRes = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: "test.user2@vishnu.edu.in",
                    password: "password123"
                })
            });
            const loginData = await loginRes.json();
            console.log("Login response:", loginRes.status, loginData);
        }
    } catch (err) {
        console.error("Test failed:", err);
    }
}
testAuth();
