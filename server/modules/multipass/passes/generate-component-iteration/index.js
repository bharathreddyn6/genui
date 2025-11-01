const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const tiktoken = require("@dqbd/tiktoken");
const tiktokenEncoder = tiktoken.get_encoding("cl100k_base");
require("dotenv").config();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const FRAMEWORKS_EXTENSION_MAP = {
  react: `tsx`,
  next: `tsx`,
  svelte: `svelte`,
};

function _titleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

async function run(req) {
  console.log("> init : " + __dirname.split(path.sep).slice(-2).join(`/`));

  const design_task = req.pipeline.stages["component-design-task"].data;
  const context = [
    {
      role: `system`,
      content:
        `You are an expert at writing and modifying ${_titleCase(
          req.query.framework,
        )} components.\n` +
        `Your task is to UPDATE an existing ${_titleCase(
          req.query.framework,
        )} component by applying specific changes requested by the user.\n` +
        `You will receive the CURRENT component code and a description of what needs to be changed.\n` +
        `You must KEEP the structure and functionality of the existing component and only APPLY the requested changes.\n` +
        `Do NOT create a completely new component from scratch - MODIFY the existing one.\n\n` +
        `The ${_titleCase(
          req.query.framework,
        )} component you write can make use of Tailwind classes for styling.\n` +
        `If you judge it is relevant to do so, you can use library components and icons.\n\n` +
        `You will write the full updated ${_titleCase(
          req.query.framework,
        )} component code, which should include all imports.` +
        `Your generated code will be directly written to a .${
          FRAMEWORKS_EXTENSION_MAP[req.query.framework]
        } ${_titleCase(
          req.query.framework,
        )} component file and used in production.`,
    },
    ...req.pipeline.stages[`component-design-context`].data,
    {
      role: `user`,
      content:
        `- COMPONENT NAME : ${req.query.component.name}\n\n` +
        `- COMPONENT DESCRIPTION :\n` +
        "```\n" +
        req.query.component.description +
        "\n```\n\n" +
        `- CURRENT COMPONENT CODE (MODIFY THIS CODE) :\n\n` +
        "```" +
        FRAMEWORKS_EXTENSION_MAP[req.query.framework] +
        "\n" +
        req.query.component.code +
        "\n```\n\n" +
        `- DESIRED COMPONENT UPDATES (APPLY THESE CHANGES TO THE CODE ABOVE) :\n\n` +
        "```\n" +
        design_task.description.user +
        "\n```\n\n" +
        `- additional component update suggestions :\n` +
        "```\n" +
        design_task.description.llm +
        "\n```\n\n\n" +
        `IMPORTANT: You must MODIFY the existing component code above by applying the requested changes. Do not create a completely new component from scratch. Take the CURRENT COMPONENT CODE and UPDATE it based on the DESIRED COMPONENT UPDATES.\n\n` +
        `Write the full updated code for the ${req.query.framework} web component, which uses Tailwind classes if needed (add tailwind dark: classes too if you can; backgrounds in dark: classes should be black), and optionally, library components and icons.\n` +
        "The full code of the new " +
        _titleCase(req.query.framework) +
        " component that you write will be written directly to a ." +
        FRAMEWORKS_EXTENSION_MAP[req.query.framework] +
        " file inside the " +
        _titleCase(req.query.framework) +
        " project. Make sure all necessary imports are done, and that your full code is enclosed with ```" +
        FRAMEWORKS_EXTENSION_MAP[req.query.framework] +
        " blocks.\n" +
        "Answer with generated code only. DO NOT ADD ANY EXTRA TEXT DESCRIPTION OR COMMENTS BESIDES THE CODE. Your answer contains code only ! component code only !\n" +
        `Important :\n` +
        `- Make sure you import provided components libraries and icons that are provided to you if you use them !\n` +
        `- Tailwind classes should be written directly in the elements class tags (or className in case of React). DO NOT WRITE ANY CSS OUTSIDE OF CLASSES\n` +
        `- Do not use libraries or imports except what is provided in this task; otherwise it would crash the component because not installed. Do not import extra libraries besides what is provided above !\n` +
        `- Do not have ANY dynamic data! Components are meant to be working as is without supplying any variable to them when importing them ! Only write a component that render directly with placeholders as data, component not supplied with any dynamic data.\n` +
        `- Only write the code for the component; Do not write extra code to import it! The code will directly be stored in an individual ${_titleCase(
          req.query.framework,
        )} .${FRAMEWORKS_EXTENSION_MAP[req.query.framework]} file !\n` +
        `${
          req.query.framework != "svelte"
            ? "- Very important : Your component should be exported as default !\n"
            : ""
        }` +
        `Write the updated version of the ${_titleCase(
          req.query.framework,
        )} component code as the creative genius and ${_titleCase(
          req.query.framework,
        )} component genius you are - with good ui formatting.\n`,
    },
  ];

  const model = genAI.getGenerativeModel({ 
    model: process.env.GOOGLE_MODEL || "gemini-pro",
  });

  console.dir({
    context: context.map((e) => {
      return { role: e.role, content: e.content.slice(0, 200) + " ..." };
    }),
  });

  const context_prompt_tokens = tiktokenEncoder.encode(
    context.map((e) => e.content).join(""),
  ).length;
  console.log(
    `> total context prompt tokens (estimate) : ${context_prompt_tokens}`,
  );

  const prompt = context.map(msg => `${msg.role}: ${msg.content}`).join('\n\n');

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

  let generated_code = ``;
  let start = false;
  for (let l of completion.split("\n")) {
    let skip = false;
    if (
      [
        "```",
        ...Object.values(FRAMEWORKS_EXTENSION_MAP).map((e) => "```" + e),
      ].includes(l.toLowerCase().trim())
    ) {
      start = !start;
      skip = true;
    }
    if (start && !skip) generated_code += `${l}\n`;
  }
  generated_code = generated_code.trim();

  return {
    type: `component-code`,
    success: true,
    data: generated_code,
  };
}

module.exports = {
  run,
};
