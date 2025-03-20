import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { logger } from 'hono/logger';
import { accounts, users } from "./db";
import BaseDocument from './BaseDocument';
import TableView from './TableView';

const app = new Hono();

app.use(logger())
app.use('/static/*', serveStatic({ root: './' }));

app.get('/', async (c) => {
    return c.html(
        <BaseDocument title='Banker'>
            <main>
                <a href='/users'>Users</a>
                <a href='/accounts'>Accounts</a>
            </main>
        </BaseDocument>
    );
});

app.get('/users', async (c) => {
    const allUsers = await users.find().toArray();
    return c.html(
        <BaseDocument title='Banker'>
            <h1>Banker</h1>
            <p>Build using <a href='https://htmx.org/'>htmx</a>.</p>
            <TableView attributes={{ name: "Name", email: "E-Mail", address: "Address", date_of_birth: "Date of Birth", created_at: "Created At", updated_at: "Updated At", is_verified: "Verified" }} data={allUsers}></TableView>
        </BaseDocument>
    );
});

app.get('/accounts', async (c) => {
    const allUsers = await accounts.find().toArray();
    return c.html(
        <BaseDocument title='Banker'>
            <h1>Banker</h1>
            <p>Build using <a href='https://htmx.org/'>htmx</a>.</p>
            <TableView attributes={{ number: "Number", description: "Description", balance: "Balance", currency: "Currency", created_at: "Created At", updated_at: "Updated At" }} data={allUsers}></TableView>
        </BaseDocument>
    );
});

export default app;
