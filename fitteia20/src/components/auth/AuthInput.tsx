interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const AuthInput = ({ label, ...rest }: AuthInputProps) => {
  return (
    <div className="w-full">
      <label
        htmlFor={label}
        className="mb-2 block text-sm font-medium text-white"
      >
        {label}
      </label>
      <input
        {...rest}
        className="block w-full appearance-none rounded-lg border-0 text-white bg-white/5 ring-white/10 ring-1 ring-inset backdrop-blur-3xl py-1.5 pl-3 pr-3 transition-all duration-150 ease-in-out placeholder:text-zinc-400 focus:ring-1 focus:ring-inset hover:ring-white/40 focus:ring-white/40 sm:text-sm sm:leading-6"

      />
    </div>
  );
};

export default AuthInput;
