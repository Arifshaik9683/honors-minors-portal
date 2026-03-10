import fs from 'fs';

async function test() {
    let out = [];
    out.push("Registering...");
    const regRes = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: "Test",
            email: "test6@vishnu.edu.in",
            password: "password123",
            phoneNumber: "1234567890",
            collegeName: "Vishnu"
        })
    });
    out.push(JSON.stringify(await regRes.json()));

    out.push("Logging in...");
    const loginRes = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: "test6@vishnu.edu.in",
            password: "password123"
        })
    });
    out.push(loginRes.status.toString());
    out.push(await loginRes.text());

    fs.writeFileSync('test-out.txt', out.join('\n'));
}
test();
