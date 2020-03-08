require('dotenv').config();
// console.log(process.env);

module.exports = {
  // ...,
  siteMetadata: {
    title: 'Benjamin Bours Portfolio'
  },
  plugins: [
    "gatsby-plugin-typescript",
    "gatsby-plugin-sass",
    {
      resolve: "@directus/gatsby-source-directus",
      options: {
        url: "http://localhost:8080/",
        project: "_",
        auth: {
          email: process.env.EMAIL,
          password: process.env.DB_PASSWORD,
        },
        targetStatuses: ["published", "__NONE__"],
      },
    },
  ],
};
