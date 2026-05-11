export type TaskVehicle = {
  TaskID: string;
  Duration: number;
  Impact: number;
};

export const optimizeTasks = (vehicles: TaskVehicle[], maxHours: number) => {
  const n = vehicles.length;

  const capacity = Math.max(0, Math.floor(maxHours));

  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    Array(capacity + 1).fill(0)
  );

  for (let i = 1; i <= n; i++) {
    const vehicle = vehicles[i - 1];

    const duration = Math.max(0, Math.floor(vehicle.Duration));
    const impact = vehicle.Impact;

    for (let w = 0; w <= capacity; w++) {
      if (duration <= w) {
        dp[i][w] = Math.max(
          impact + dp[i - 1][w - duration],
          dp[i - 1][w]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  let w = capacity;
  const selectedTasks: TaskVehicle[] = [];

  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      const chosen = vehicles[i - 1];
      selectedTasks.push(chosen);
      w -= Math.max(0, Math.floor(chosen.Duration));
    }
  }

  const totalHours = selectedTasks.reduce(
    (sum, t) => sum + Math.max(0, Math.floor(t.Duration)),
    0
  );

  return {
    totalImpact: dp[n][capacity],
    totalHours,
    selectedTasks,
  };
};
