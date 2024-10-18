import { setupServer } from 'msw/node';
import EnumHandlers from './EnumHandlers';

// This configures a request mocking server with the given request handlers.
export const server = setupServer(
  ...EnumHandlers,
);
