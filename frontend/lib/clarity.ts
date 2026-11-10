export async function initClarity() {
  const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

  if (!projectId) {
    return;
  }

  const { default: Clarity } = await import("@microsoft/clarity");
  Clarity.init(projectId);
}
