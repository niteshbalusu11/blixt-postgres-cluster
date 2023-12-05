import k8s from "@kubernetes/client-node";

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.AppsV1Api);
const k8sCoreApi = kc.makeApiClient(k8s.CoreV1Api);

export async function createDeployment(deployment: k8s.V1Deployment) {
  await k8sApi.createNamespacedDeployment("default", deployment);
}

export async function createService(service: k8s.V1Service) {
  await k8sCoreApi.createNamespacedService("default", service);
}

export async function createPersistentVolumeClaim(
  pvc: k8s.V1PersistentVolumeClaim
) {
  await k8sCoreApi.createNamespacedPersistentVolumeClaim("default", pvc);
}
