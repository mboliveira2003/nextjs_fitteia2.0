import React, { FC, ReactElement } from "react";
import { Switch } from "@headlessui/react";

interface LabeledSwitchProps {
  label?: string;
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  enabledLabel: string;
  disabledLabel: string;
}

const LabeledSwitch: FC<LabeledSwitchProps> = ({
  label,
  enabled,
  setEnabled,
  enabledLabel,
  disabledLabel,
}): ReactElement => {
  return (
    <Switch.Group>
      <div className="flex items-start flex-col justify-center gap-y-2">
        {label && <Switch.Label className="">{label}</Switch.Label>}
        <Switch
          checked={enabled}
          onChange={setEnabled}
          className="relative inline-flex h-fit w-52 items-center rounded-lg transition-colors py-1 px-0.5 bg-zinc-700 shadow-inner shadow-zinc-800/60"
        >
          <span className="inline-block h-fit w-1/2 transform text-md text-zinc-400 transition-all px-2 py-0.5">
            {disabledLabel}
          </span>
          <span className="inline-block h-fit w-1/2 transform text-md text-zinc-400 transition-all px-2 py-0.5">
            {enabledLabel}
          </span>
          <span
            className={`${
              enabled ? "translate-x-24" : "translate-x-1"
            } inline-block h-fit absolute w-1/2 transform rounded-md bg-zinc-500 text-zinc-300 shadow-md transition-all px-2 py-0.5`}
          >
            {enabled ? enabledLabel : disabledLabel}
          </span>
        </Switch>
      </div>
    </Switch.Group>
  );
};

export default LabeledSwitch;
