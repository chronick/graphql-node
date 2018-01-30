const _ = require('lodash');
const uuid = require('uuid/v4');
const faker = require('faker');
const { graphql, buildSchema } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');

const pictures = _.range(5).map(i => ({
  id: i,
  url: faker.image.imageUrl()
}))

const annotations = _.range(10).map(i => ({
  id: i,
  pictureId: _.sample(pictures).id
}))

console.log(_.find(annotations, { id: 1 }))

// Construct a schema, using GraphQL schema language
const typeDefs = `
  type Picture {
    id: Int
    url: String
  }

  type Annotation {
    id: Int
    pictures: [Picture]
  }

  type Query {
    getAnnotation(id: Int!): Annotation
  }
`;

// The root provides a resolver function for each API endpoint
const resolvers = {
  Query: {
    getAnnotation(obj, { id }) {
      return _.find(annotations, { id })
    },
  },

  Annotation: {
    pictures: (annotation) => _.filter(pictures, {id: annotation.pictureId})
  }
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

const query = `
  query {
    getAnnotation(id: 1) {
      id,
      pictures {
        id, url
      }
    }
  }
`

// Run the GraphQL query '{ hello }' and print out the response
graphql(schema, query).then((response) => {
  console.log(JSON.stringify(response, null, 2));
});