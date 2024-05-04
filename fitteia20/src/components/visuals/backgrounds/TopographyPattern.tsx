import { FC } from "react";

const TopographyPattern: FC = () => {
  return (
    <>
      <div className="fixed inset-0 -z-30 h-full w-full bg-[#1B0300]" />

      <div
        className="fixed inset-0 -z-30 h-full w-full bg-[#1B0300] opacity-30"
        style={{ backgroundImage: "url(/topography.svg)" }}
      />
    </>
  );
};

export default TopographyPattern;
