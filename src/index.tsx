import { Context, Hono } from "hono";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";
import { accounts, User, users } from "./db";
import BaseDocument from "./BaseDocument";
import TableView from "./TableView";
import { ObjectId } from "mongodb";
import UserView from "./User";
import TopElement from "./TopElement";
import AccountView from "./Account";
import { faker } from "@faker-js/faker";

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
    </BaseDocument>,
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
    ></TableView>,
  );
});

app.get("/users", async (c) => {
  const allUsers = await usersFilter(c);

  return c.html(
    <BaseDocument title="Banker">
      <TopElement />
      <div>
        <a href="/create-user">Create User</a>
      </div>
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
    </BaseDocument>,
  );
});

app.get("/create-user", async (c) => {
  const user: User = {
    _id: "",
    name: "",
    address: "",
    date_of_birth: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
    is_verified: false,
    accounts: [],
  };

  return c.html(
    <BaseDocument title="Create User">
      <TopElement />
      <UserView user={user} />
    </BaseDocument>,
  );
});

app.get("/create-account", async (c) => {
  const account = {
    _id: "",
    owners: [],
    transactions: [],
    number: 0,
    description: faker.lorem.sentence(),
    balance: Math.floor(Math.random() * 1000000),
    currency: faker.finance.currencyCode(),
    created_at: new Date(),
    updated_at: new Date(),
  };

  const ownersList = (await users.find().toArray()).map((user) => ({
    _id: user._id.toString(),
    name: user.name,
  }));

  return c.html(
    <BaseDocument title="Create Account">
      <TopElement />
      <AccountView account={account} ownersList={ownersList} />
    </BaseDocument>,
  );
});

app.post("/create-account", async (c) => {
  const data = await c.req.formData();

  const description = data.get("description");
  const balance = data.get("balance");
  const currency = data.get("currency");
  const created_at = data.get("created_at");
  const updated_at = data.get("updated_at");
  const owners = data.getAll("owners");

  await accounts.insertOne({
    number: Math.floor(Math.random() * 1000000),
    owners,
    description,
    balance,
    currency,
    created_at,
    updated_at,
  });
  return c.redirect("/accounts");
});

app.post("/create-user", async (c) => {
  const data = await c.req.formData();

  const name = data.get("name");
  let email: FormDataEntryValue | undefined = data.get("email")?.toString() ?? undefined;
  console.error(email, typeof email, email?.toString().trim() === "")
  if (email && email.trim() === "") {
    email = undefined;
  }
  const address = data.get("address");
  const date_of_birth = data.get("date_of_birth");
  const created_at = data.get("created_at");
  const updated_at = data.get("updated_at");
  const is_verified = Boolean(data.get("is_verified"));

  await users.insertOne({
    name,
    email,
    address,
    date_of_birth,
    created_at,
    updated_at,
    is_verified,
  });
  return c.redirect("/users");
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
    ></TableView>,
  );
});

app.get("/accounts", async (c) => {
  const allUsers = await accounts.find().toArray();
  return c.html(
    <BaseDocument title="Banker">
      <TopElement />
      <div>
        <a href="/create-account">Create Account</a>
      </div>
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
        baseUri="/accounts"
      ></TableView>
    </BaseDocument>,
  );
});

app.get("/accounts/:id", async (c) => {
  const id = c.req.param("id");
  const transactions = await accounts.findOne(
    { _id: new ObjectId(id) },
    { projection: { transactions: 1 } },
  );

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
    ></TableView>,
  );
});

app.delete("/accounts/:id", async (c) => {
  const id = c.req.param("id");
  const result = await accounts.deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 0) {
    return c.text("No account found", 404);
  }
  return c.text("", 200);
});

app.delete("/users/:id", async (c) => {
  const id = c.req.param("id");
  const result = await users.deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 0) {
    return c.text("No user found", 404);
  }
  return c.text("", 200);
});

function notFound404(c: Context) {
  c.status(404);
  return c.html(
    <BaseDocument title="404 Not Found">
      Could not find requested user
    </BaseDocument>,
  );
}

app.get("/users/:id", async (c) => {
  const id = c.req.param("id");
  const userArray = await users.find({ _id: new ObjectId(id) }).toArray();
  if (userArray.length < 1) {
    return notFound404(c);
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
      />,
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
    </BaseDocument>,
  );
});

app.post("/users", async (c) => {
  const data = await c.req.formData();

  const id = data.get("_id");
  if (id === null) {
    return notFound404(c);
  }
  const name = data.get("name");
  let email: FormDataEntryValue | undefined = data.get("email") ?? undefined;
  console.error(email);
  if (email && email.toString().trim() === "") {
    email = undefined;
  }
  const address = data.get("address");
  const date_of_birth = data.get("date_of_birth");
  const created_at = data.get("created_at");
  const updated_at = data.get("updated_at") ?? undefined;
  const is_verified = Boolean(data.get("is_verified")) ?? undefined;

  const existingUser = await users.findOne({
    _id: new ObjectId(id.toString()),
  });
  if (existingUser === null) {
    return notFound404(c);
  }

  await users.updateOne(
    { _id: new ObjectId(id.toString()) },
    {
      $set: {
        name,
        email,
        address,
        date_of_birth,
        created_at,
        updated_at,
        is_verified,
      },
    },
  );
  return c.redirect("/users");
});

export default app;
