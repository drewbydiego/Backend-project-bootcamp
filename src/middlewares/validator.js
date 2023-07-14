const patchValidator = (request, response, next) => {
  const { title, description, isDone } = request.body;
  if (
    typeof title == "undefined" ||
    typeof description == "undefined"
    //|| typeof isDone == "undefined"
  ) {
    return response
      .status(404)
      .json({ message: "Falta informacion" + title + description + isDone });
  }
  if (typeof title != "string") {
    return response
      .status(404)
      .json({ message: "Datos ingresados invalidos title debe ser String" });
  }
  if (typeof isDone !== "boolean") {
    return response
      .status(404)
      .json({ message: "Datos ingresados invalidos isDone debe ser Boolean" });
  }
  if (typeof description != "string" || typeof isDone != "boolean") {
    return response.status(404).json({
      message: "Datos ingresados invalidos description debe ser String",
    });
  }
  request.body.isDone = Number(request.body.isDone);
  next();
};

module.exports = {
  patchValidator,
};
