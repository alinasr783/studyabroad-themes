import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { siteName, slug, clientId } = await req.json()

    // GitHub credentials from environment
    const githubToken = Deno.env.get('GITHUB_TOKEN')!
    const githubUsername = 'alinasr783'
    const templateRepo = 'studyabroad-buddy'

    // Create new repository
    const createRepoResponse = await fetch(`https://api.github.com/user/repos`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `${slug}-studyabroad`,
        description: `Study abroad website for ${siteName}`,
        private: false,
        auto_init: true,
      }),
    })

    if (!createRepoResponse.ok) {
      throw new Error(`Failed to create repository: ${createRepoResponse.statusText}`)
    }

    const repoData = await createRepoResponse.json()

    // Get template repository content
    const templateContentResponse = await fetch(
      `https://api.github.com/repos/${githubUsername}/${templateRepo}/zipball/main`,
      {
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    )

    if (!templateContentResponse.ok) {
      throw new Error(`Failed to get template content: ${templateContentResponse.statusText}`)
    }

    // Note: In a production environment, you would:
    // 1. Download the template repository
    // 2. Extract and modify files (especially config files with CLIENT_ID)
    // 3. Push the modified content to the new repository
    // This is a complex process that requires file manipulation

    console.log(`Repository created successfully: ${repoData.html_url}`)

    return new Response(
      JSON.stringify({
        success: true,
        repoUrl: repoData.html_url,
        repoName: repoData.name,
        message: 'Repository created successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})