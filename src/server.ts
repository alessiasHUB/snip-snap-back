import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import filePath from "./filePath";
import { Client } from "pg";

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

interface PasteBinType {
  id: number;
  date: Date;
  title: null | string;
  body: string;
}

interface PasteComment {
  commentID: number;
  pasteID: number;
  commentBody: string;
  date: Date;
}

const PORT_NUMBER = process.env.PORT ?? 4000;
const client = new Client(process.env.DATABASE_URL);
client.connect();

app.get("/", (req, res) => {
  const pathToFile = filePath("../public/index.html");
  res.sendFile(pathToFile);
});

app.get("/pastes", async (req, res) => {
  try {
    const queryResponse = await client.query(`
SELECT *
FROM paste_bin_data
ORDER BY date desc
LIMIT 10
`);
    const allPastes = queryResponse.rows;
    res.status(200).json(allPastes);
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "internal error" });
  }
});

app.get<{ id: string }>("/pastes/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const values = [id];
    const queryResponse = await client.query(
      `
    SELECT *
    FROM paste_bin_data
    WHERE id = $1
    `,
      values
    );
    const singlePaste = queryResponse.rows[0];
    res.status(200).json(singlePaste);
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "internal error" });
  }
});

// GET all comments
app.get("/comments", async (req, res) => {
  try {
    const queryResponse = await client.query(
      `
SELECT *
FROM paste_comments
`
    );
    const allComments = queryResponse.rows;
    res.status(200).json(allComments);
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "internal error" });
  }
});

//Deletes Paste and its comments
app.delete("/pastes/:id", async (req, res) => {
  console.log("The id you are trying to delete is:", req.params.id)
  try {
    const values: number[] = [parseInt(req.params.id)];
    await client.query(
      `
DELETE FROM paste_comments
WHERE paste_id = $1
`, values);
      const queryResponse = await client.query(`
      DELETE FROM paste_bin_data
      WHERE id = $1
      RETURNING *`, values)
    const deletedPaste = queryResponse.rows[0];
    res.status(200).json(deletedPaste);
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "internal error" });
  }
});

//Deletes all comments for a particular paste
app.delete("/comments/:commentID", async (req, res) => {
  try {
    const values: number[] = [parseInt(req.params.commentID)];
    const queryResponse = await client.query(
      `
DELETE FROM paste_comments
WHERE comment_id = $1
RETURNING *
`, values);
    const deletedComment = queryResponse.rows[0];
    res.status(200).json(deletedComment);
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "internal error" });
  }
});

app.post<{}, {}, PasteComment>("/comments", async (req, res) => {
  try {
    const values = [req.body.pasteID, req.body.commentBody];
    const queryResponse = await client.query(
      `
    INSERT INTO paste_comments (paste_id, comment_body)
    VALUES ($1, $2)
    RETURNING *;`,
      [values[0], values[1]]
    );
    const postedComment = queryResponse.rows[0];
    res.status(200).json(postedComment);
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "internal error" });
  }
});

app.post<{}, {}, PasteBinType>("/pastes", async (req, res) => {
  try {
    let values = [req.body.body, req.body.title];
    if (!req.body.title) {
      values = [req.body.body, null];
    }
    const queryResponse = await client.query(
      `
    INSERT INTO paste_bin_data (body, title)
    VALUES (
      $1, $2
    )
    RETURNING *
    `,
      values
    );
    const createdPaste = queryResponse.rows[0];
    res.status(200).json(createdPaste);
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "internal error" });
  }
});



app.listen(PORT_NUMBER, () => {
  console.log(`Server is listening on port ${PORT_NUMBER}!`);
});
