export const PLAN_AMOUNTS: Record<string, number> = {
  monthly: 371,
  annual: 3371,
  vip: 13121,
};

export const getPlanAmount = (planId: string): string => {
  const amount = PLAN_AMOUNTS[planId];
  return amount !== undefined ? `${amount.toFixed(2)}` : '0.00';
};
