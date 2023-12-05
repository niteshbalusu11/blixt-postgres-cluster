export const postgresDeployment = {
  apiVersion: "apps/v1",
  kind: "Deployment",
  metadata: {
    name: "postgres-deployment",
  },
  spec: {
    selector: {
      matchLabels: {
        app: "postgres",
      },
    },
    replicas: 1,
    template: {
      metadata: {
        labels: {
          app: "postgres",
        },
      },
      spec: {
        containers: [
          {
            name: "postgres",
            image: "postgres:latest",
            env: [
              {
                name: "POSTGRES_USER",
                value: Bun.env.POSTGRES_USER,
              },
              {
                name: "POSTGRES_PASSWORD",
                value: Bun.env.POSTGRES_PASSWORD,
              },
            ],
            ports: [
              {
                containerPort: 5432,
              },
            ],
            volumeMounts: [
              {
                name: "postgres-storage",
                mountPath: "/var/lib/postgresql/data",
              },
            ],
          },
        ],
        volumes: [
          {
            name: "postgres-storage",
            persistentVolumeClaim: {
              claimName: "postgres-pvc",
            },
          },
        ],
      },
    },
  },
};

export const postgresPVC = {
  apiVersion: "v1",
  kind: "PersistentVolumeClaim",
  metadata: {
    name: "postgres-pvc",
  },
  spec: {
    accessModes: ["ReadWriteOnce"],
    resources: {
      requests: {
        storage: "10Gi",
      },
    },
    storageClassName: "standard",
  },
};

export const blixtPostgresService = {
  apiVersion: "v1",
  kind: "Service",
  metadata: {
    name: "blixt-postgres-service",
  },
  spec: {
    type: "ClusterIP",
    selector: {
      app: "postgres",
    },
    ports: [
      {
        protocol: "TCP",
        port: 5432,
        targetPort: 5432,
      },
    ],
  },
};
