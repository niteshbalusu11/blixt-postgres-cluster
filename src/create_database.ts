import { Client } from "pg";

type CreateDatabaseArgs = {
  username: string;
  password: string;
};
export const createDatabase = async (args: CreateDatabaseArgs) => {
  const client = new Client({
    connectionString: Bun.env.POSTGRES_ADMIN_URL, // Admin connection URL
  });

  try {
    await client.connect();

    // Create a new database for the user
    await client.query(`CREATE DATABASE "${args.username}";`);

    // Create a user and grant them privileges on the new database
    await client.query(
      `CREATE USER "${args.username}" WITH PASSWORD '${args.password}';`
    );
    await client.query(
      `GRANT ALL PRIVILEGES ON DATABASE "${args.username}" TO "${args.username}";`
    );
  } catch (error) {
    console.error("Error creating database:", error);
    throw error;
  } finally {
    await client.end();
  }
};

type GetDatabaseURLArgs = {
  username: string;
  password: string;
};
export const getDatabaseURL = (args: GetDatabaseURLArgs) => {
  // Modify this based on your PostgreSQL service in Kubernetes
  const host = "blixt-postgres-service";
  const dbUrl = `postgresql://${args.username}:${args.password}@${host}/${args.username}`;
  return dbUrl;
};
