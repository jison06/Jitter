const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS, PATCH',
  'Access-Control-Max-Age': '86400',
}

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Routes different types of HTTP requests
 * @param {Request} request
 */
async function handleRequest(request) {
  if (request.method === 'GET') {
    return handleGETRequest(request)
  } else if (request.method === 'POST') {
    return handlePOSTRequest(request)
  } else if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders })
  } else if (request.method === 'PATCH') {
    return handlePATCHRequest(request)
  }
}

/**
 * Gets all the posts in KV
 * @param {Request} request
 */
async function handleGETRequest(request) {
  let url = new URL(request.url)
  if (url.pathname === '/posts') {
    let value = await general_social_media.get('posts')
    let headers = { ...corsHeaders, 'content-type': 'application/json' }
    return new Response(value, {
      headers: headers,
    })
  } else if (url.pathname === '/') {
    return new Response(
      'Hello! Use the /posts endpoint to interact with this worker!',
      { headers: { 'content-type': 'text/plain' } },
    )
  }
  return new Response(null, { status: 404 })
}

/**
 * Increments the number of likes/dislikes of a post
 * @param {Request} request
 */
async function handlePATCHRequest(request) {
  let url = new URL(request.url)
  if (url.pathname === '/posts') {
    let allPosts = JSON.parse(await general_social_media.get('posts')) || []
    let data = await request.json()
    let postToModify = allPosts.find((e) => e.id === data.id) //finding the post to modify
    if (data.dislikes) {
      postToModify.dislikes += 1
    } else {
      postToModify.likes += 1
    }
    let headers = { ...corsHeaders, 'content-type': 'application/json' }
    await general_social_media.put('posts', JSON.stringify(allPosts))

    return new Response(JSON.stringify(allPosts), {
      headers: headers,
    })
  }

  return new Response(null, { status: 404 })
}

/**
 * Creates a new post
 * @param {Request} request
 */
async function handlePOSTRequest(request) {
  let url = new URL(request.url)
  if (url.pathname === '/posts') {
    let allPosts = JSON.parse(await general_social_media.get('posts')) || []
    let newPost = JSON.parse(await request.text())
    if (allPosts.length) {
      let mostCurrentPost = allPosts.pop() //getting the latest post in KV
      newPost.id = mostCurrentPost.id + 1 //adding an index to the new post
      allPosts.push(mostCurrentPost)
      allPosts.push(newPost)
      await general_social_media.put('posts', JSON.stringify(allPosts))
    } else {
      newPost.id = 1
      await general_social_media.put('posts', JSON.stringify(newPost))
    }
    let headers = { ...corsHeaders, 'content-type': 'application/json' }
    return new Response(JSON.stringify(newPost), {
      headers: headers,
    })
  }

  return new Response(null, { status: 404 })
}
