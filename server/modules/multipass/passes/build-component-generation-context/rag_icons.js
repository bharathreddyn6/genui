const fs = require("fs");
const path = require("path");

const { LocalIndex } = require(`vectra`);
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function run(query) {
  // query : { icons:["icon_suggested_by_llm" , "..."] , framework : 'svelte' , library : `lucide` }

  if (!query.icons || !query.icons.length)
    return {
      icons: [],
      import: require(
        `../../../../library/icons/${query.library}/metadata.json`,
      ).import[query.framework],
    };

  // Simplified icon retrieval without embeddings (Google's embedding API has quota limits)
  // Just return the suggested icon names directly
  const icons = query.icons.map((e) => {
    return {
      icon: e,
      retrieved: [e.toLowerCase().replace(/_/g, '-').replace(/icon$/i, '').trim()],
    };
  });
  
  return {
    icons,
    import: require(`../../../../library/icons/${query.library}/metadata.json`)
      .import[query.framework],
  };
}

module.exports = {
  run,
};
