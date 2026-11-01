const MONTH_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTH_SHORT = [
  "jan", "feb", "mar", "apr", "may", "jun",
  "jul", "aug", "sep", "oct", "nov", "dec",
];

const pad = (n: number) => String(n).padStart(2, "0");

export type ComputedCohort = {
  name: string;
  startsOn: string;
  price: string;
  slug: string;
  startDate: string;
  endDate: string;
};

export function computeCohortForDate(today: Date = new Date()): ComputedCohort {
  const y = today.getUTCFullYear();
  const m = today.getUTCMonth();
  const d = today.getUTCDate();

  let sY: number, sM: number, sD: number;
  if (d <= 1) {
    sY = y; sM = m; sD = 1;
  } else if (d <= 16) {
    sY = y; sM = m; sD = 16;
  } else if (m === 11) {
    sY = y + 1; sM = 0; sD = 1;
  } else {
    sY = y; sM = m + 1; sD = 1;
  }

  const eD = sD === 1 ? 15 : new Date(Date.UTC(sY, sM + 1, 0)).getUTCDate();
  const startDate = `${sY}-${pad(sM + 1)}-${pad(sD)}`;
  const endDate = `${sY}-${pad(sM + 1)}-${pad(eD)}`;
  const monthLong = MONTH_LONG[sM];

  return {
    name: `${monthLong} ${sD === 1 ? "1st" : "16th"} Cohort`,
    startsOn: `${monthLong} ${sD}`,
    price: "₹199",
    slug: `${MONTH_SHORT[sM]}-${pad(sD)}-${sY}`,
    startDate,
    endDate,
  };
}

export const COHORT: ComputedCohort = new Proxy({} as ComputedCohort, {
  get(_, prop) {
    return computeCohortForDate()[prop as keyof ComputedCohort];
  },
});
