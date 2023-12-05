# blixt-postgres-cluster

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run .
```

```bash
# Deploy kubernetes files
kubectl apply -f kubernetes/postgres-secret.yaml

kubectl apply -f kubernetes/postgres-pvc.yaml

kubectl apply -f kubernetes/postgres-deployment.yaml

kubectl apply -f kubernetes/postgres-service.yaml
```

This project was created using `bun init` in bun v1.0.15. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
