const { Router } = require('express');

const routes = new Router();

let requisitionsNumber = 0;
const projects = [];

function checkID (req, res, next) {
  const { id } = req.params;
  const project = projects.find(projectId => projectId.id == id);

  if (!project) {
    return res.status(400).json({ error: 'Project not find' });
  }

  req.project = project;

  return next();
}

function requisitionsLog(req, res, next) {
  requisitionsNumber++;

  console.log(`Requisitions number: ${requisitionsNumber}`);

  return next();
}

routes.use(requisitionsLog);

routes.get('/projects', (req, res) => {
  return res.json(projects);
});

routes.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title, 
    tasks: []
  };

  projects.push(project);

  return res.json(project);
});

routes.put('/projects/:id', checkID, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

routes.get('/projects/:id', checkID, (req, res) => {
  return res.json(req.project);
});

routes.delete('/projects/:id', (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.json(projects);
});

routes.post('/projects/:id/tasks', checkID, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});

module.exports = routes;