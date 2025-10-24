import { useEffect, useState } from 'react';
import { useClient } from '@/contexts/ClientContext';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const TermsOfServicePage = () => {
  const { client, loading } = useClient();
  const [policyData, setPolicyData] = useState<{ enabled: boolean; content: string } | null>(null);

  useEffect(() => {
    const fetchPolicyData = async () => {
      if (!client) return;
      
      const { data } = await supabase
        .from('client_policies')
        .select('terms_of_service_enabled, terms_of_service_content')
        .eq('client_id', client.id)
        .maybeSingle();

      if (data) {
        setPolicyData({
          enabled: data.terms_of_service_enabled,
          content: data.terms_of_service_content || ''
        });
      }
    };

    fetchPolicyData();
  }, [client]);

  if (loading || !policyData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Cargando...</div>
      </div>
    );
  }

  if (!policyData.enabled || !policyData.content) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-title-weight text-center mb-4">
            Términos y Condiciones
          </h1>
          {client?.restaurant_name && (
            <p className="text-center text-muted-foreground">{client.restaurant_name}</p>
          )}
        </div>
        
        <div 
          className="prose prose-slate dark:prose-invert max-w-none
            prose-headings:font-display prose-headings:font-title-weight
            prose-h1:text-4xl prose-h1:mb-6
            prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
            prose-p:text-base prose-p:leading-relaxed prose-p:mb-4
            prose-ul:my-6 prose-ol:my-6
            prose-li:my-2
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: policyData.content }}
        />
      </div>
    </div>
  );
};

export default TermsOfServicePage;
