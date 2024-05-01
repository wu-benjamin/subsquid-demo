import {Model} from '@subsquid/openreader/lib/model'
import {GraphQLSchema, OperationDefinitionNode} from 'graphql'
import { DISABLE_ACCESS_CONTROL, QUERY_ACCESS_TOKEN } from '../utils/env'

interface HttpHeaders extends Iterable<[string, string]> {
    get(name: string): string | null
    has(name: string): boolean
    entries(): Iterator<[string, string]>
    keys(): Iterator<string>
}

interface HttpRequest {
    readonly url: string
    readonly method: string
    readonly headers: HttpHeaders
}

interface RequestCheckContext {
  http: HttpRequest
  operation: OperationDefinitionNode
  operationName: string | null
  schema: GraphQLSchema
  context: Record<string, any>
  model: Model
}

// Interceptor for GraphQL HTTP requests
export async function requestCheck(req: RequestCheckContext): Promise<boolean | string> {
  if (DISABLE_ACCESS_CONTROL) {
    return true;
  }
  // Requests are protected by QUERY_ACCESS_TOKEN
  const authHeader = req.http.headers.get("authorization");
  if (authHeader !== `Bearer ${QUERY_ACCESS_TOKEN}`) {
    return "Unauthorized";
  }
  return true;
}