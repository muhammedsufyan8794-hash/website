const express = require("express");
const fetch = require("node-fetch");
const app = express();

const BOT_TOKEN = "YOUR_BOT_TOKEN_HERE"; // <-- PUT YOUR BOT TOKEN HERE

app.use(express.static(__dirname));

app.get("/api/user", async (req, res) => {
    const userId = req.query.id;
    if (!userId) return res.json({ error: "No ID provided" });

    try {
        const response = await fetch(`https://discord.com/api/v10/users/${userId}`, {
            headers: {
                Authorization: `Bot ${BOT_TOKEN}`
            }
        });

        if (!response.ok) return res.json({ error: "User not found" });

        const user = await response.json();

        const avatar = user.avatar
            ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=512`
            : `https://cdn.discordapp.com/embed/avatars/0.png`;

        const banner = user.banner
            ? `https://cdn.discordapp.com/banners/${user.id}/${user.banner}.png?size=1024`
            : null;

        const createdAt = new Date((BigInt(user.id) >> 22n) + 1420070400000n);

        res.json({
            username: `${user.username}`,
            avatar,
            banner,
            createdAt: createdAt.toUTCString()
        });

    } catch (err) {
        res.json({ error: "Error fetching user" });
    }
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
