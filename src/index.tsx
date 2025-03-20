import { Context, Hono } from "hono";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";
import { accounts, User, users } from "./db";
import BaseDocument from "./BaseDocument";
import TableView from "./TableView";
import { ObjectId } from "mongodb";
import UserView from "./User";

const app = new Hono();

app.use(logger());
app.use("/static/*", serveStatic({ root: "./" }));

app.get("/", async (c) => {
    return c.html(
        <BaseDocument title="Banker">
            <main>
                <ul>
                    <li>
                        <a href="/users">Users</a>
                    </li>
                    <li>
                        <a href="/accounts">Accounts</a>
                    </li>
                    <li>
                        <a href="/about">About</a>
                    </li>
                </ul>
            </main>
        </BaseDocument>
    );
});

async function accountsFilter(c: Context) {
    const filter = c.req.query("filter");
    const findFilter: { description?: RegExp | undefined } = {};
    if (filter) {
        findFilter.description = new RegExp(filter);
    }
    const allUsers = await accounts.find(findFilter).toArray();
    return allUsers;
}

async function usersFilter(c: Context) {
    const filter = c.req.query("filter");
    const findFilter: { name?: RegExp | undefined } = {};
    if (filter) {
        findFilter.name = new RegExp(filter);
    }
    const allUsers = await users.find(findFilter).toArray();
    return allUsers;
}

app.get("/users-search", async (c) => {
    const allUsers = await usersFilter(c);

    return c.html(
        <TableView
            className="users"
            attributes={{
                name: "Name",
                email: "E-Mail",
                address: "Address",
                date_of_birth: "Date of Birth",
                created_at: "Created At",
                updated_at: "Updated At",
                is_verified: "Verified",
            }}
            data={allUsers}
            baseUri="/users"
        ></TableView>
    );
});

app.get("/users", async (c) => {
    const allUsers = await usersFilter(c);

    return c.html(
        <BaseDocument title="Banker">
            <h1>Banker</h1>
            <p>
                Build using <a href="https://htmx.org/">htmx</a>.
            </p>
            <input
                type={"search"}
                name="filter"
                placeholder="Search for Users..."
                hx-get="/users-search"
                hx-trigger="input changed delay:500ms, keyup[key=='Enter'], load"
                hx-target=".users"
                hx-params="*"
            />
            <TableView
                className="users"
                attributes={{
                    name: "Name",
                    email: "E-Mail",
                    address: "Address",
                    date_of_birth: "Date of Birth",
                    created_at: "Created At",
                    updated_at: "Updated At",
                    is_verified: "Verified",
                }}
                data={allUsers}
                baseUri="/users"
            ></TableView>
        </BaseDocument>
    );
});

app.get("/accounts-search", async (c) => {
    const allUsers = await accountsFilter(c);
    return c.html(
        <TableView
            className="accounts"
            attributes={{
                number: "Number",
                description: "Description",
                balance: "Balance",
                currency: "Currency",
                created_at: "Created At",
                updated_at: "Updated At",
            }}
            data={allUsers}
        ></TableView>
    );
});

app.get("/accounts", async (c) => {
    const allUsers = await accounts.find().toArray();
    return c.html(
        <BaseDocument title="Banker">
            <h1>Banker</h1>
            <p>
                Build using <a href="https://htmx.org/">htmx</a>.
            </p>
            <TableView
                className="accounts"
                attributes={{
                    number: "Number",
                    description: "Description",
                    balance: "Balance",
                    currency: "Currency",
                    created_at: "Created At",
                    updated_at: "Updated At",
                }}
                data={allUsers}
                baseUri="/acc-details"
            ></TableView>
        </BaseDocument>
    );
});

app.get("/acc-details/:id", async (c) => {
    const id = c.req.param("id");
    const transactions = await accounts.findOne(
        { _id: id as unknown as ObjectId },
        { projection: { transactions: 1 } }
    );
    console.log("Transactions", transactions);

    if (!transactions) {
        return c.text("No transactions found", 404);
    }

    return c.html(
        <TableView
            className="accounts"
            attributes={{
                type: "Type",
                amount: "Amount",
                timestamp: "Timestamp",
                description: "Description",
            }}
            data={transactions.transactions}
        ></TableView>
    );
});

function notFound404(c: Context) {
    c.status(404);
    return c.html(<BaseDocument title='404 Not Found'>Could not find requested user</BaseDocument>)
}

app.get('/users/:id', async (c) => {
    const id = c.req.param("id");
    const userArray = await users.find({ _id: id as unknown as ObjectId }).toArray();
    if (userArray.length < 1) {
        return notFound404(c)
    }

    const user = userArray[0] as unknown as User;

    return c.html(<UserView user={user}></UserView>);
});

app.get("/about", (c) => {
    const ricks = [];
    for (let i = 0; i < 100; i++) {
        ricks.push(
            <img
                src="/static/rickroll-roll.gif"
                alt="Rickroll"
                style={{
                    width: "100px",
                    height: "100px",
                    position: "absolute",
                    top: `${Math.random() * 100}vh`,
                    left: `${Math.random() * 100}vw`,
                }}
            />
        );
    }

    return c.html(
        <BaseDocument title="About">
            <div
                style={{
                    width: "100vw",
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {ricks}
            </div>
        </BaseDocument>
    );
});

app.post('/users/:id', async (c) => {
    const id = c.req.param("id");
    const data = await c.req.formData();

    const user = data.get("user");
    const email = data.get("email");
    const address = data.get("address");
    const date_of_birth = data.get("date_of_birth");
    const created_at = data.get("created_at");
    const updated_at = data.get("updated_at");
    const is_verified = data.get("is_verified");

    const existingUser = await users.findOne({ _id: id as unknown as ObjectId });
    if (existingUser === null) {
        return notFound404(c)
    }

    existingUser["user"] = user;
    existingUser["email"] = email;
    existingUser["address"] = address;
    existingUser["date_of_birth"] = date_of_birth;
    existingUser["created_at"] = created_at;
    existingUser["updated_at"] = updated_at;
    existingUser["is_verified"] = is_verified;

    users.updateOne({ _id: id as unknown as ObjectId }, existingUser);
    return c.redirect("/users/" + id);
})

export default app;
