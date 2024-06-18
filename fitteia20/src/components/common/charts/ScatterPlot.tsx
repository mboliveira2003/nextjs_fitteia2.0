import React from "react";
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
  ChartData,
  Plugin,
  ChartType,
  Scale,
  LinearScaleOptions,
  TooltipItem,
  ChartDataset,
} from "chart.js";
import { Datapoint, FittedDatapoint } from "@/app/types";

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
  fittedPoints: FittedDatapoint[];
  functionName: string;
  datasetName: string;
  independentVariableName: string;
  dependentVariableName: string;
  datasetOnly?: boolean;
}

interface DataPointWithError {
  x: number;
  y: number;
  xError: number;
  yError: number;
}

const formatData = (
  points: Datapoint[] | FittedDatapoint[]
): DataPointWithError[] =>
  points.map((point) => ({
    x: point.independentVariable,
    y: point.dependentVariable,
    xError:
      "independentVariableError" in point
        ? point.independentVariableError ?? 0
        : 0,
    yError:
      "dependentVariableError" in point ? point.dependentVariableError ?? 0 : 0,
  }));

const MyChart: React.FC<MyChartProps> = ({
  dataPoints,
  fittedPoints,
  datasetName,
  functionName,
  independentVariableName,
  dependentVariableName,
  datasetOnly = false,
}) => {

  console.log("Fitted Points Scatter Plot:", fittedPoints)
  console.log("Dataset Only Scatter Plot:", datasetOnly)

  const datasets: ChartDataset<"line", DataPointWithError[]>[] = [];

  datasets.push({
    label: datasetName,
    data: formatData(dataPoints),
    borderColor: "white",
    backgroundColor: "white",
    fill: false,
    showLine: false,
    pointRadius: 4,
    parsing: false,
  });

  if (!datasetOnly) {
    datasets.push({
      label: "Fitted " + functionName,
      data: formatData(fittedPoints),
      borderColor: "#f97316",
      backgroundColor: "#f97316",
      fill: false,
      pointRadius: 0,
      borderWidth: 2,
      parsing: false,
    });
  }

  const allPoints = [...dataPoints, ...fittedPoints];
  // Calculate the min and max values for x-axis with padding
  const minX = Math.min(...allPoints.map((point) => point.independentVariable));
  const maxX = Math.max(...allPoints.map((point) => point.independentVariable));
  const xPadding = (maxX - minX) * 0.1; // 10% padding on each side

  // Calculate the min and max values for y-axis with padding
  const minY = Math.min(...allPoints.map((point) => point.dependentVariable));
  const maxY = Math.max(...allPoints.map((point) => point.dependentVariable));
  const yPadding = (maxY - minY) * 0.1; // 10% padding on each side

  const data: ChartData<"line", DataPointWithError[]> = {
    labels: [
      ...new Set([
        ...dataPoints.map((point) => point.independentVariable),
        ...fittedPoints.map((point) => point.dependentVariable),
      ]),
    ].sort((a, b) => a - b),
    datasets,
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#e4e4e7",
          font: {
            size: 12,
            weight: "bold",
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        enabled: true, // Ensure tooltips are enabled
        backgroundColor: "#27272a", // Background color
        titleColor: "#e4e4e7", // Title text color
        bodyColor: "#e4e4e7", // Body text color
        borderColor: "#52525b", // Border color
        borderWidth: 1, // Border width
        padding: 12, // Padding around the content
        displayColors: false, // Do not show color boxes
        callbacks: {
          // Custom callback to format the tooltip
          label: function (tooltipItem: TooltipItem<"line">) {
            const datasetIndex = tooltipItem.datasetIndex;
            const value = tooltipItem.formattedValue;

            // Show tooltip only for the first dataset
            if (datasetIndex === 0) {
              // Customize tooltip content for Dataset 1
              return `Error:   (${
              data.datasets[0].data[tooltipItem.dataIndex].xError
              }, ${data.datasets[0].data[tooltipItem.dataIndex].yError})`;
            }

            // Return an empty string to effectively hide the tooltip for other datasets
            return "";
          },
          title: function (tooltipItems: TooltipItem<"line">[]) {
            return `Point:   (${tooltipItems[0].label.replace(",", ".")}, ${tooltipItems[0].formattedValue.replace(",", ".")})`;
          },
        },
        filter: function (tooltipItem: TooltipItem<"line">) {
          // Show tooltip only for the first dataset
          return tooltipItem.datasetIndex === 0;
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: independentVariableName,
          color: "#e4e4e7",
          font: {
            size: 12,
            weight: "bold",
          },
        },
        type: "linear",
        position: "bottom",
        grid: {
          z: 0,
          drawOnChartArea: true,
          color: "rgba(255, 255, 255, 0.15)",
        },
        ticks: {
          color: "white",
        },
        min: minX - xPadding,
        max: maxX + xPadding,
      },
      y: {
        title: {
          display: true,
          text: dependentVariableName,
          color: "#e4e4e7",
          font: {
            size: 12,
            weight: "bold",
          },
        },
        type: "linear",
        position: "left",
        grid: {
          z: 0,
          drawOnChartArea: true,
          color: "rgba(255, 255, 255, 0.15)",
        },
        ticks: {
          color: "white",
        },
        min: minY - yPadding,
        max: maxY + yPadding,
      }
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

  const errorBarPlugin: Plugin<ChartType> = {
    id: "errorBars",
    afterDatasetsDraw: (chart) => {
      const ctx = chart.ctx;

      // Corrected scale type usage
      const xScale = chart.scales["x"] as unknown as Scale<LinearScaleOptions>;
      const yScale = chart.scales["y"] as unknown as Scale<LinearScaleOptions>;

      const meta = chart.getDatasetMeta(0);
      const dataset = chart.data.datasets[0];

      if (!meta.hidden) {
        meta.data.forEach((element, index) => {
          const data = dataset.data[index] as DataPointWithError;
          if (data && data.xError !== undefined && data.yError !== undefined) {
            const { x, y } = element.tooltipPosition(false);

            const xPixelError =
              xScale.getPixelForValue(data.x + data.xError) -
              xScale.getPixelForValue(data.x);
            const yPixelError =
              y - yScale.getPixelForValue(data.y - data.yError);

            // Draw horizontal error bars
            ctx.strokeStyle = dataset.borderColor as string;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x - xPixelError, y);
            ctx.lineTo(x + xPixelError, y);
            ctx.stroke();

            // Draw vertical error bars
            ctx.beginPath();
            ctx.moveTo(x, y - yPixelError);
            ctx.lineTo(x, y + yPixelError);
            ctx.stroke();
          }
        });
      }
    },
  };

  ChartJS.register(errorBarPlugin);

  return <Line data={data} options={options} />;
};

export default MyChart;
