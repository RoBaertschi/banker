import { FC } from 'hono/jsx';
import { User as UserView } from './db';

export interface Props {
    user: UserView;
};

function toDate(lol: Date) {
    const date = new Date(lol);
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}T${date.getHours()}:${date.getSeconds()}:${date.getMilliseconds()}`;
}

const UserView: FC<Props> = ({ user }) => {
    return <form>
        <label for='user'>User</label>
        <input name='user' value={user.name} />
        <label for='email'>E-Mail</label>
        <input type={"email"} name='email' value={user.email} />
        <label for='address'>Address</label>
        <input name='address' value={user.address} />
        <label for='date_of_birth'>Date of Birth</label>
        <input type={'datetime-local'} name='date_of_birth' value={new Date(user.date_of_birth).toUTCString()} />
        <label for='created_at'>Created At</label>
        <input type={'datetime-local'} name='created_at' value={toDate(user.created_at)} />
        <label for='updated_at'>Updated At</label>
        <input type={'datetime-local'} name='updated_at' value={new Date(user.updated_at).toUTCString()} />
        <label for='is_verified'>Is Verified</label>
        <input type={"checkbox"} name='is_verified' value={JSON.stringify(user.is_verified)} />

        <button type='submit'>Submit</button>
    </form>
};


export default UserView;
