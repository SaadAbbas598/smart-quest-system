import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = () => {
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'], // Months
    datasets: [
      {
        label: 'Total Complaints',
        data: [12, 19, 8, 15, 10, 14, 7], // Example data for total complaints
        backgroundColor: '#4F46E5', // Indigo-600
        borderColor: '#4F46E5', // Indigo-600
        borderWidth: 1,
      },
      {
        label: 'Processed Complaints',
        data: [8, 14, 6, 12, 9, 10, 5], // Example data for processed complaints
        backgroundColor: '#10B981', // Emerald-500
        borderColor: '#10B981', // Emerald-500
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow custom sizing
    plugins: {
      title: {
        display: true,
        text: 'Monthly Complaints Overview', // Chart title
        font: {
          size: 18,
          weight: 'bold',
        },
      },
      legend: {
        position: 'top', // Position the legend at the top
        labels: {
          font: {
            size: 14,
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Months', // X-axis label
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Complaints', // Y-axis label
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        ticks: {
          font: {
            size: 12,
          },
        },
        beginAtZero: true, // Start Y-axis from 0
      },
    },
  };

  return (
    <div className="w-full h-[400px] sm:w-11/12 md:w-3/4 lg:w-2/3 mx-auto"> {/* Make chart responsive */}
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
