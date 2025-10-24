import { useEffect, useState } from 'react';
import { useClient } from '@/contexts/ClientContext';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const PrivacyPolicyPage = () => {
  const { client, loading } = useClient();
  const [policyData, setPolicyData] = useState<{ enabled: boolean; content: string } | null>(null);

  useEffect(() => {
    const fetchPolicyData = async () => {
      if (!client) return;
      
      const { data } = await supabase
        .from('client_policies')
        .select('privacy_policy_enabled, privacy_policy_content')
        .eq('client_id', client.id)
        .single();

      if (data) {
        setPolicyData({
          enabled: data.privacy_policy_enabled,
          content: data.privacy_policy_content || ''
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
            Política de Privacidad
          </h1>
          {client?.restaurant_name && (
            <p className="text-center text-muted-foreground">{client.restaurant_name}</p>
          )}
        </div>
        
        <div 
          className="prose prose-slate dark:prose-invert max-w-none
            prose-headings:font-display prose-headings:font-title-weight
            prose-h2:text-2xl prose-h3:text-xl
            prose-p:leading-relaxed prose-p:mb-4
            prose-ul:my-4 prose-ol:my-4
            prose-li:my-2
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: policyData.content }}
        />
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
