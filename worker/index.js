const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS, PATCH',
  'Access-Control-Max-Age': '86400',
}

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  if (request.method === 'GET') {
    return handleGETRequest(request)
  } else if (request.method === 'POST') {
    return handlePOSTRequest(request)
  } else {
    return handlePATCHRequest(request)
  }
}

async function handleGETRequest(request) {
  let url = new URL(request.url)
  if (url.pathname === '/posts') {
    let value = await general_social_media.get('posts')
    return new Response(value, {
      headers: {
        'content-type': 'application/json',
      },
    })
  } else if (url.pathname === '/reset') {
    let posts = [
      {
        id: 1,
        title: 'My First Post',
        username: 'coolguy123',
        content: "Hey Y'all!",
        date: Date.now(),
        dislikes: 0,
        likes: 0,
      },
      {
        id: 2,
        title: 'Story About my Dogs',
        username: 'kn0thing',
        content: 'So the other day I was in the yard, and...',
        date: Date.now(),
        dislikes: 0,
        likes: 0,
      },
    ]
    await general_social_media.put('posts', JSON.stringify(posts))
  }

  return new Response(null, { status: 404 })
}

async function handlePATCHRequest(request) {
  let url = new URL(request.url)
  if (url.pathname === '/posts') {
    let allPosts = JSON.parse(await general_social_media.get('posts')) || []
    let data = await request.json()
    let postToModify = allPosts.find((e) => e.id === data.id)
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

async function handlePOSTRequest(request) {
  let url = new URL(request.url)
  if (url.pathname === '/posts') {
    let allPosts = JSON.parse(await general_social_media.get('posts')) || []
    let newPost = JSON.parse(await request.text())
    let mostCurrentPost = allPosts.pop()
    newPost.id = mostCurrentPost.id + 1
    allPosts.push(mostCurrentPost)
    allPosts.push(newPost)
    await general_social_media.put('posts', JSON.stringify(allPosts))
    let headers = { ...corsHeaders, 'content-type': 'application/json' }
    return new Response(JSON.stringify(newPost), {
      headers: {
        headers,
      },
    })
  } else if (url.pathname === '/upload') {
    let image = JSON.parse(await request.text())
    await general_social_media.put('images', image)
  }

  return new Response(null, { status: 404 })
}
