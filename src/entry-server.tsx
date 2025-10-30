import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { ClientProvider } from './contexts/ClientContext';

export function render(url: string, domain: string) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        retry: false,
      },
    },
  });

  const html = ReactDOMServer.renderToString(
    <QueryClientProvider client={queryClient}>
      <ClientProvider domain={domain}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </ClientProvider>
    </QueryClientProvider>
  );
  
  return html;
}
