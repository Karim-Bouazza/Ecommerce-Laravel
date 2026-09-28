import Clarity from "@microsoft/clarity";

export function initClarity() {
  const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

  if (!projectId) {
    return;
  }

  Clarity.init(projectId);
}
