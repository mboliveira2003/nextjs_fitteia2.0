import clsx from "clsx";

interface InputProps {
  type: string;
  name: string;
  id: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  extraPadding?: boolean;
}

const Input: React.FC<InputProps> = ({
  type,
  name,
  id,
  value,
  onChange,
  extraPadding,
}) => {
  return (
    <input
      type={type}
      name={name}
      id={id}
      value={value}
      step="0.1"
      required
      onChange={onChange}
      className={clsx(
        extraPadding ? "py-1.5" : "py-0.5",
        "block w-full rounded-md bg-zinc-600 bg-opacity-20 backdrop-blur-2xl border-0 pl-3  text-zinc-200 ring-1 ring-inset ring-zinc-500 transition-all duration-200 placeholder:text-zinc-400 focus:ring-inset focus:ring-zinc-400 sm:text-sm sm:leading-6"
      )}
    />
  );
};

export default Input;
