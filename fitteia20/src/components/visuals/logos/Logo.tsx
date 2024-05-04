import { FC } from "react";

/** This component is the Ward logo.
 */

const Logo: FC = () => {
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
      <h3 className="text-center text-4xl font-bold text-orange-600 relative">
        Fitteia<span className="text-white">2.</span>
      </h3>
    </div>
  );
};

const LogoSmall: FC = () => {
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
      <h3 className="text-center text-2xl font-bold text-orange-600 relative">
        Fitteia<span className="text-white">2.</span>
      </h3>
    </div>
  );
};

export default Logo;
export { LogoSmall };
