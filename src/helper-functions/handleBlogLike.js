export default async function handleBlogLike(active, postId, userId) {
    //increment like by 1

    try {
        let response = await fetch(`https://blog-backend-production-6422.up.railway.app/posts/${postId}/${active}/${userId}/like`, {
            method: 'POST',
        })
        let res = await response.json()
        return res
    } catch (err) {
        console.log(err)
    }
}
