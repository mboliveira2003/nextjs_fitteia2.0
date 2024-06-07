import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { ChartData } from "chart.js/auto";
import { Datapoint } from "@/app/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface MyChartProps {
  dataPoints: Datapoint[];
  fittedPoints: Datapoint[];
}

const MyChart: React.FC<MyChartProps> = ({ dataPoints, fittedPoints }) => {

  const formatData = (points: Datapoint[]) => points.map(point => ({
    x: point.independentVariable,
    y: point.dependentVariable,
    xError: point.independentVariableError,
    yError: point.dependentVariableError
  }));


  const data: ChartData<"line"> = {
    labels: [
      ...new Set([
        ...dataPoints.map((point) => point.independentVariable),
        ...fittedPoints.map((point) => point.dependentVariable),
      ]),
    ].sort((a, b) => a - b),
    datasets: [
      {
        label: "Dataset 1",
        data: formatData(dataPoints),
        borderColor: "white",
        backgroundColor: "white",
        fill: false,
        showLine: false,
        pointRadius: 5,
        parsing: {
          xAxisKey: "x",
          yAxisKey: "y",
        },
      },
      {
        label: "Fitted Function",
        data: formatData(fittedPoints),
        borderColor: "#f97316",
        backgroundColor: "#f97316",
        fill: false,
        pointRadius: 0,
        borderWidth: 2,
        parsing: {
          xAxisKey: "x",
          yAxisKey: "y",
        },
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Function 1 - Dataset 1",
      },
    },
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        grid: {
          z: 1,
          drawOnChartArea: true,
          color: "rgba(255, 255, 255, 0.2)",
        },
        ticks: {
          color: "white", // Change this to your desired color
        },
      },
      y: {
        type: "linear",
        position: "left",
        grid: {
          z: 1,
          drawOnChartArea: true,
          color: "rgba(255, 255, 255, 0.2)",
        },
        ticks: {
          color: "white", // Change this to your desired color
        },
      },
    },
    elements: {
      line: {
        borderWidth: 2,
        tension: 0.4,
      },
      point: {
        radius: 5,
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default MyChart;
