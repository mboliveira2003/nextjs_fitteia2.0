import React, { FC, ReactElement } from "react";
import { Switch } from "@headlessui/react";
import clsx from "clsx";

interface LabeledSwitchProps {
  label?: string;
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  enabledLabel: string;
  disabledLabel: string;
  defaultSwitchToDisabled?: boolean;
}

const LabeledSwitch: FC<LabeledSwitchProps> = ({
  label,
  enabled,
  setEnabled,
  enabledLabel,
  disabledLabel,
  defaultSwitchToDisabled = false,
}): ReactElement => {
  if (defaultSwitchToDisabled && enabled) {
    setEnabled(false);
  }

  return (
    <Switch.Group>
      <div
        className={clsx(
          defaultSwitchToDisabled ? "cursor-auto" : "cursor-pointer",
          "flex items-start flex-col justify-center gap-y-2"
        )}
      >
        {label && <Switch.Label className="">{label}</Switch.Label>}
        <Switch
          checked={enabled}
          onChange={setEnabled}
          className={clsx(
            defaultSwitchToDisabled
              ? "cursor-auto bg-zinc-800 shadow-zinc-900/60"
              : "cursor-pointer bg-zinc-700 shadow-zinc-800/60",
            "relative inline-flex h-fit w-52 items-center rounded-lg transition-colors ease-in-out duration-200 py-1 px-0.5 shadow-inner"
          )}
        >
          <span
            className={clsx(
              defaultSwitchToDisabled ? "text-zinc-500" : "text-zinc-400",
              "inline-block h-fit w-1/2 transform text-md transition-all ease-in-out duration-200 px-2 py-0.5"
            )}
          >
            {disabledLabel}
          </span>
          <span
            className={clsx(
              defaultSwitchToDisabled ? "text-zinc-500" : "text-zinc-400",
              "inline-block h-fit w-1/2 transform text-md transition-all ease-in-out duration-200 px-2 py-0.5"
            )}
          >
            {enabledLabel}
          </span>
          <span
            className={clsx(
              enabled ? "translate-x-24" : "translate-x-1",
              defaultSwitchToDisabled
                ? "bg-zinc-600 text-zinc-400"
                : "bg-zinc-500 text-zinc-300",
              "inline-block h-fit absolute w-1/2 transform rounded-md shadow-md transition-all ease-in-out duration-150 px-2 py-0.5"
            )}
          >
            {enabled ? enabledLabel : disabledLabel}
          </span>
        </Switch>
      </div>
    </Switch.Group>
  );
};

export default LabeledSwitch;
