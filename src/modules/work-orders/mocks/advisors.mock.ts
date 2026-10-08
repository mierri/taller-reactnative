export interface MockAdvisor {
  id: string;
  name: string;
  initial: string;
}

export const MOCK_ADVISORS: MockAdvisor[] = [
  { id: "adv-1", name: "Daniel", initial: "D" },
  { id: "adv-2", name: "Carlos M.", initial: "C" },
  { id: "adv-3", name: "Roberto S.", initial: "R" },
  { id: "adv-4", name: "Mariana V.", initial: "M" },
];

export function getMockAdvisors(): MockAdvisor[] {
  return [...MOCK_ADVISORS];
}

