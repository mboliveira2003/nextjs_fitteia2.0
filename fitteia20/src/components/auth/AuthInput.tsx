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
        className="block w-full appearance-none rounded-lg border-0 bg-stone-600/40 py-1.5 pl-3 pr-3 text-white transition-all duration-500 ease-in-out placeholder:text-stone-400 focus:ring-1 focus:ring-inset focus:ring-orange-700 sm:text-sm sm:leading-6"

      />
    </div>
  );
};

export default AuthInput;
