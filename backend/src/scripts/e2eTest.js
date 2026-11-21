import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import app from "../app.js";
import connectDB from "../config/db.js";

async function runE2ETests() {
    console.log("==================================================");
    console.log("   LendX Full-Stack End-to-End Test Suite        ");
    console.log("==================================================\n");

    let mongod;
    let server;
    const port = 5099;
    const baseUrl = `http://localhost:${port}`;

    try {
        // Step 1: Start In-Memory MongoDB Server
        console.log("[1/8] Starting in-memory MongoDB server...");
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        process.env.MONGO_URI = uri;
        process.env.JWT_SECRET = "super_secret_e2e_jwt_key_1234567890";
        process.env.JWT_EXPIRES_IN = "1d";

        await connectDB();
        console.log("✔ Connected to in-memory MongoDB at:", uri);

        // Step 2: Start Express Application
        console.log("\n[2/8] Starting Express server on port", port, "...");
        await new Promise((resolve) => {
            server = app.listen(port, resolve);
        });
        console.log("✔ Express server running at", baseUrl);

        // Step 3: Test Health Endpoint
        console.log("\n[3/8] Testing Health API...");
        const healthRes = await fetch(`${baseUrl}/api/health`);
        const healthData = await healthRes.json();
        console.log("  Health response:", healthData);
        if (healthRes.status !== 200 || !healthData.success) {
            throw new Error("Health check failed!");
        }
        console.log("✔ Health API check PASSED");

        // Step 4: Test CORS Rules
        console.log("\n[4/8] Testing CORS Configuration...");
        const corsTests = [
            { origin: "http://localhost:5173", expectedAllowed: true, label: "Local Vite Port 5173" },
            { origin: "http://localhost:3000", expectedAllowed: true, label: "Local Port 3000" },
            { origin: "http://127.0.0.1:5174", expectedAllowed: true, label: "127.0.0.1 Port 5174" },
            { origin: "https://lendx-preview.vercel.app", expectedAllowed: true, label: "Vercel Preview Domain" },
            { origin: "https://lend-x-cfh2.vercel.app", expectedAllowed: true, label: "Production Vercel Domain" },
            { origin: "https://malicious-site.com", expectedAllowed: false, label: "Untrusted Origin" }
        ];

        for (const test of corsTests) {
            const res = await fetch(`${baseUrl}/api/health`, {
                headers: { Origin: test.origin }
            });
            const allowHeader = res.headers.get("access-control-allow-origin");
            if (test.expectedAllowed) {
                if (allowHeader !== test.origin) {
                    throw new Error(`CORS check failed for ${test.label}: expected ${test.origin}, got ${allowHeader}`);
                }
            } else {
                if (allowHeader === test.origin) {
                    throw new Error(`CORS check failed for ${test.label}: untrusted origin was allowed`);
                }
            }
            console.log(`  ✔ CORS check for ${test.label}: ${test.expectedAllowed ? "ALLOWED" : "BLOCKED"} correctly`);
        }
        console.log("✔ CORS verification PASSED");

        // Step 5: Test Auth Flow (Register, Login, Profile)
        console.log("\n[5/8] Testing Authentication Flow...");

        // Register Lender
        const lenderRes = await fetch(`${baseUrl}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Chandu Lender",
                email: "chandu@example.com",
                password: "Password123"
            })
        });
        const lenderData = await lenderRes.json();
        if (lenderRes.status !== 201 || !lenderData.data?.token) {
            throw new Error(`Lender registration failed: ${JSON.stringify(lenderData)}`);
        }
        const lenderToken = lenderData.data.token;
        const lenderId = lenderData.data.user._id;
        console.log("  ✔ User 1 (Lender) registered:", lenderData.data.user.email);

        // Register Borrower
        const borrowerRes = await fetch(`${baseUrl}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Rahul Borrower",
                email: "rahul@example.com",
                password: "Password123"
            })
        });
        const borrowerData = await borrowerRes.json();
        if (borrowerRes.status !== 201 || !borrowerData.data?.token) {
            throw new Error(`Borrower registration failed: ${JSON.stringify(borrowerData)}`);
        }
        const borrowerToken = borrowerData.data.token;
        const borrowerId = borrowerData.data.user._id;
        console.log("  ✔ User 2 (Borrower) registered:", borrowerData.data.user.email);

        // Login Lender
        const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: "chandu@example.com",
                password: "Password123"
            })
        });
        const loginData = await loginRes.json();
        if (loginRes.status !== 200 || !loginData.data?.token) {
            throw new Error(`Login failed: ${JSON.stringify(loginData)}`);
        }
        console.log("  ✔ Login succeeded with valid token");

        // Profile check
        const meRes = await fetch(`${baseUrl}/api/auth/me`, {
            headers: { Authorization: `Bearer ${lenderToken}` }
        });
        const meData = await meRes.json();
        if (meRes.status !== 200 || meData.data?.user?.email !== "chandu@example.com") {
            throw new Error(`Profile check failed: ${JSON.stringify(meData)}`);
        }
        console.log("  ✔ Profile fetch /api/auth/me succeeded:", meData.data.user.name);
        console.log("✔ Authentication verification PASSED");

        // Step 6: Test Item Creation & MongoDB Validation Errors Fix
        console.log("\n[6/8] Testing Item Creation & Validation (Fix #3 Verification)...");

        // 6a. Attempt to create item with empty payload -> must return 400 Bad Request
        const invalidItemRes = await fetch(`${baseUrl}/api/items`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${lenderToken}`
            },
            body: JSON.stringify({})
        });
        const invalidItemData = await invalidItemRes.json();
        if (invalidItemRes.status !== 400) {
            throw new Error(`Expected 400 for empty item creation, got ${invalidItemRes.status}`);
        }
        console.log("  ✔ Empty item payload correctly rejected with 400 Bad Request");

        // 6b. Create item with full payload
        const item1Res = await fetch(`${baseUrl}/api/items`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${lenderToken}`
            },
            body: JSON.stringify({
                title: "Sony Alpha A7 Camera",
                description: "Full frame mirrorless camera with 24-70mm lens",
                category: "Photography",
                condition: "like-new",
                pricePerDay: 500,
                securityDeposit: 2000,
                address: "Koramangala, Bengaluru",
                images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500"]
            })
        });
        const item1Data = await item1Res.json();
        if (item1Res.status !== 201 || !item1Data.data?._id) {
            throw new Error(`Item 1 creation failed: ${JSON.stringify(item1Data)}`);
        }
        const item1Id = item1Data.data._id;
        console.log("  ✔ Full item created successfully:", item1Data.data.title, "(ID:", item1Id, ")");

        // 6c. Create item with frontend form aliases (price instead of pricePerDay, image instead of images)
        const item2Res = await fetch(`${baseUrl}/api/items`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${lenderToken}`
            },
            body: JSON.stringify({
                title: "DJI Mavic Pro Drone",
                description: "4K video recording drone with extra batteries",
                category: "Electronics",
                condition: "good",
                price: 850, // alias for pricePerDay
                address: "Indiranagar, Bengaluru",
                image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=500" // alias for images
            })
        });
        const item2Data = await item2Res.json();
        if (item2Res.status !== 201 || item2Data.data.pricePerDay !== 850) {
            throw new Error(`Item 2 creation with aliases failed: ${JSON.stringify(item2Data)}`);
        }
        console.log("  ✔ Item created with aliases normalized successfully: pricePerDay =", item2Data.data.pricePerDay, ", images =", item2Data.data.images);
        console.log("✔ Item creation & validation PASSED");

        // Step 7: Test Item Listing & Filtering
        console.log("\n[7/8] Testing Item Exploration & Search API...");
        const allItemsRes = await fetch(`${baseUrl}/api/items`);
        const allItemsData = await allItemsRes.json();
        if (allItemsRes.status !== 200 || allItemsData.data.items.length !== 2) {
            throw new Error(`Expected 2 items, got: ${JSON.stringify(allItemsData)}`);
        }
        console.log("  ✔ All active items returned:", allItemsData.data.items.length, "items");

        // Filter by category
        const catRes = await fetch(`${baseUrl}/api/items?category=Photography`);
        const catData = await catRes.json();
        if (catRes.status !== 200 || catData.data.items.length !== 1 || catData.data.items[0].category !== "Photography") {
            throw new Error(`Category filter failed: ${JSON.stringify(catData)}`);
        }
        console.log("  ✔ Category filter matched:", catData.data.items[0].title);

        // Filter by title
        const searchRes = await fetch(`${baseUrl}/api/items?title=Drone`);
        const searchData = await searchRes.json();
        if (searchRes.status !== 200 || searchData.data.items.length !== 1) {
            throw new Error(`Search filter failed: ${JSON.stringify(searchData)}`);
        }
        console.log("  ✔ Title search matched:", searchData.data.items[0].title);
        console.log("✔ Item exploration & search PASSED");

        // Step 8: Test Booking Flow
        console.log("\n[8/8] Testing Booking Workflow...");

        // 8a. Lender attempts to book their own item -> must fail with 400
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dayAfterTomorrow = new Date();
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 3);

        const selfBookingRes = await fetch(`${baseUrl}/api/bookings`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${lenderToken}`
            },
            body: JSON.stringify({
                itemId: item1Id,
                startDate: tomorrow.toISOString(),
                endDate: dayAfterTomorrow.toISOString()
            })
        });
        if (selfBookingRes.status !== 400) {
            throw new Error(`Expected 400 for self-booking, got ${selfBookingRes.status}`);
        }
        console.log("  ✔ Booking own item correctly blocked with 400");

        // 8b. Borrower creates booking request for Lender's item
        const bookingRes = await fetch(`${baseUrl}/api/bookings`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${borrowerToken}`
            },
            body: JSON.stringify({
                itemId: item1Id,
                startDate: tomorrow.toISOString(),
                endDate: dayAfterTomorrow.toISOString()
            })
        });
        const bookingData = await bookingRes.json();
        if (bookingRes.status !== 201 || !bookingData.data?.booking?._id) {
            throw new Error(`Booking creation failed: ${JSON.stringify(bookingData)}`);
        }
        const bookingId = bookingData.data.booking._id;
        console.log("  ✔ Booking request created by Borrower. ID:", bookingId, "Status:", bookingData.data.booking.status);

        // 8c. Lender views my bookings
        const lenderBookingsRes = await fetch(`${baseUrl}/api/bookings`, {
            headers: { Authorization: `Bearer ${lenderToken}` }
        });
        const lenderBookingsData = await lenderBookingsRes.json();
        if (lenderBookingsRes.status !== 200 || lenderBookingsData.data.bookings.length !== 1) {
            throw new Error(`Lender bookings fetch failed: ${JSON.stringify(lenderBookingsData)}`);
        }
        console.log("  ✔ Lender retrieved pending booking request for approval");

        // 8d. Lender approves booking
        const approveRes = await fetch(`${baseUrl}/api/bookings/${bookingId}/approve`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${lenderToken}` }
        });
        const approveData = await approveRes.json();
        if (approveRes.status !== 200 || approveData.data.booking.status !== "approved") {
            throw new Error(`Booking approval failed: ${JSON.stringify(approveData)}`);
        }
        console.log("  ✔ Booking approved successfully. New status:", approveData.data.booking.status);
        console.log("✔ Booking workflow PASSED");

        console.log("\n==================================================");
        console.log("   🎉 ALL END-TO-END TESTS PASSED SUCCESSFULLY!   ");
        console.log("==================================================");

    } catch (error) {
        console.error("\n❌ E2E TEST FAILED:", error);
        process.exitCode = 1;
    } finally {
        if (server) {
            await new Promise((resolve) => server.close(resolve));
            console.log("\nServer stopped.");
        }
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
            console.log("Mongoose disconnected.");
        }
        if (mongod) {
            await mongod.stop();
            console.log("In-memory MongoDB stopped.");
        }
    }
}

runE2ETests();
