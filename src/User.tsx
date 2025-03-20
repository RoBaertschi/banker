import { FC } from 'hono/jsx';
import { User } from './db';

export interface Props {
    user: User;
};

const User: FC<Props> = ({ user }) => {
    return <form>
        <label for='user'>User</label>
        <input name='user' value={user.name} />
        <label for='email'>E-Mail</label>
        <input type={"email"} name='email' value={user.email} />
        <label for='address'>Address</label>
        <input name='address' value={user.address} />
        <label for='date_of_birth'>Date of Birth</label>
        <input type={'date'} name='date_of_birth' value={user.date_of_birth.toString()} />
        <label for='created_at'>Created At</label>
        <input type={'date'} name='created_at' value={user.created_at.toString()} />
        <label for='updated_at'>Updated At</label>
        <input type={'date'} name='updated_at' value={user.updated_at.toString()} />
        <label for='is_verified'>Is Verified</label>
        <input type={"checkbox"} name='is_verified' value={JSON.stringify(user.is_verified)} />

        <button type='submit'>Submit</button>
    </form>
};


export default User;
