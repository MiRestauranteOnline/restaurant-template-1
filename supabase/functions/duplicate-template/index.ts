import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DuplicateTemplateRequest {
  template_id: string;
  new_name: string;
  new_slug: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { template_id, new_name, new_slug }: DuplicateTemplateRequest = await req.json();

    if (!template_id || !new_name || !new_slug) {
      throw new Error('template_id, new_name, and new_slug are required');
    }

    console.log(`🔄 Duplicating template: ${template_id} as ${new_slug}`);

    // Fetch the original template
    const { data: originalTemplate, error: fetchError } = await supabase
      .from('templates')
      .select('*')
      .eq('id', template_id)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch template: ${fetchError.message}`);
    }

    if (!originalTemplate) {
      throw new Error('Template not found');
    }

    // Check if slug already exists
    const { data: existingTemplate } = await supabase
      .from('templates')
      .select('id')
      .eq('slug', new_slug)
      .maybeSingle();

    if (existingTemplate) {
      throw new Error(`Template with slug "${new_slug}" already exists`);
    }

    // Create the new template
    const { data: newTemplate, error: insertError } = await supabase
      .from('templates')
      .insert({
        name: new_name,
        slug: new_slug,
        status: 'development', // Always start as development
        description: originalTemplate.description,
        folder_path: `src/templates/${new_slug}`,
        is_active: true,
        client_count: 0,
      })
      .select()
      .single();

    if (insertError) {
      throw new Error(`Failed to create template: ${insertError.message}`);
    }

    console.log(`✅ Template duplicated successfully: ${new_slug}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Template duplicated successfully',
        template: newTemplate,
        instructions: {
          nextSteps: [
            `1. Copy folder: src/templates/${originalTemplate.slug} → src/templates/${new_slug}`,
            `2. Update template README.md`,
            `3. Modify components as needed`,
            `4. Update App.tsx to register new template`,
            `5. Test thoroughly before setting status to "production"`,
          ],
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('❌ Error duplicating template:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
