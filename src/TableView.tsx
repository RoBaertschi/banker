import { FC } from 'hono/jsx';

interface Props {
    // Maps attribute name to readable name
    attributes: {
        [name: string]: string
    };
    data: object[];
}

const TableView: FC<Props> = ({ attributes, data }) => {
    return <table>
        <tr>{Object.values(attributes).map(att => <th>{att}</th>)}</tr>
        {data.map(data => {
            const tds = [];

            for (let key in data) {
                if (!(key in attributes)) {
                    continue
                }
                let tdata: any = data[key as keyof (typeof data)];
                if (typeof tdata === "boolean") {
                    tdata = JSON.stringify(tdata)
                }
                tds.push(<td>{tdata}</td>)
            }

            return <tr>{tds}</tr>
        })}
    </table>
}

export default TableView;
