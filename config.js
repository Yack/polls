import { withData } from 'next-apollo'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { split } from 'apollo-link'
import { getMainDefinition } from 'apollo-utilities'
import ws from 'ws'
var WebSocketClient = require('websocket').client

const wsLink = new WebSocketLink({
  uri: `ws://hasura.yack.co/v1/graphql`,
  options: {
    reconnect: true,
    connectionParams: () => {
      return {
        headers: {
          'x-hasura-admin-secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET,
        },
      }
    },
  },
  webSocketImpl: WebSocketClient
})

const httpLink = new HttpLink({
  uri: 'https://hasura.yack.co/v1/graphql',
  opts: {
    credentials: 'include',
    headers: {
      'x-hasura-admin-secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET,
    },
  }
})

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink,
)

const config = { link }

export default withData(config)
