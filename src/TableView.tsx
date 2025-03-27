import { FC } from "hono/jsx";

interface Props {
  // Maps attribute name to readable name
  attributes: {
    [name: string]: string;
  };
  data: { [d: string]: any }[];
  baseUri?: string;
  className: string;
}

const TableView: FC<Props> = ({ attributes, data, baseUri, className }) => {
  return (
    <table className={className}>
      <tr>
        {Object.values(attributes).map((att) => (
          <th>{att}</th>
        ))}
        {baseUri && (
          <>
            <th>Transactions</th> <th>Delete</th>
          </>
        )}
      </tr>
      {data.map((data) => {
        const tds = [];

        for (let key in data) {
          if (!(key in attributes)) {
            continue;
          }
          let tdata: any = data[key as keyof typeof data];
          if (typeof tdata === "boolean") {
            tdata = JSON.stringify(tdata);
          } else if (typeof tdata === "object") {
            if ("$numberDecimal" in tdata) {
              tdata = tdata.$numberDecimal;
            } else if ("$timestamp" in tdata) {
              tdata = tdata.$timestamp;
            }
          }

          tds.push(<td>{tdata}</td>);
        }

        if (baseUri) {
          const id = data["_id" as keyof typeof data];
          tds.push(
            <>
              <td>
                <button hx-get={`${baseUri}/${id}`} hx-target="#details">
                  Details
                </button>
              </td>
              <td>
                <button
                  hx-delete={`${baseUri}/${id}`}
                  hx-trigger="click"
                  hx-target={`#row-${id}`}
                  hx-swap="delete"
                >
                  Delete
                </button>
              </td>
            </>
          );
        }

        return (
          <tr
            id={`row-${data["_id"]}`}
            hx-target={`#row-${data["_id"]}`}
            hx-swap="delete"
          >
            {tds}
          </tr>
        );
      })}
    </table>
  );
};

export default TableView;
