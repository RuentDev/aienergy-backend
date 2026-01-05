import { typeDefs } from "../custom-graphql/typeDefs";
import { resolvers } from "../custom-graphql/resolvers";
import { resolversConfig } from "../custom-graphql/resolversConfig";

export default (strapiExt: any) => {
  return {
    typeDefs: typeDefs,
    resolvers: resolvers,
    resolversConfig: resolversConfig,
  };
};
