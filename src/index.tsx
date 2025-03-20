import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";
import { accounts, users } from "./db";
import BaseDocument from "./BaseDocument";
import TableView from "./TableView";
import { useEffect, useState } from "hono/jsx";

const app = new Hono();

app.use(logger());
app.use("/static/*", serveStatic({ root: "./" }));

app.get("/", async (c) => {
  return c.html(
    <BaseDocument title="Banker">
      <main>
        <a href="/users">Users</a>
        <a href="/accounts">Accounts</a>
      </main>
    </BaseDocument>
  );
});

app.get("/users", async (c) => {
  const allUsers = await users.find().toArray();
  return c.html(
    <BaseDocument title="Banker">
      <h1>Banker</h1>
      <p>
        Build using <a href="https://htmx.org/">htmx</a>.
      </p>
      <TableView
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
      ></TableView>
    </BaseDocument>
  );
});

app.get("/accounts", async (c) => {
  const allUsers = await accounts.find().toArray();
  const onDetails = (id: string) => {
    console.log("Details for account", id);
  };

  return c.html(
    <BaseDocument title="Banker">
      <h1>Banker</h1>
      <p>
        Build using <a href="https://htmx.org/">htmx</a>.
      </p>
      <TableView
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
    { _id: id },
    { projection: { transactions: 1 } }
  );
  console.log("Transactions", transactions);

  if (!transactions) {
    return c.text("No transactions found", 404);
  }

  /*
  Transactions {
  _id: "67dc0545207f868abb63607d",
  transactions: [
    {
      _id: "67dc0545207f868abb63607e",
      type: "debit",
      amount: {
        $numberDecimal: "4912.29",
      },
      timestamp: {
        $timestamp: "7483862474693804033",
      },
      description: "invoice processed at Kertzmann, Labadie and Smith for GEL 942.77, using card ending ****1152. Account: ***4250.",
    },
    {
      _id: "67dc0545207f868abb63607f",
      type: "debit",
      amount: {
        $numberDecimal: "4495.25",
      },
      timestamp: {
        $timestamp: "7483862474693804033",
      },
      description: "invoice confirmed at Koelpin - Wunsch for TOP 464.22, card ending in ****6251 associated with account ***2752.",
    }
  ],
}
  */

  return c.html(
    <TableView
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

export default app;
