import PropTypes from "prop-types"
import { useState, useEffect } from "react";
import moment from "moment";
import validateToken from "../../helper-functions/validate-token";
import './comments.css'
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

export default function Comments({ comments, postId, rerender, setRerender }) {

    console.log('Comments', comments)
    const navigate = useNavigate();

    const [newComment, setNewComment] = useState("");
    const [user, setUser] = useState(null)
    const [updateComment, setUpdateComment] = useState(null)


    useEffect(() => {
        async function validate() {
            let data = await validateToken()
            if (!data) {
                return
            }
            else {
                console.log('Signed in user', data)
                setUser(data)
            }
        }
        validate()
    }, [])

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleCancelUpdate = () => {
        setUpdateComment(null)
        setNewComment("")
    }

    const handleCommentUpdate = async () => {
        let data = {
            content: newComment,
            date: newComment.created_at
        }
    
        try {
            let response = await fetch(`https://blog-backend-production-6422.up.railway.app/posts/${updateComment.postId}/comments/${updateComment.comment_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
    
            
            if (!response.ok) {
                const errorData = await response.json(); 
                throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
            }
    
            const result = await response.json();
            console.log("Comment updated:", result);
            setRerender(!rerender);
            setUpdateComment(null)
            setNewComment("")
            
        } catch (err) {
            console.error("Error updating comment:", err.message);
        }
    };

    const handleCommentDelete = async (commentId, postId) => {
        try {
            let response = await fetch(`https://blog-backend-production-6422.up.railway.app/posts/${postId}/comments/${commentId}`, {
                method: 'DELETE'
            })
            if (response.status != 200) {
                throw new Error('Error deleting comment')
            }
            console.log('Response in delete comment', response)
            response = await response.json()
            console.log(response.message)
            setRerender(!rerender)
        } catch (err) {
            console.log(err)
        }
    }

    async function handleCommentUpdateView(comment) {

        setUpdateComment(comment)
        setNewComment(comment.body)

    }
    async function handleCommentSubmit() {
        let comment = newComment.trim()
        if (comment.length == 0) {
            alert('Comment cant be empty')
            return
        }

        //now check if user is signed in
        //to do this we have to send token to server and validate it
        //if not valid, show an alert to user to sign in
        if (user) {

            try {

                //now we have the signed in users id in data.id
                //we have to send a post request to the server to create a new comment

                const payload = {
                    content: comment,
                    userId: user.id
                };
                try {
                    console.log(postId)
                    const response = await fetch(`https://blog-backend-production-6422.up.railway.app/posts/${postId}/comments`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',

                        },
                        body: JSON.stringify(payload),
                    });

                    let res = await response.json()
                    console.log('Res', res)
                    if (response.status == 200) {
                        console.log('I am here')
                        console.log(res.message)

                        //now we have to rerender the view component so comment can be added there
                        setRerender(!rerender)
                    }
                    else {
                        throw new Error(res.error)
                    }
                } catch (err) {
                    console.error('Error posting post:', err);
                }

            }
            catch (error) {
                console.error('Error decoding token:', error);
            }
        }
        else {
            navigate('/sign-in')
        }

        setNewComment("");

    };
    return (
        <>
            <div className="comments-section">
                {comments.length === 0 ? (
                    <p className="no-comments">No comments yet.</p>
                ) : (
                    comments
                        .filter((comment) => !updateComment || comment.comment_id !== updateComment.comment_id)
                        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
                        .map((comment) => (
                            <div key={comment.comment_id} className="comment">
                                <div className="comment-header">
                                    <span className="comment-author">{comment.User.username}</span>
                                    <span className="comment-date">
                                        {moment(comment.created_at).format("DD MMM YYYY")}
                                    </span>
                                </div>
                                <p className="comment-body">{comment.body}</p>
    
                                {comment.userId == user?.id ? 
                                    <div>
                                        <Button
                                            variant="contained"
                                            color="warning"
                                            onClick={() => handleCommentDelete(comment.comment_id, comment.postId)}
                                            sx={{ marginRight: 1, fontSize: '10px' }}
                                        >
                                            Delete
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleCommentUpdateView(comment)}
                                            sx={{ fontSize: '10px' }}
                                        >
                                            Edit
                                        </Button>
                                    </div>
                                    : <></>
                                }
                            </div>
                        ))
                )}
            </div>
            <div className="comment-input">
                <textarea
                    required
                    placeholder="Add a new comment"
                    value={newComment}
                    onChange={handleCommentChange}
                    className="comment-box"
                    rows="3"
                ></textarea>
                {updateComment ? 
                    <div style={{display: 'flex', flexDirection : 'column', gap:  '0.5rem'}}>
                        <button onClick={()=>handleCommentUpdate()} className="comment-button">
                            Update
                        </button>
                        <button onClick={()=>handleCancelUpdate()} className="comment-button cancel">
                            Cancel
                        </button>
                    </div> :
                    <button onClick={handleCommentSubmit} className="comment-button">
                        Comment
                    </button>
                }
            </div>
        </>
    );
}

Comments.propTypes = {
    comments: PropTypes.array,
    postId: PropTypes.number,
    rerender: PropTypes.bool,
    setRerender: PropTypes.func
}
