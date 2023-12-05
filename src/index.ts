import Fastify from "fastify";
import { RegisterRequest } from "./types";
import { createDatabase, getDatabaseURL } from "./create_database";

if (!Bun.env.POSTGRES_ADMIN_URL) {
  throw new Error("Missing POSTGRES_ADMIN_URL");
}

const port = !!Bun.env.PORT ? Number(Bun.env.PORT) : 3000;
const fastify = Fastify({
  logger: true,
});

fastify.get("/", async function handler(req, res) {
  return { hello: "world" };
});

fastify.post("/register", async (req, res) => {
  const { username, password } = req.body as RegisterRequest;

  if (!username || !password) {
    fastify.log.error("Missing username or password");
    res.code(400).send({ message: "Username and password are required" });
  }

  try {
    // Create a new database for the user
    await createDatabase({ username, password });

    // Generate the database connection URL
    const dbUrl = getDatabaseURL({ username, password });

    // Return the database URL
    res.code(200).send({ dbUrl });
  } catch (error) {
    fastify.log.error("Registration error:", error);
    res.code(500).send("Error during registration");
  }
});

// Run the server!
try {
  await fastify.listen({ port, host: "0.0.0.0" });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
