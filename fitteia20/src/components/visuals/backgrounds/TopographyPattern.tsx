import { FC } from "react";

const TopographyPattern: FC = () => {
  return (
    <>
      <div className="fixed inset-0 -z-30 h-full w-full bg-zinc-900" />

      <div
        className="fixed inset-0 -z-30 h-full w-full bg-zinc-900 opacity-70"
        style={{ backgroundImage: "url(/topography.svg)" }}
      />

      <div className="opacity-100 bg-gradient-to-tr from-zinc-900 via-zinc-900/90 to-transparent  fixed left-0 -z-30 h-full w-full" />
      <div className="opacity-100 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-zinc-900/90 to-transparent  fixed inset-0 -z-30 h-full w-full" />
    
    </>
  );
};

export default TopographyPattern;
