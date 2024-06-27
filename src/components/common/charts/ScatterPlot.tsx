import React, { useRef } from "react";
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
  const chartRef = useRef(null); // Add a ref to the chart

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
  const minX = Math.min(...allPoints.map((point) => point.independentVariable));
  const maxX = Math.max(...allPoints.map((point) => point.independentVariable));
  const xPadding = (maxX - minX) * 0.1;

  const minY = Math.min(...allPoints.map((point) => point.dependentVariable));
  const maxY = Math.max(...allPoints.map((point) => point.dependentVariable));
  const yPadding = (maxY - minY) * 0.1;

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
        enabled: true,
        backgroundColor: "#27272a",
        titleColor: "#e4e4e7",
        bodyColor: "#e4e4e7",
        borderColor: "#52525b",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function (tooltipItem: TooltipItem<"line">) {
            const datasetIndex = tooltipItem.datasetIndex;
            const value = tooltipItem.formattedValue;

            if (datasetIndex === 0) {
              return `Error:   (${
                data.datasets[0].data[tooltipItem.dataIndex].xError
              }, ${data.datasets[0].data[tooltipItem.dataIndex].yError})`;
            }

            return "";
          },
          title: function (tooltipItems: TooltipItem<"line">[]) {
            return `Point:   (${tooltipItems[0].label.replace(",", ".")}, ${tooltipItems[0].formattedValue.replace(",", ".")})`;
          },
        },
        filter: function (tooltipItem: TooltipItem<"line">) {
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

            ctx.strokeStyle = dataset.borderColor as string;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x - xPixelError, y);
            ctx.lineTo(x + xPixelError, y);
            ctx.stroke();

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

  const handleExport = () => {
    const chart = chartRef.current as any;
    if (chart) {
      const image = chart.toBase64Image();
      const link = document.createElement("a");
      link.href = image;
      link.download = "chart.png";
      link.click();
    }
  };

  return (
    <div className="flex flex-col w-full relative">
      <Line ref={chartRef} data={data} options={options} />
      <button className="flex flex-row absolute right-7 backdrop-blur-lg top-11 w-fit whitespace-nowrap items-center cursor-pointer text-xs group justify-center text-white shadow-md shadow-zinc-700/10 font-semibold hover:bg-zinc-500 ease-in-out transition-all duration-150 bg-zinc-600 gap-x-1.5 px-2 py-1.5 rounded-md" onClick={handleExport}>Export</button>
    </div>
  );
};

export default MyChart;
