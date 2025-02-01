import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Comments from "../Comments/Comments";
import moment from "moment";
import DOMPurify from 'dompurify';
import PropTypes from "prop-types";
import Heart from "react-heart"
import validateToken from "../../helper-functions/validate-token";
import handleBlogLike from "../../helper-functions/handleBlogLike";
import { useNavigate } from "react-router-dom";
import './view.css'


export default function View({ isSignedIn }) {

    const { id, author } = useParams();
    const navigate = useNavigate();

    // State Variables
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState(null);
    const [rerender, setRerender] = useState(false);
    const [active, setActive] = useState(false);
    const [likes, setLikes] = useState(0);
    const [user, setUser] = useState(null);

    // Function to sanitize HTML content
    const sanitizedData = (data) => ({
        __html: DOMPurify.sanitize(data)
    });

    // Function to handle Like
    const handleLike = async () => {
        if (isSignedIn) {
            try {
                let res = await handleBlogLike(active, id, user.id);
                console.log("After liking post:", res.message);
                setActive(!active);
            } catch (error) {
                console.error("Error handling like:", error);
            }
        } else {
            navigate("/sign-in");
        }
    };



    // Fetch user, post, and comments concurrently
    useEffect(() => {
        async function fetchData() {
            try {
                const [userData, postResponse, commentsResponse] = await Promise.all([
                    validateToken('false'),
                    fetch(`https://blog-backend-production-6422.up.railway.app/posts/${id}`),
                    fetch(`https://blog-backend-production-6422.up.railway.app/posts/${id}/comments`)
                ]);

                if (!postResponse.ok) throw new Error("Failed to fetch post");
                if (!commentsResponse.ok) throw new Error("Failed to fetch comments");

                const postData = await postResponse.json();
                const commentsData = await commentsResponse.json();

                let users_liked_post = postData.user_liked_posts  //an array of objects containing postId and userId

                //loop over this array ands check if userData.id equals the userId in this array

                users_liked_post.forEach((item) => {
                    if (item.userId == userData.id) {
                        if (active == false) {
                            setActive(true)
                        }
                    }
                })

                console.log('Post Data', postData)
                console.log('User data', userData)
                setUser(userData);
                setPost(postData);
                setLikes(postData.likes);
                setComments(commentsData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
    }, [rerender, active]);


    if (!post) {
        return (
            <>
                Loading
            </>
        )
    }
    const formattedDate = moment(post.created_at).format("D MMM, YYYY");
    const formattedReadTime = `${post.readTime} min`;

    return (
        <>
            <div className="blog-container">
                <img src={post.imageURL} alt={post.title} className="blog-image" />
                <div className="blog-content">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h1 className="blog-title">{post.title}</h1>
                        {post.isPublished ?

                            <div style={{ width: "2rem" }}>
                                <Heart isActive={active} onClick={() => handleLike()} />

                                <div style={{ textAlign: 'center' }}>{likes}</div>
                            </div>

                            : <></>
                    
                        }

                    </div>

                    <div className="blog-meta">
                        <span>{formattedDate}</span>
                        <span>•</span>
                        <span>{formattedReadTime} read</span>
                        <span>•</span>
                        <span>By {author}</span>
                    </div>
                    <hr style={{ margin: '1rem 0' }}></hr>
                    <div
                        className="blog-body"
                        dangerouslySetInnerHTML={sanitizedData(post.body)}
                    ></div>
                </div>
            </div>

            {/* Now we have to render the comments under this post */}

            {post.isPublished ?
                <div className="comments-header">

                    <h1>
                        <hr style={{ margin: '1rem 0' }}></hr>
                        Comments ({comments != null ? comments.length : "0"})
                    </h1>
                    {comments != null ? <Comments comments={comments} postId={id} rerender={rerender} setRerender={(value) => setRerender(value)}></Comments> : ""}


                </div>
                : <></>
            }


        </>
    );
}

View.propTypes = {
    isSignedIn: PropTypes.boolean
}
