import { formatMilliseconds } from "../../util/format";
import { CircleCheck, CircleX } from "lucide-react";
import { BoldMetadata } from "../../util/types";

type Props = {
  metadata: BoldMetadata[] | undefined;
};

function Metadata({ metadata }: Props) {
  if (!metadata) {
    return;
  }

  return (
    <div className="flex gap-4">
      <div className="stats shadow">
        <div className="stat min-w-44">
          <div className="stat-title">Start Time</div>
          <div className="stat-value">
            {formatMilliseconds(metadata[0]?.start_time)}
          </div>
          <div className="stat-desc">milliseconds</div>
        </div>
      </div>

      <div className="stats shadow">
        <div className="stat min-w-44">
          <div className="stat-title">Delay</div>
          <div className="stat-value">
            {formatMilliseconds(metadata[0]?.delay_time)}
          </div>
          <div className="stat-desc">milliseconds</div>
        </div>
      </div>

      <div className="stats shadow">
        <div className="stat min-w-44">
          <div className="stat-title">Repetition Time</div>
          <div className="stat-value">{metadata[0]?.repetition_time}</div>
          <div className="stat-desc">milliseconds</div>
        </div>
      </div>

      <div className="stats shadow">
        <div className="stat min-w-44">
          <div className="stat-title">Time Correction</div>
          <div className="stat-value flex justify-center">
            {metadata[0]?.slice_timing_corrected ? (
              <CircleCheck color="green" />
            ) : (
              <CircleX color="red" />
            )}
          </div>
          <div className="stat-desc"></div>
        </div>
      </div>

      <div className="stats shadow">
        <div className="stat min-w-44">
          <div className="stat-title">Skull Stripped</div>
          <div className="stat-value flex justify-center">
            {metadata[0]?.skull_stripped ? (
              <CircleCheck color="green" />
            ) : (
              <CircleX color="red" />
            )}
          </div>
          <div className="stat-desc"></div>
        </div>
      </div>
    </div>
  );
}

export default Metadata;
