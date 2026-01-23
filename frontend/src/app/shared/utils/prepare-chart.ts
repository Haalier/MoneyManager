import { TransactionType } from '../enums/transactions.enum';
import { Income } from '../models/income.model';

interface IncomeGroup {
  date: string;
  totalAmount: number;
  items: Income[];
}

export const prepareChartData = (
  data: Income[],
  currentLang: string = 'pl',
  type: TransactionType,
) => {
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

  const isExpense = type === TransactionType.EXPENSE;
  const color = isExpense ? '#ef4444' : '#22c55e';
  const bgColor = isExpense ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)';
  const label = isExpense
    ? currentLang === 'pl'
      ? 'Wydatki'
      : 'Expenses'
    : currentLang === 'pl'
      ? 'Dochody'
      : 'Incomes';

  return {
    labels: sortedChartData.map((group) =>
      new Date(group.date).toLocaleDateString(currentLang, {
        day: 'numeric',
        month: 'short',
      }),
    ),
    datasets: [
      {
        label: label,
        data: sortedChartData.map((group) => group.totalAmount),
        extraData: sortedChartData,
        borderColor: color,
        backgroundColor: bgColor,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: color,
      },
    ],
  };
};
