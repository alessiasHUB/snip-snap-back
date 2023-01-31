import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import filePath from "./filePath";
import { Client } from "pg";

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

interface SnipSnapType {
  id: number;
  post_date: Date;
  title: null | string;
  body: string;
}

interface PasteComment {
  commentID: number;
  snipSnapID: number;
  commentBody: string;
  post_date: Date;
}

const PORT_NUMBER = process.env.PORT ?? 4000;
const client = new Client(process.env.DATABASE_URL);
client.connect();

app.get("/", (req, res) => {
  const pathToFile = filePath("../public/index.html");
  res.sendFile(pathToFile);
});

app.get("/snip_snaps", async (req, res) => {
  try {
    const queryResponse = await client.query(`
SELECT *
FROM snip_snaps
ORDER BY post_date desc
LIMIT 10
`);
    const allPastes = queryResponse.rows;
    res.status(200).json(allPastes);
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "internal error" });
  }
});

app.get<{ id: string }>("/snip_snaps/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const values = [id];
    const queryResponse = await client.query(
      `
    SELECT *
    FROM snip_snaps
    WHERE id = $1
    `,
      values
    );
    const singleSnipSnap = queryResponse.rows[0];
    res.status(200).json(singleSnipSnap);
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
FROM snip_snap_comments
ORDER BY post_date DESC
`
    );
    const allComments = queryResponse.rows;
    res.status(200).json(allComments);
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "internal error" });
  }
});

// GET comments for specific snip snap
app.get("/comments/:snip_snap_id", async (req, res) => {
  try {
    const values = [req.params.snip_snap_id];
    const queryResponse = await client.query(
      `
SELECT *
FROM snip_snap_comments
WHERE snip_snap_id = $1
ORDER BY post_date DESC
`,
      values
    );
    const allComments = queryResponse.rows;
    res.status(200).json(allComments);
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "internal error" });
  }
});

//Deletes Paste and its comments
app.delete("/snip_snaps/:id", async (req, res) => {
  console.log("The id you are trying to delete is:", req.params.id);
  try {
    const values: number[] = [parseInt(req.params.id)];
    await client.query(
      `
DELETE FROM snip_snapcomments
WHERE snip_snap_id = $1
`,
      values
    );
    const queryResponse = await client.query(
      `
      DELETE FROM snip_snaps
      WHERE id = $1
      RETURNING *`,
      values
    );
    const deletedPaste = queryResponse.rows[0];
    res.status(200).json(deletedPaste);
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "internal error" });
  }
});

//Deletes all comments for a particular snip snap
app.delete("/comments/:commentID", async (req, res) => {
  try {
    const values: number[] = [parseInt(req.params.commentID)];
    const queryResponse = await client.query(
      `
DELETE FROM snip_snap_comments
WHERE comment_id = $1
RETURNING *
`,
      values
    );
    const deletedComment = queryResponse.rows[0];
    res.status(200).json(deletedComment);
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "internal error" });
  }
});

app.post<{}, {}, PasteComment>("/comments", async (req, res) => {
  try {
    const values = [req.body.snipSnapID, req.body.commentBody];
    const queryResponse = await client.query(
      `
    INSERT INTO snip_snap_comments (snip_snap_id, comment_body)
    VALUES ($1, $2)
    RETURNING *;`,
      values
    );
    const postedComment = queryResponse.rows[0];
    res.status(200).json(postedComment);
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "internal error" });
  }
});

// //leave a comment on a single snip snap
// app.post<{}, {}, PasteComment>("/comments/:snipSnapID", async (req, res) => {
//   try {
//     const values = [req.body.snipSnapID, req.body.commentBody]
//   }
//   catch (error) {
//     console.error(error);
//     res.status(404).json({ message: "internal error" });
// }
// });

app.post<{}, {}, SnipSnapType>("/snip_snaps", async (req, res) => {
  try {
    let values = [req.body.body, req.body.title];
    if (!req.body.title) {
      values = [req.body.body, null];
    }
    const queryResponse = await client.query(
      `
    INSERT INTO snip_snaps (body, title)
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

app.put<{}, {}, SnipSnapType>("/snip_snaps", async (req, res) => {
  try {
    const values = [req.body.body, req.body.id];
    const queryResponse = await client.query(
      `
  UPDATE snip_snaps
SET body = $1
WHERE id = $2
RETURNING *
  `,
      values
    );
    res.status(200).json(queryResponse.rows);
  } catch (error) {
    res.status(404).json({ message: "internal error" });
  }
});

app.listen(PORT_NUMBER, () => {
  console.log(`Server is listening on port ${PORT_NUMBER}!`);
});
