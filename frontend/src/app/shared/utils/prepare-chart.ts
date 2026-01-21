import { Income } from '../models/income.model';

interface IncomeGroup {
  date: string;
  totalAmount: number;
  items: Income[];
}

export const prepareChartData = (data: Income[], currentLang: string = 'pl') => {
  const groupedByDate = data.reduce((acc: Record<string, IncomeGroup>, item) => {
    const dateKey = item.date;

    if (!acc[dateKey]) {
      acc[dateKey] = {
        date: dateKey,
        totalAmount: 0,
        items: [],
      };
    }

    acc[dateKey].totalAmount += item.amount;
    acc[dateKey].items.push(item);
    return acc;
  }, {});

  const sortedChartData = Object.values(groupedByDate).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  return {
    labels: sortedChartData.map((group) =>
      new Date(group.date).toLocaleDateString(currentLang, {
        day: 'numeric',
        month: 'short',
      }),
    ),
    datasets: [
      {
        label: currentLang === 'pl' ? 'Dochód' : 'Incomes',
        data: sortedChartData.map((group) => group.totalAmount),
        extraData: sortedChartData,
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#22c55e',
      },
    ],
  };
};
