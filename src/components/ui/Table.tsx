type Props = {
  columns: string[];
  data: string[];
};

export const Table = ({ columns, data }: Props) => {
  return (
    <div className="overflow-x-auto border rounded-md px-4 py-2">
      <table className="table table-xs table-pin-rows table-pin-cols">
        <thead>
          <tr>
            {columns.map((name: string, index: number) => (
              <th key={index}>{name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
