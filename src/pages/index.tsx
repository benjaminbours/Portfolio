import React from "react";
import { graphql } from "gatsby";

export default props => {
  console.log(props);
  return (
    <>
      <h1>Hello Gatsby! Mec</h1>
      <p>Yo</p>
    </>
  );
};

// result of query received in props.data
export const query = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
// export const query = graphql`
//   query {
//     directusProjectTranslation {
//       language
//     }
//     allDirectusProjectTranslation(filter: { language: { eq: "en" } }) {
//       nodes {
//         description
//         language
//       }
//     }
//   }
// `;
