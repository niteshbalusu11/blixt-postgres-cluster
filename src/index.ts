import Fastify from "fastify";
import { RegisterRequest } from "./types";
import { createDatabase, getDatabaseURL } from "./create_database";
import {
  createDeployment,
  createPersistentVolumeClaim,
  createService,
} from "./kubernetes-deployment";
import {
  blixtPostgresService,
  postgresDeployment,
  postgresPVC,
} from "./kubernetes-config";
import {
  deleteDeployment,
  deleteService,
  deletePersistentVolumeClaim,
} from "./clean-kubernetes-deployment";

if (!Bun.env.POSTGRES_ADMIN_URL) {
  throw new Error("Missing POSTGRES_ADMIN_URL");
}

if (!Bun.env.POSTGRES_USER) {
  throw new Error("Missing POSTGRES_USER");
}

if (!Bun.env.POSTGRES_PASSWORD) {
  throw new Error("Missing POSTGRES_PASSWORD");
}

const port = !!Bun.env.PORT ? Number(Bun.env.PORT) : 3000;
const fastify = Fastify({
  logger: true,
});

fastify.get("/", async function handler(req, res) {
  return { hello: "world" };
});

fastify.post("/start-resources", async (req, res) => {
  try {
    await createDeployment(postgresDeployment);
    await createService(blixtPostgresService);
    await createPersistentVolumeClaim(postgresPVC);

    res.send({ message: "Resources started successfully" });
  } catch (error) {
    fastify.log.error("Error starting resources:", error);
    res.code(500).send("Failed to start resources");
  }
});

fastify.post("/delete-resources", async (req, res) => {
  try {
    await deleteDeployment("postgres-deployment");
    await deleteService("blixt-postgres-service");
    await deletePersistentVolumeClaim("postgres-pvc");

    res.send("Resources deleted successfully");
  } catch (error) {
    fastify.log.error("Error deleting resources:", error);
    res.code(500).send("Failed to delete resources");
  }
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
