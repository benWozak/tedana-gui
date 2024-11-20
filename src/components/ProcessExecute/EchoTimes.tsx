import { BoldMetadata } from "../../util/types";
import { formatMilliseconds } from "../../util/format";
type Props = {
  metadata: BoldMetadata[] | undefined;
};

function EchoTimes({ metadata }: Props) {
  if (!metadata) {
    return;
  }

  return (
    <div className="flex gap-4">
      {metadata.map((item: BoldMetadata, index: number) => (
        <div key={index} className="stats shadow">
          <div key={index} className="stat">
            <div className="stat-title">{`Echo ${item.echo_num}`}</div>
            <div className="stat-value">
              {!!item.echo_time && formatMilliseconds(item.echo_time)}
            </div>
            <div className="stat-desc">milliseconds</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default EchoTimes;
