import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { logger } from 'hono/logger';
import { users } from "./db";
import BaseDocument from './BaseDocument';
import TableView from './TableView';

const app = new Hono();

app.use(logger())
app.use('/static/*', serveStatic({ root: './' }));

app.get('/', async (c) => {
    const allUsers = await users.find().toArray();
    console.log(allUsers)
    return c.html(
        <BaseDocument title='Banker'>
            <h1>Banker</h1>
            <p>Build using <a href='https://htmx.org/'>htmx</a>.</p>
            <table>
                <tr>
                    <th>Name</th>
                    <th>E-Mail</th>
                    <th>Address</th>
                    <th>Date of Birth</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                    <th>Verified</th>
                </tr>
                {allUsers.map(e =>
                    <tr>
                        <td>{e.name}</td>
                        <td>{e.email}</td>
                        <td>{e.address}</td>
                        <td>{e.date_of_birth}</td>
                        <td>{e.created_at}</td>
                        <td>{e.updated_at}</td>
                        <td>{e.is_verified}</td>
                    </tr>
                )}
            </table>
        </BaseDocument>
    );
});

app.get('/users', async (c) => {
    const allUsers = await users.find().toArray();
    console.log(allUsers)
    return c.html(
        <BaseDocument title='Banker'>
            <h1>Banker</h1>
            <p>Build using <a href='https://htmx.org/'>htmx</a>.</p>
            <TableView attributes={{ name: "Name", email: "E-Mail", address: "Address", date_of_birth: "Date of Birth", created_at: "Created At", updated_at: "Updated At", is_verified: "Verified" }} data={allUsers}></TableView>
        </BaseDocument>
    );
});

export default app;
