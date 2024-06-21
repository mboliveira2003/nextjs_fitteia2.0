import type { Metadata } from "next";
import { Head } from "next/document";

import "./globals.css";
import BlockSmallScreens from "@/components/visuals/BlockSmallSreens";

export const metadata: Metadata[] = [
  {
    title: "Fitteia2.0",
    description:
      "Fitteia2.0 is a fitting environment designed for students and researchers alike, based on the fitting engine one-fite.",
    applicationName: "Fitteia2.0",
    keywords: [
      "Data Fitting",
      "Curve Fitting",
      "Function Approximation",
      "Regression Analysis",
      "Mathematical Modeling",
      "Optimization Algorithms",
      "Data Analysis Tool",
      "Curve Optimization",
      "Best Fit Functions",
      "Parameter Estimation",
      "Nonlinear Regression",
      "Model Selection",
      "Data Science Tool",
      "Statistical Modeling",
      "Numerical Methods",
      "Predictive Modeling",
      "Pattern Recognition",
      "Mathematical Optimization",
      "Curve Matching",
      "Graphical Analysis",
    ],
    viewport: { width: "device-width", initialScale: 1 },
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.svg" />
      </head>
      <body>
        {/*This will block small screens from accessing the platform*/}
        <div className="lg:hidden">
          <BlockSmallScreens />
        </div>
        <div className="hidden lg:block">{children}</div>
      </body>
    </html>
  );
}
