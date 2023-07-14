const { Router } = require("express");
const router = Router();
const { run, get } = require("./../services/database");
const { patchValidator } = require("./../middlewares/validator");
router.get("/", async (request, response, next) => {
  try {
    const toDos = await get("SELECT * FROM todos", []);
    const data = toDos.map((toDo) => {
      return {
        id: toDo.id,
        title: toDo.title,
        description: toDo.description,
        isDone: Boolean(toDo.isDone),
        createdAt: toDo.created_at,
        lastModified: toDo.last_modified_at,
      };
    });
    response
      .status(200)
      .json({ message: "To-dos retrieved successfully", data: data });
  } catch (error) {
    console.log(error);
    response
      .status(500)
      .json({ message: "El servidor tuvo un error", error: error.message });
  }
});
router.post("/", async (request, response, next) => {
  try {
    const { title, description, created_at, last_modified_at } = request.body;
    const data = await run(
      "INSERT INTO todos (title, description, created_at, last_modified_at) VALUES (?,?,?,?)",
      [title, description, created_at, last_modified_at]
    );
    //console.log(data.lastID);
    response.status(200).json({
      message: "To-do created successfully",
      toDo: {
        id: data.lastID,
        title,
        description,
        isDone: false,
      },
    });
  } catch (error) {
    console.log(error);
    response
      .status(500)
      .json({ message: "El servidor tuvo un error", error: error.message });
  }
});

router.delete("/:id", async (request, response, next) => {
  try {
    const { id } = request.params;
    const resultToDo = await get("SELECT * FROM todos WHERE id = ?", [id]);
    if (resultToDo.length === 0) {
      return response.status(404).json({ message: "No existe ToDo en la bdd" });
    }
    const { title, description, isDone } = request.body;

    await run("DELETE FROM todos WHERE id = ?", [id]);
    response.status(200).json({
      message: "To-do deleted successfully",
      ToDo: {
        id: resultToDo[0].id,
        title: resultToDo[0].title,
        description: resultToDo[0].description,
        isDone: Boolean(resultToDo[0].isDone),
      },
    });
  } catch (error) {
    response
      .status(500)
      .json({ message: "El servidor tuvo un error", error: error.message });
  }
});

router.patch("/:id", patchValidator, async (request, response, next) => {
  try {
    const { id } = request.params;
    const resultToDo = await get("SELECT * FROM todos WHERE id = ?", [id]);

    if (resultToDo.length === 0) {
      return response.status(404).json({ message: "No existe ToDo" });
    }
    const { title, description, isDone, lastModified } = request.body;
    //console.log("TIME: " + lastModified);
    const isDoneNumber = Number(isDone);
    await run(
      "UPDATE todos SET title = ?, description = ?, isDone = ?, last_modified_at = ? WHERE id = ?",
      [title, description, isDoneNumber, lastModified, id]
    );
    //console.log(resultToDo[0].created_at);
    await response.status(200).json({
      message: "To-do updated successfully",
      ToDo: {
        id,
        title,
        description,
        isDone: Boolean(isDoneNumber),
        createdAt: resultToDo[0].created_at,
        lastModified: resultToDo[0].last_modified_at,
      },
    });
  } catch (error) {
    response
      .status(500)
      .json({ message: "El servidor tuvo un error", error: error.message });
  }
});

module.exports = router;
