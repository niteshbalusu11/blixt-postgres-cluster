import k8s from "@kubernetes/client-node";

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.AppsV1Api);
const k8sCoreApi = kc.makeApiClient(k8s.CoreV1Api);

export async function deleteDeployment(deploymentName: string) {
  await k8sApi.deleteNamespacedDeployment(deploymentName, "default");
}

export async function deleteService(serviceName: string) {
  await k8sCoreApi.deleteNamespacedService(serviceName, "default");
}

export async function deletePersistentVolumeClaim(pvcName: string) {
  await k8sCoreApi.deleteNamespacedPersistentVolumeClaim(pvcName, "default");
}
