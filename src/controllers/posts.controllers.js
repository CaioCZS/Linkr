import {
  createPostDB,
  dbDislikePost,
  dbLikePost,
  getPostByPostUrlAndUserId,
} from "../repository/posts.repositories.js"

export async function createPost(req, res) {
  const { id } = req.params
  const { description, postUrl } = req.body

  try {
    await createPostDB(description, postUrl, id)
    const post = await getPostByPostUrlAndUserId(postUrl, id)
    const result = {
      id: post.rows[0].id,
      postUrl: post.rows[0].postUrl,
      userId: post.rows[0].userId,
    }
    return res.status(201).send(result)
  } catch (err) {
    return res.status(500).send(err.message)
  }
}

export async function likePost(req, res) {
  const { id } = req.params

  try {
    await dbLikePost(id, userId) //ainda nao tem acesso ao userID(fazer middlewara authValidation para pegar)
    res.send("Post liked")
  } catch (err) {
    res.status(500).send(err.message)
  }
}

export async function dislikePost(req, res) {
  const { id } = req.params

  try {
    await dbDislikePost(id, userId) //ainda nao tem acesso ao userID(fazer middlewara authValidation para pegar)
    res.send("Post disliked")
  } catch (err) {
    res.status(500).send(err.message)
  }
}
