export default async function handleBlogLike(active, postId, userId) {
    //increment like by 1

    try {
        let response = await fetch(`http://localhost:3000/posts/${postId}/${active}/${userId}/like`, {
            method: 'POST',
        })
        let res = await response.json()
        return res
    } catch (err) {
        console.log(err)
    }
}
