"use client";

import { RadioGroup } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/20/solid";
import {
  CalendarIcon,
  ClockIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import React, { FC, ReactElement } from "react";

// Create a List of 20 Fit objects
// Each object has a name, a date and an hour

const TestFits = [
  { id: 1, name: "Fit 1", date: "2022-01-01", hour: "10:00" },
  { id: 2, name: "Fit 2", date: "2022-01-02", hour: "11:00" },
  { id: 3, name: "Fit 3", date: "2022-01-03", hour: "12:00" },
  { id: 4, name: "Fit 4", date: "2022-01-04", hour: "13:00" },
  { id: 5, name: "Fit 5", date: "2022-01-05", hour: "14:00" },
];

const Page: FC = (): ReactElement => {
  return (
    <div className="w-full h-full bg-white/[0.025] backdrop-blur-md ring-1 ring-white/[0.075] ring-inset  px-10 py-5 gap-y-8 flex flex-col rounded-lg">
      <div className="flex flex-row items-end justify-between">
        <div className="flex flex-col items-start">
          <h1 className="text-lg font-semibold text-white">My Fits</h1>
          <p className="text-base text-zinc-500">
            Consult your previous work or create a new fit
          </p>
        </div>
        <Link
          href="/authenticated/fit-env/new/datasets"
          className="flex flex-row items-center cursor-pointer text-sm group justify-center text-white shadow-md shadow-orange-500/10 font-semibold hover:scale-[0.98] ease-in-out transition-all duration-300 bg-orange-500 gap-x-1.5 px-3 py-2 rounded-md"
        >
          New fit
        </Link>
      </div>

      <RadioGroup className="duration-250 ease-in-out animate-in fade-in slide-in-from-left-10">
        <table className="w-full divide-y rounded-b-lg divide-zinc-500 overflow-hidden text-left text-zinc-400 text-sm rtl:text-right">
          {/* Table Header */}
          <thead className="text-zinc-200 ">
            <tr className="table-row items-center">
              <th scope="col" className="py-3 px-6">
                Name
              </th>
              <th scope="col" className="py-3 px-6">
                <div className="flex flex-row items-center gap-x-2">
                  <CalendarIcon className="h-5 w-5 text-orange-400" /> Date
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="flex flex-row items-center gap-x-2">
                  <ClockIcon className="h-5 w-5 text-orange-400" /> Time
                </div>
              </th>
            </tr>
          </thead>
          {/* Table Body */}
          <tbody className="divide-y divide-zinc-500">
            {TestFits.map((fit) => (
              <RadioGroup.Option
                key={fit.id}
                value={fit}
                // To Do: Add an onClick event to navigate to the Fit page
                className="group table-row items-center transition duration-300 ease-in-out hover:cursor-pointer hover:bg-zinc-600 hover:bg-opacity-20"
                as="tr"
              >
                <th scope="row" className="py-3 px-6">
                  <div className="flex flex-col font-normal">
                    <p className="whitespace-nowrap ">{fit.name}</p>
                  </div>
                </th>

                <td className=" py-3 font-medium px-6">{fit.date}</td>
                <td className=" py-3 font-medium px-6">{fit.hour}</td>
              </RadioGroup.Option>
            ))}
          </tbody>
        </table>
      </RadioGroup>
    </div>
  );
};

export default Page;
