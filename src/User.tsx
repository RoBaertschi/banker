import { FC } from 'hono/jsx';
import { User as UserView } from './db';
import dayjs from 'dayjs';

export interface Props {
    user: UserView;
};

function toTwoDigits(num: number) {
    if (num < 10) {
        return "0" + num
    }
    return "" + num
}

function toFourDigits(num: number) {
    if (num < 10) {
        return "000" + num
    }
    if (num < 100) {
        return "00" + num
    }
    if (num < 1000) {
        return "0" + num
    }
    return "" + num
}

function toDate(lol: string | Date) {
    const date = dayjs(lol);

    const format = date.format("YYYY-MM-DDTHH:ss");
    console.log(format)
    return format
}

const UserView: FC<Props> = ({ user }) => {
    return <form>
        <label for='user'>User</label><br />
        <input name='user' value={user.name} /><br />
        <label for='email'>E-Mail</label><br />
        <input type={"email"} name='email' value={user.email} /><br />
        <label for='address'>Address</label><br />
        <input name='address' value={user.address} /><br />
        <label for='date_of_birth'>Date of Birth</label><br />
        <input type={'datetime-local'} name='date_of_birth' value={toDate(user.date_of_birth)} /><br />
        <label for='created_at'>Created At</label><br />
        <input type={'datetime-local'} name='created_at' value={toDate(user.created_at)} /><br />
        <label for='updated_at'>Updated At</label><br />
        <input type={'datetime-local'} name='updated_at' value={toDate(user.updated_at)} /><br />
        <label for='is_verified'>Is Verified</label>
        <input type={"checkbox"} name='is_verified' value={JSON.stringify(user.is_verified)} /><br />

        <button type='submit'>Submit</button>
    </form>
};


export default UserView;
