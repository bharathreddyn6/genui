const express = require("express");
const cors = require("cors");
const axios = require(`axios`);
const { PassThrough } = require("stream");
const multipass = require(`./modules/multipass/index.js`);
require("dotenv").config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("openv0.sqlite", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the database");
  }
});
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "openv0.sqlite",
  logging: false, // quiet mode
});

const Component = sequelize.define(
  "Component",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    version: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    framework: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    components: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    icons: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    query: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    logs: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { timestamps: false },
);

app.get("/components/list", async (req, res) => {
  const { framework, components, icons } = req.query;
  const db_response = await Component.findAll({
    where: {
      framework,
      components,
      icons,
    },
  });
  let retrieved_components = {};
  db_response
    .map((c) => c.toJSON())
    .map((c) => {
      const component = {
        version: c.version,
        description: c.description,
        //code: c.code,
      };
      if (Object.keys(retrieved_components).includes(c.name))
        retrieved_components[c.name].push(component);
      else retrieved_components[c.name] = [component];
    });
  res.json({
    items: Object.keys(retrieved_components).map((k) => {
      return {
        name: k,
        versions: retrieved_components[k].length,
        latest: retrieved_components[k].map((e) => e.version).slice(-1)[0],
        components: retrieved_components[k],
      };
    }),
  });
});

app.get("/components/get", async (req, res) => {
  const { framework, components, icons, name } = req.query;
  const db_response = await Component.findAll({
    where: {
      framework,
      components,
      icons,
      name,
    },
  });
  const retrieved_components = db_response
    .map((c) => c.toJSON())
    .map((c) => {
      return {
        name: c.name,
        description: c.description,
        version: c.version,
        code: c.code,
      };
    })
    .sort((a, b) => {
      return b.version - a.version;
    });
  res.json({
    items: retrieved_components,
  });
});

app.post("/components/iterate/:name", async (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  const duplexStream = new PassThrough();
  duplexStream.pipe(res);
  
  const { name } = req.params;
  const { description, framework, components, icons } = req.body;
  
  // Get the existing component
  const existingComponent = await Component.findOne({
    where: { name, framework, components, icons },
    order: [['version', 'DESC']],
  });
  
  if (!existingComponent) {
    res.status(404).send('Component not found');
    return;
  }
  
  const generated = await multipass.preset({
    stream: duplexStream,
    preset: `componentIterate_description`,
    query: {
      description,
      framework,
      components,
      icons,
      component: {
        name: existingComponent.name,
        description: existingComponent.description,
        code: existingComponent.code,
      },
    },
  });
});

app.post("/components/new/description", async (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  const duplexStream = new PassThrough();
  duplexStream.pipe(res);
  const generated = await multipass.preset({
    stream: duplexStream,
    preset: `componentNew_description`,
    query: {
      description: req.body.description,
      framework: req.body.framework,
      components: req.body.components,
      icons: req.body.icons,
    },
  });
  duplexStream.end();
});

app.post("/components/new/json", async (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  const duplexStream = new PassThrough();
  duplexStream.pipe(res);
  const generated = await multipass.preset({
    stream: duplexStream,
    preset: `componentNew_json`,
    query: {
      json: req.body.json,
      framework: req.body.framework,
      components: req.body.components,
      icons: req.body.icons,
    },
  });
  duplexStream.end();
});

app.post("/components/iterate/description", async (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  const duplexStream = new PassThrough();
  duplexStream.pipe(res);
  const generated = await multipass.preset({
    stream: duplexStream,
    preset: `componentIterate_description`,
    query: {
      description: req.body.description,
      component: req.body.component,
      framework: req.body.framework,
      components: req.body.components,
      icons: req.body.icons,
    },
  });
  duplexStream.end();
});

app.post("/components/share", async (req, res) => {
  const query = req.body; // {key,name,framework,...}
  const response = await axios.post(
    `${process.env.OPENV0__API}/dev/components/share`,
    {
      key: query.key,
      name: query.name,
      framework: query.framework,
      components: query.components,
      icons: query.icons,
      data: {
        versions: query.data.versions
          .map((component_version) => {
            if (!component_version.code || !component_version.code.length)
              return false;
            return {
              version: component_version.version,
              description: component_version.description
                ? component_version.description
                : ``,
              code: component_version.code,
            };
          })
          .filter((e) => e),
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  res.send(response.data);
});

// Delete component endpoint
app.delete("/components/delete/:name", async (req, res) => {
  const { name } = req.params;
  const { framework, components, icons } = req.query;
  
  try {
    // Delete from database
    const deleted = await Component.destroy({
      where: {
        name,
        framework: framework || 'react',
        components: components || 'nextui',
        icons: icons || 'lucide',
      },
    });

    // Delete generated files
    const fs = require('fs');
    const path = require('path');
    const componentDir = path.join(__dirname, process.env.WEBAPP_ROOT, 'src/components/openv0_generated', name);
    
    if (fs.existsSync(componentDir)) {
      fs.rmSync(componentDir, { recursive: true, force: true });
    }

    res.json({
      success: true,
      deleted: deleted,
      message: `Deleted ${deleted} component(s) with name: ${name}`,
    });
  } catch (error) {
    console.error('Error deleting component:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
