import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify the user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
    const metadata = JSON.parse(formData.get('metadata') as string || '{}')

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Upload file to Supabase Storage
    const fileName = `${user.id}/${Date.now()}-${file.name}`
    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from('documents')
      .upload(fileName, file)

    if (uploadError) {
      return new Response(
        JSON.stringify({ error: 'Failed to upload file to storage', details: uploadError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Insert document record
    const { data: docData, error: docError } = await supabaseClient
      .from('documents')
      .insert({
        user_id: user.id,
        filename: file.name,
        file_path: uploadData.path,
        file_size: file.size,
        content_type: file.type,
        metadata: { ...metadata, scope: user.id },
        status: 'processing'
      })
      .select()
      .single()

    if (docError) {
      return new Response(
        JSON.stringify({ error: 'Failed to save document record', details: docError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Upload to Ragie
    const ragieFormData = new FormData()
    ragieFormData.append('file', file)
    ragieFormData.append('metadata', JSON.stringify({ 
      scope: user.id,
      user_id: user.id,
      user_uuid: user.id,
      filename: file.name,
      upload_timestamp: new Date().toISOString()
    }))
    ragieFormData.append('mode', 'fast')

    const ragieResponse = await fetch('https://api.ragie.ai/documents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RAGIE_API_KEY')}`,
        'Accept': 'application/json'
      },
      body: ragieFormData
    })

    if (!ragieResponse.ok) {
      const ragieError = await ragieResponse.text()
      console.error('Ragie upload failed:', ragieError)
      
      // Update document status to failed
      await supabaseClient
        .from('documents')
        .update({ status: 'failed' })
        .eq('id', docData.id)

      return new Response(
        JSON.stringify({ error: 'Failed to upload to Ragie', details: ragieError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const ragieData = await ragieResponse.json()

    // Update document with Ragie ID and set status to ready
    const { error: updateError } = await supabaseClient
      .from('documents')
      .update({ 
        ragie_document_id: ragieData.id,
        status: 'ready' 
      })
      .eq('id', docData.id)

    if (updateError) {
      console.error('Failed to update document with Ragie ID:', updateError)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        document: { ...docData, ragie_document_id: ragieData.id, status: 'ready' },
        message: 'Document uploaded successfully' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Upload error:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})