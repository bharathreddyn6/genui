const fs = require("fs");
const mongoose = require("mongoose-schema-jsonschema")();
const config = require("mongoose-schema-jsonschema/config");
const { Schema } = require("mongoose");
const schema = require("schm");
const { validate } = schema;
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
const path = require("path");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

function _titleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function _randomUid(length) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

LIBRARY_COMPONENTS_MAP = {};
fs.readdirSync(`./library/components`)
  .filter((e) => !e.includes(`.`))
  .map((framework) => {
    LIBRARY_COMPONENTS_MAP[framework] = {};
    fs.readdirSync(`./library/components/${framework}`)
      .filter((e) => !e.includes(`.`))
      .map((components) => {
        LIBRARY_COMPONENTS_MAP[framework][components] = require(
          `../../../../library/components/${framework}/${components}/dump.json`,
        ).map((e) => {
          return {
            name: e.name,
            description: e.description,
          };
        });
      });
  });

async function run(req) {
  console.log("> init : " + __dirname.split(path.sep).slice(-2).join(`/`));

  const components_schema = {
    new_component_name: { type: String, required: true },
    new_component_description: {
      type: String,
      required: true,
      description: `Write a description for the ${_titleCase(
        req.query.framework,
      )} component design task based on the user query. Stick strictly to what the user wants in their request - do not go off track`,
    },
    new_component_icons_elements: {
      does_new_component_need_icons_elements: { type: Boolean, required: true },
      if_so_what_new_component_icons_elements_are_needed: [{ type: String }],
    },
    use_library_components: [
      {
        library_component_name: {
          type: String,
          enum: LIBRARY_COMPONENTS_MAP[req.query.framework][
            req.query.components
          ].map((e) => e.name),
        },
        library_component_usage_reason: String,
      },
    ],
  };

  const context = [
    {
      role: `system`,
      content:
        `Your task is to design a new ${req.query.framework} component for a web app, according to the user's request.\n` +
        `If you judge it is relevant to do so, you can specify pre-made library components to use in the task.\n` +
        `You can also specify the use of icons if you see that the user's request requires it.`,
    },
    {
      role: `user`,
      content:
        "Multiple library components can be used while creating a new component in order to help you do a better design job, faster.\n\nAVAILABLE LIBRARY COMPONENTS:\n```\n" +
        LIBRARY_COMPONENTS_MAP[req.query.framework][req.query.components]
          .map((e) => {
            return `${e.name} : ${e.description};`;
          })
          .join("\n") +
        "\n```",
    },
    {
      role: `user`,
      content:
        "USER QUERY : \n```\n" +
        req.query.description +
        "\n```\n\n" +
        `Design the new ${req.query.framework} web component task for the user as the creative genius you are`,
    },
  ];

  const model = genAI.getGenerativeModel({ 
    model: process.env.GOOGLE_MODEL || "gemini-pro",
  });

  const schema = new Schema(components_schema, { _id: false }).jsonSchema();
  
  const prompt = context.map(msg => `${msg.role}: ${msg.content}`).join('\n\n') + 
    '\n\nPlease respond with a JSON object matching this schema:\n' + 
    JSON.stringify(schema, null, 2) + 
    '\n\nRespond ONLY with the JSON object, no other text.';

  let completion = "";
  const result = await model.generateContentStream(prompt);
  
  for await (const chunk of result.stream) {
    try {
      const chunkText = chunk.text();
      process.stdout.write(chunkText);
      completion += chunkText;
      req.stream.write(chunkText);
    } catch (e) {
      false;
    }
  }

  req.stream.write(`\n`);

  // Clean up the completion text to extract JSON
  let jsonText = completion.trim();
  // Remove markdown code blocks if present
  jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  // Remove any text before the first { and after the last }
  const firstBrace = jsonText.indexOf('{');
  const lastBrace = jsonText.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1) {
    jsonText = jsonText.substring(firstBrace, lastBrace + 1);
  }

  const component_design = {
    ...{
      new_component_name: false,
      new_component_description: false,
      new_component_icons_elements: false,
      use_library_components: false,
    },
    ...JSON.parse(jsonText),
  };

  const component_task = {
    name: `${component_design.new_component_name}_${_randomUid(5)}`,
    description: {
      user: req.query.description,
      llm: component_design.new_component_description,
    },
    icons: !component_design.new_component_icons_elements
      ? false
      : !(
          component_design.new_component_icons_elements
            .does_new_component_need_icons_elements &&
          component_design.new_component_icons_elements
            .if_so_what_new_component_icons_elements_are_needed &&
          component_design.new_component_icons_elements
            .if_so_what_new_component_icons_elements_are_needed.length
        )
      ? false
      : component_design.new_component_icons_elements.if_so_what_new_component_icons_elements_are_needed.map(
          (e) => e.toLowerCase(),
        ),
    components: !component_design.use_library_components
      ? false
      : component_design.use_library_components.map((e) => {
          return {
            name: e.library_component_name,
            usage: e.library_component_usage_reason,
          };
        }),
  };

  return {
    type: `component-design-task`,
    success: true,
    data: component_task,
  };
}

module.exports = {
  run,
};
