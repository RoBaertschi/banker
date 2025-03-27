import { FC } from "hono/jsx";
import { Account } from "./db";
import dayjs from "dayjs";

export interface Owner {
  _id: string;
  name: string;
}

export interface Props {
  account: Account;
  ownersList: Owner[]; 
}

function toDate(input: string | Date) {
  const date = dayjs(input);
  return date.format("YYYY-MM-DDTHH:mm");
}

const AccountView: FC<Props> = ({ account, ownersList }) => {
  return (
    <form method="post">
      <input name="_id" value={account._id} hidden />
      
      <label htmlFor="description">Description</label>
      <br />
      <input required name="description" value={account.description} />
      <br />

      <label htmlFor="balance">Balance</label>
      <br />
      <input required name="balance" value={account.balance} />
      <br />

      <label htmlFor="currency">Currency</label>
      <br />
      <input required name="currency" value={account.currency} />
      <br />

      <label htmlFor="created_at">Created At</label>
      <br />
      <input
        type="datetime-local"
        name="created_at"
        value={toDate(account.created_at)}
      />
      <br />

      <label htmlFor="updated_at">Updated At</label>
      <br />
      <input
        type="datetime-local"
        name="updated_at"
        value={toDate(account.updated_at)}
      />
      <br />

      <label htmlFor="owners">Owners</label>
      <br />
      <select name="owners" required multiple>
        {ownersList.map((owner) => (
          <option key={owner._id} value={owner._id}>
            {owner.name}
          </option>
        ))}
      </select>
      <br />

      <button type="submit">Submit</button>
    </form>
  );
};

export default AccountView;
