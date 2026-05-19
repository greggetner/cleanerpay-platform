export type Quarter = {
  label: string;
  year: number;
  quarter: 1 | 2 | 3 | 4;
  start: string;
  end: string;
};

export function getCurrentQuarter(date: Date = new Date()): Quarter {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const q = (Math.floor(month / 3) + 1) as 1 | 2 | 3 | 4;
  const startMonth = (q - 1) * 3;
  const endMonth = startMonth + 2;
  const endDay = new Date(Date.UTC(year, endMonth + 1, 0)).getUTCDate();
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    label: `Q${q} ${year}`,
    year,
    quarter: q,
    start: `${year}-${pad(startMonth + 1)}-01`,
    end: `${year}-${pad(endMonth + 1)}-${pad(endDay)}`,
  };
}

export function quarterForDate(iso: string): Quarter {
  return getCurrentQuarter(new Date(iso));
}
