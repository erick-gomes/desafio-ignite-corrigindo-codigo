const express = require("express");
const { v4: uuid } = require("uuid");

const app = express();
app.use(express.json());

const repositories = [];

app.get("/repositories", (_request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repository = repositories.find(repository => repository.id === id);

  if (!repository) {
    return response.status(404).json({ error: "Repository not found" });
  }

  /**
   * 
   * @param {String} property propriedade para ser atualizada
   * @param {*} value valor a ser atribúido a propriedade
   */
  const updateRepository = (property, value) => repository[property] = value;

  title && updateRepository('title', title);
  url && updateRepository('url', url);
  techs && updateRepository('techs', techs);

  return response.status(200).json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex === -1) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).json();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find(repository => repository.id === id);

  if (!repository) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repository.likes++;

  return response.status(200).json(repository);
});

module.exports = app;
